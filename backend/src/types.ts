export interface Report {
  id: string;
  licensePlate: string;
  description: string;
  location: string;
  contact: string;
  date: string;

  brand?: string;
  model?: string; 
  color?: string;
  chassis?: string;
  reward?: number;
}

export interface CreateReportInput {
  licensePlate: string;

  description: string;
  location: string;
  contact: string;

  date?: string;
  brand?: string;
  model?: string; 
  color?: string;
  chassis?: string;
  reward?: number;
}

export interface AlertInput {
  licensePlate: string;
  seenLocation: string;
}