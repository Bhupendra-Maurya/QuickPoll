/* eslint-disable @typescript-eslint/no-explicit-any */
import ReconnectingWebSocket from "reconnecting-websocket";
import type { WSMessage } from "./types";

const WS_URL = process.env.NEXT_PUBLIC_WS_BASE_URL as string;


class WebSocketClient {
  private socket: ReconnectingWebSocket;
  private listeners: ((msg: WSMessage) => void)[] = [];

  constructor() {
    this.socket = new ReconnectingWebSocket(WS_URL);

    this.socket.addEventListener("open", () => {
      console.log("WebSocket connected");
    });

    this.socket.addEventListener("message", (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    });

    this.socket.addEventListener("close", () => {
      console.log("WebSocket disconnected");
    });
  }

  // Subscribe to messages
  subscribe(listener: (msg: WSMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Send a message to the server
  send(message: any) {
    this.socket.send(JSON.stringify(message));
  }
}

export const wsClient = new WebSocketClient();
