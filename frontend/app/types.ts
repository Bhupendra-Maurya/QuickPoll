/* eslint-disable @typescript-eslint/no-explicit-any */
// // ---------------- Option Types ----------------
// export interface Option {
//   id: number;
//   text: string;
//   votes: number;
// }

// // When creating a new option
// export interface OptionCreate {
//   text: string;
// }

// // ---------------- Poll Types ----------------
// export interface Poll {
//   id: number;
//   question: string;
//   likes: number;
//   options: Option[];
// }

// // When creating a new poll
// export interface PollCreate {
//   question: string;
//   options: OptionCreate[];
// }

// // ---------------- WebSocket Event Types ----------------
// export type WSMessage =
//   | { event: "poll_created"; poll: Poll }
//   | { event: "vote_update"; poll: Poll }
//   | { event: "like_update"; poll: Poll }
//   | { event: "poll_deleted"; poll_id: number };




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
  created_at?: string; // Optional: if your backend returns this
  updated_at?: string; // Optional: if your backend returns this
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

// Optional: Add validation helpers
export const isValidPoll = (poll: any): poll is Poll => {
  return (
    poll &&
    typeof poll.id === 'number' &&
    typeof poll.question === 'string' &&
    Array.isArray(poll.options) &&
    poll.options.every((opt: any) => 
      opt && 
      typeof opt.id === 'number' && 
      typeof opt.text === 'string' &&
      typeof opt.votes === 'number'
    )
  );
};