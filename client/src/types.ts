export type ScreenStatus = "online" | "offline";

export interface Screen {
  id: number;
  name: string;
  location: string;
  status: ScreenStatus;
  content: string;
  scheduledMessage: string | null;
  scheduledTime: string | null;
  lastUpdated: string;
}

export interface NewScreenPayload {
  name: string;
  location: string;
  content: string;
}

export interface UpdateScreenPayload {
  content?: string;
  status?: ScreenStatus;
}

export interface SchedulePayload {
  scheduledMessage: string;
  scheduledTime: string;
}
