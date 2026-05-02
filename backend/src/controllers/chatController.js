import mongoose from 'mongoose';
import { CHAT_TIMEOUT_MS, streamAiChat } from '../services/aiClient.js';
import { getRelevantDocumentContext } from '../services/documentContext.js';

const MAX_DOCUMENT_IDS = 5;

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const formatRetryTime = (retryAfterMs) => {
  if (!Number.isFinite(retryAfterMs) || retryAfterMs <= 0) {
    return '';
  }

  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return ` Please retry in about ${seconds}s.`;
};

const buildStreamErrorMessage = (error, isTimeout) => {
  if (isTimeout) {
    return '\n\n[The AI response timed out. Please try again.]';
  }

  const status = error?.upstreamStatus || error?.statusCode;
  if (status === 429) {
    const retryHint = formatRetryTime(error?.retryAfterMs);
    return `\n\n[AI quota/rate limit reached.${retryHint}]`;
  }

  if (status === 401 || status === 403) {
    return '\n\n[AI provider authentication failed. Please check API keys.]';
  }

  return '\n\n[The AI response failed. Please try again.]';
};

const validateMessages = (messages) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw createHttpError('Please send at least one chat message.');
  }


  return messages.map((message) => {
    const role = message?.role;
    const content = String(message?.content || '').trim();

    if (!['user', 'assistant'].includes(role)) {
      throw createHttpError('Invalid chat message role.');
    }

    if (!content) {
      throw createHttpError('Chat message content is required.');
    }

   

    return { role, content };
  });
};

const validateDocumentIds = (documentIds) => {
  if (documentIds === undefined) {
    return [];
  }

  if (!Array.isArray(documentIds)) {
    throw createHttpError('documentIds must be an array.');
  }

  return documentIds
    .map((id) => String(id || '').trim())
    .filter(Boolean)
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .slice(0, MAX_DOCUMENT_IDS);
};

const validateClientDocuments = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }

  return documents
    .map((document) => ({
      id: String(document?.id || '').trim(),
      originalName: String(document?.originalName || '').trim(),
      size: Number(document?.size || 0),
      extractionStatus: document?.extractionStatus,
      textLength: Number(document?.textLength || 0),
      textPreview: String(document?.textPreview || '').slice(0, 1000),
    }))
    .filter((document) => document.id && document.originalName)
    .slice(0, MAX_DOCUMENT_IDS);
};

const addDocumentContextToMessages = ({ messages, context, documents, mode }) => {
  if (!context && documents.length === 0) {
    return messages;
  }

  const documentList = documents
    .map(
      (document) =>
        `- ${document.originalName} (${document.extension || 'file'}, ${document.size || 0} bytes, extraction: ${document.extractionStatus || 'unknown'}, indexed chars: ${document.textLength || 0})`
    )
    .join('\n');
  const documentPreviews = documents
    .map((document) => {
      const preview = String(document.textPreview || '').trim();
      return preview
        ? `[${document.originalName} | overview]\n${preview}`
        : `[${document.originalName} | overview]\nNo readable text preview was extracted.`;
    })
    .join('\n\n');
  const lastUserIndex = messages.findLastIndex((message) => message.role === 'user');

  if (lastUserIndex === -1) {
    return messages;
  }

  return messages.map((message, index) => {
    if (index !== lastUserIndex) {
      return message;
    }

    return {
      ...message,
      content: [
        'DOCUMENT_CONTEXT_START',
        'Use this uploaded file context silently as part of the conversation. These are the only target files for the current user question.',
        mode === 'whole-document'
          ? 'This is WHOLE_DOCUMENT_CONTEXT. If the context or metadata says there are N main sections, output N top-level bullets and cover every main section. Do not stop after Part 1.'
          : 'This is RELEVANT_EXCERPT_CONTEXT. Answer only from the relevant excerpts.',
        'Do not answer from other uploaded files unless they are listed in this context.',
        'If the user asks what file was uploaded, answer from Uploaded files and Document overview.',
        'If answering from document contents, cite sources in Thai format: อ้างอิง: หน้า X บรรทัด Y-Z',
        'If the user asks to summarize the whole file or asks what is in the file, cover every main section present in the provided excerpts, not only the first matching section.',
        'If the answer is not found in the context, say it was not found in the uploaded document context.',
        '',
        'Uploaded files:',
        documentList || 'No uploaded file metadata was provided.',
        '',
        'Document overview:',
        documentPreviews || 'No document overview is available.',
        '',
        context
          ? mode === 'whole-document'
            ? 'Whole document excerpts:'
            : 'Relevant excerpts:'
          : 'Relevant excerpts: none available.',
        context || 'No readable text excerpts are available for these files.',
        'DOCUMENT_CONTEXT_END',
        '',
        'User question:',
        message.content,
      ].join('\n'),
    };
  });
};

export const streamChat = async (req, res, next) => {
  let messages;
  let documentIds;
  let clientDocuments;

  try {
    messages = validateMessages(req.body?.messages);
    documentIds = validateDocumentIds(req.body?.documentIds);
    clientDocuments = validateClientDocuments(req.body?.documents);
  } catch (error) {
    return next(error);
  }

  try {
    if (documentIds.length > 0 || clientDocuments.length > 0) {
      const latestUserMessage =
        [...messages].reverse().find((message) => message.role === 'user')?.content || '';
      const documentContext = await getRelevantDocumentContext({
        documentIds,
        userId: req.user.id,
        query: latestUserMessage,
        clientDocuments,
      });

      messages = addDocumentContextToMessages({
        messages,
        context: documentContext.context,
        documents: documentContext.documents,
        mode: documentContext.mode,
      });
    }
  } catch (error) {
    return next(error);
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, CHAT_TIMEOUT_MS);

  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    await streamAiChat({
      messages,
      signal: abortController.signal,
      onChunk: (chunk) => {
        res.write(chunk);
      },
    });
  } catch (error) {
    if (!res.writableEnded) {
      const message = buildStreamErrorMessage(
        error,
        abortController.signal.aborted || error.name === 'AbortError'
      );
      res.write(message);
    }
  } finally {
    clearTimeout(timeout);

    if (!res.writableEnded) {
      res.end();
    }
  }
};
