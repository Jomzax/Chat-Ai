# ChatAI — Web Chat with AI + Document Q&A

Web Application สำหรับคุยกับ AI และถามคำถามเกี่ยวกับเอกสารที่อัปโหลด (PDF/TXT) พร้อมระบบ Login, Token Usage Counter และ Citation จากเอกสารต้นทาง

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB
- **AI API:** Claude API / Gemini API
- **Authentication:** JWT + bcrypt
- **Deploy:** Docker Compose
- **Vector DB:** ไม่ได้ใช้ (ไม่ได้ทำ RAG)

## Setup & Run

ต้องมี Docker Desktop ติดตั้งไว้ก่อน จากนั้นรันคำสั่งเดียว

```bash
docker compose up
```

จะรัน frontend, backend และ MongoDB พร้อมกัน

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- MongoDB: localhost:27017

**Mock User สำหรับ Login:** `admin` / `admin123`

## Features Done

- [x] Login + Protected Routes (JWT + bcrypt + session management)
- [x] File Upload (PDF/TXT) พร้อม validate type/size และ sanitize path
- [x] Chat with AI (basic) พร้อม error handling และ timeout
- [x] Chat with Uploaded File Context (รองรับไฟล์ขนาดใหญ่)
- [x] Token Usage Counter (แสดง total ต่อ session)
- [x] Markdown rendering ในคำตอบ AI
- [x] Citation แสดงที่มาจากเอกสาร
- [x] Streaming response
- [x] Conversation history (save/load)
- [x] Rate limiting / API key rotation
- [x] Docker Compose + Healthcheck
- [x] Unit tests (coverage ≥ 40%)
- [ ] RAG with Vector DB (chunking + embedding + retrieval) — ยังไม่ทำ

## Architecture

โปรเจคแบ่งเป็น 2 service หลักที่แยกกันชัดเจน + 1 database

```
┌─────────────┐      ┌─────────────┐      ┌──────────┐
│  Next.js    │─────▶│  Express    │─────▶│ MongoDB  │
│  Frontend   │ HTTP │  Backend    │      │          │
│  (port 3000)│      │  (port 4000)│      │          │
└─────────────┘      └──────┬──────┘      └──────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │ Claude /    │
                     │ Gemini API  │
                     └─────────────┘
```

**Frontend (`frontend/src/`)**
- `app/` — Next.js App Router (login, chat, upload, usage)
- `api/` — API client เรียก backend
- `components/`, `hooks/`, `lib/`, `types/`, `validators/` — แยกตามหน้าที่

**Backend (`backend/src/`)**
- `routes/` → `controllers/` → `services/` → `models/` (layering ชัด)
- `middlewares/` — auth (JWT), upload (multer + validate)
- `services/aiClient.js` — เรียก Claude/Gemini API พร้อม streaming
- `services/uploadCleanup.js` — ลบไฟล์เก่าอัตโนมัติ

**Document Q&A flow:** อัปโหลดไฟล์ → parse เป็น text → ส่งทั้งเอกสารเป็น context ให้ AI พร้อม prompt (ไม่ได้ chunk/embed เพราะไม่ได้ทำ RAG)

## Known Issues

- **ไม่มี RAG** — ส่งเอกสารทั้งไฟล์เป็น context จึงเปลือง token เมื่อไฟล์ใหญ่ และจำกัดด้วย context window ของโมเดล
- **Mock user แบบ hardcode** — login ใช้ admin/admin123 ที่ตายตัว ยังไม่มีระบบ register/manage user จริง
- **Citation เป็นแบบหยาบ** — อ้างอิงระดับเอกสาร/หน้า ยังไม่ได้ลงลึกถึง chunk หรือ offset ที่แน่นอน
- **Conversation history** — เก็บใน MongoDB แต่ยังไม่มีระบบลบ/export/search ประวัติ
- **API key rotation** — สลับ key เมื่อชน rate limit แต่ยังไม่มี dashboard ดู quota แต่ละ key
- **ไฟล์ใหญ่มาก** — ถ้าเกิน context window ของโมเดลจะตัดเนื้อหาทิ้ง (เพราะไม่มี retrieval) — ทางแก้คือทำ RAG ใน feature D ซึ่งยังไม่ได้ทำ
