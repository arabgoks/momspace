export interface Kecamatan {
  name: string;
  gap: number;
  rooms: number;
  ibu: number;
  points: string;
}

export interface TrendPoint {
  m: string;
  pos: number;
  neg: number;
}

export type ProblemReportStatus = 'open' | 'resolved';

export interface ProblemReport {
  name: string;
  issue: string;
  time: string;
  initial: string;
  detail: string;
  status: ProblemReportStatus;
}
