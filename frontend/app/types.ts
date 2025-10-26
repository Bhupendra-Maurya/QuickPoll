// ---------------- Option Types ----------------
export interface Option {
  id: number;
  text: string;
  votes: number;
}

// When creating a new option
export interface OptionCreate {
  text: string;
}

// ---------------- Poll Types ----------------
export interface Poll {
  id: number;
  question: string;
  likes: number;
  options: Option[];
}

// When creating a new poll
export interface PollCreate {
  question: string;
  options: OptionCreate[];
}

// ---------------- WebSocket Event Types ----------------
export type WSMessage =
  | { event: "poll_created"; poll: Poll }
  | { event: "vote_update"; poll: Poll }
  | { event: "like_update"; poll: Poll }
  | { event: "poll_deleted"; poll_id: number };
