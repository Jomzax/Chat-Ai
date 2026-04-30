import { FileText, TerminalSquare, Lightbulb } from "lucide-react";
import type { Suggestion } from "@/types/chat";

const ICON_MAP = {
  document: { Icon: FileText, bg: "bg-indigo-50", color: "text-indigo-600" },
  code: { Icon: TerminalSquare, bg: "bg-emerald-50", color: "text-emerald-600" },
  lightbulb: { Icon: Lightbulb, bg: "bg-sky-50", color: "text-sky-600" },
};

type Props = {
  suggestion: Suggestion;
  className?: string;
  onClick?: () => void;
};


