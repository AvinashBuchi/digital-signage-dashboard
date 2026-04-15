import axios from "axios";
import { NewScreenPayload, SchedulePayload, Screen, UpdateScreenPayload } from "../types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5050/api";

const api = axios.create({
  baseURL: apiBaseUrl,
});

export const getScreens = async (): Promise<Screen[]> => {
  const response = await api.get<Screen[]>("/screens");
  return response.data;
};

export const createScreen = async (payload: NewScreenPayload): Promise<Screen> => {
  const response = await api.post<Screen>("/screens", payload);
  return response.data;
};

export const updateScreen = async (id: number, payload: UpdateScreenPayload): Promise<Screen> => {
  const response = await api.put<Screen>(`/screens/${id}`, payload);
  return response.data;
};

export const deleteScreen = async (id: number): Promise<void> => {
  await api.delete(`/screens/${id}`);
};

export const scheduleMessage = async (id: number, payload: SchedulePayload): Promise<Screen> => {
  const response = await api.patch<Screen>(`/screens/${id}/schedule`, payload);
  return response.data;
};
