export type Category =
  | "robo"
  | "estafa"
  | "fraude_digital"
  | "vehiculo_robado"
  | "violencia"
  | "otro";

export type ReportStatus = "pending" | "verified" | "rejected";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  region: string;
  status: ReportStatus;
  votes: number;
  userVote?: "up" | "down" | null;
  createdAt: string;
  isAnonymous: boolean;
  author?: string;
  evidence?: string[];
}

export interface Zone {
  name: string;
  region: string;
  count: number;
  trend: "up" | "down" | "stable";
}

export interface TopAccount {
  handle: string;
  platform: "instagram" | "facebook" | "tiktok" | "twitter" | "whatsapp";
  reports: number;
  category: Category;
}

export interface Stats {
  total: number;
  today: number;
  verified: number;
  activeZones: number;
}

export interface ToastData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: Category;
  location: string;
  region: string;
  evidence: string;
  isAnonymous: boolean;
}
