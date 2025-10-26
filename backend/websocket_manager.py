# Purpose: Simple WebSocket connection manager to broadcast messages to clients.
# This is use to keeps connections in memory and broadcasts messages.
# For production you should use a centralized pub/sub (Redis, RabbitMQ, or a managed realtime service).

import json
from typing import List
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        try:
            self.active_connections.remove(websocket)
        except ValueError:
            pass

    async def broadcast(self, message: dict):
        data = json.dumps(message)
        for connection in list(self.active_connections):
            try:
                await connection.send_text(data)
            except Exception:
                # if send fails, drop the connection
                try:
                    await connection.close()
                except Exception:
                    pass
                self.disconnect(connection)

manager = ConnectionManager()


