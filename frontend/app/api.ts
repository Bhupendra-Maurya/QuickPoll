import axios from "axios";
import { Poll, PollCreate } from "./types";

// Set FastAPI backend URL
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api/v1";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
//               Poll API 
// ==========================================

// Get all polls
export const getPolls = async (): Promise<Poll[]> => {
  const response = await api.get<Poll[]>("/");
  return response.data;
};

// Create a new poll
export const createPoll = async (poll: PollCreate): Promise<Poll> => {
  const response = await api.post<Poll>("/", poll);
  return response.data;
};

// Vote for an option
export const voteOption = async (
  pollId: number,
  optionId: number
): Promise<Poll> => {
  const response = await api.post<Poll>(`/${pollId}/vote/${optionId}`);
  return response.data;
};

// Delete a vote
export const deleteVote = async (
  pollId: number,
  optionId: number
): Promise<Poll> => {
  const response = await api.delete<Poll>(`/${pollId}/vote/${optionId}`);
  return response.data;
};

// Like a poll
export const likePoll = async (pollId: number): Promise<Poll> => {
  const response = await api.post<Poll>(`/${pollId}/like`);
  return response.data;
};

// Unlike a poll
export const unlikePoll = async (pollId: number): Promise<Poll> => {
  const response = await api.delete<Poll>(`/${pollId}/like`);
  return response.data;
};

// Delete a poll
export const deletePoll = async (pollId: number): Promise<{ detail: string }> => {
  const response = await api.delete<{ detail: string }>(`/${pollId}`);
  return response.data;
};

export default api;
