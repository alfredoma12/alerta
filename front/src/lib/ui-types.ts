export type Category =
  | 'robo'
  | 'estafa'
  | 'fraude_digital'
  | 'vehiculo_robado'
  | 'violencia'
  | 'otro'

export type ReportStatus = 'pending' | 'verified' | 'rejected'
export type SearchMode = 'vehicle' | 'scam'
export type VerificationState = 'unverified' | 'review' | 'community_verified'

export interface Report {
  id: string
  title: string
  description: string
  category: Category
  location: string
  region: string
  status: ReportStatus
  votes: number
  userVote?: 'up' | 'down' | null
  createdAt: string
  isAnonymous: boolean
  author?: string
  evidence?: string[]
  plate?: string
  brand?: string
  model?: string
  color?: string
  year?: string
  chassisNumber?: string
  scamPersonName?: string
  scamRut?: string
  scamAlias?: string
  scamType?: string
  verificationState?: VerificationState
  flagsCount?: number
}

export interface Zone {
  name: string
  region: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

export interface TopAccount {
  handle: string
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'whatsapp' | 'registro'
  reports: number
  category: Category
}

export interface Stats {
  total: number
  today: number
  verified: number
  activeZones: number
}

export interface ToastData {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
}

export interface ReportFormData {
  mode: SearchMode
  plate: string
  brand: string
  model: string
  color: string
  year: string
  chassisNumber: string
  theftDate: string
  reward: string
  personName: string
  rut: string
  alias: string
  scamType: string
  title: string
  description: string
  category: Category
  location: string
  region: string
  evidence: string
  evidenceLinks: string
  isAnonymous: boolean
}
