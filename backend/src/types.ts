export interface Report {
  id: string;
  licensePlate: string;
  description: string;
  location: string;
  contact: string;
  date: string;
}

export interface CreateReportInput {
  licensePlate: string;
  description: string;
  location: string;
  contact: string;
}

export interface AlertInput {
  licensePlate: string;
  seenLocation: string;
}