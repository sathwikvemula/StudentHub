
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (
  email,
  onNotification,
  onNotesUpdated
) => {
  if (!email) {
    console.log("No email available for WebSocket");
    return;
  }
  const token = localStorage.getItem("token");
  if (!token) { console.log("No JWT token available for WebSocket"); return; }

  // Prevent multiple connections
  if (stompClient && stompClient.active) {
    console.log("WebSocket already connected");
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => {
      return new SockJS("http://localhost:8080/ws");
    },
     connectHeaders: {
    Authorization: `Bearer ${token}`
   },
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("WebSocket connected");


      stompClient.subscribe(
        "/user/queue/notifications",
        (message) => {
          console.log(
            "🔔 Reminder received:",
            message.body
          );

          if (onNotification) {
            onNotification(message.body);
          }
        }
      );

      stompClient.subscribe(
        `/topic/notes/${email}`,
        (message) => {
          console.log(
            "🔄 Notes updated:",
            message.body
          );

          if (onNotesUpdated) {
            onNotesUpdated(message.body);
          }
        }
      );

      console.log(
        `Subscribed to note updates for ${email}`
      );
    },

    onStompError: (frame) => {
      console.error(
        "STOMP error:",
        frame.headers["message"]
      );

      console.error(
        "STOMP details:",
        frame.body
      );
    },

    onWebSocketError: (error) => {
      console.error(
        "WebSocket error:",
        error
      );
    },

    onWebSocketClose: () => {
      console.log(
        "WebSocket connection closed"
      );
    }
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    console.log(
      "Disconnecting WebSocket..."
    );

    stompClient.deactivate();

    stompClient = null;

    console.log(
      "WebSocket disconnected"
    );
  }
};

