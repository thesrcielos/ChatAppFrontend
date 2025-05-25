import { Client, IMessage, StompHeaders } from "@stomp/stompjs";
import { useChatStore } from "@/store/chatStore";

let token: string | null;
const ws_uri: string = import.meta.env.VITE_WEBSOCKET_URI;

let stompClient: Client | null;

export const connectWebSocket = (): void => {
  token = localStorage.getItem("token");
  if(stompClient) {
    return;
  }
  stompClient = new Client({
    brokerURL: ws_uri,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (msg: string) => console.log("[WebSocket]", msg),
    onConnect: () => {
      stompClient?.subscribe("/user/topic/conversation", (message: IMessage) => {
        const data = JSON.parse(message.body);
        console.log("Mensaje recibido:", data);
        const { conversationId } = data;

        useChatStore.getState().addMessage(conversationId, data);
        useChatStore.getState().handleNewMessage(conversationId);
        useChatStore.getState().moveChatToTopId(conversationId);
      });
    },
    onStompError: (frame) => {
      console.error("Error en STOMP:", frame.headers["message"]);
    },
  });

  stompClient.activate();
};

export const disconnectWebSocket = (): void => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessageWS = (
  message: any,
  additionalHeaders: StompHeaders = { Authorization: `Bearer ${token}` }
): void => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify(message),
      headers: additionalHeaders,
    });
  } else {
    console.error("No se pudo enviar el mensaje, WebSocket no conectado");
  }
};

export const markSeenMessages = (
  conversationId: string,
  messageId: string,
  userId: string,
  additionalHeaders: StompHeaders = { Authorization: `Bearer ${token}` }
): void => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/seen",
      body: JSON.stringify({ chatId: conversationId, messageId, userId }),
      headers: additionalHeaders,
    });
  } else {
    console.error("No se pudo enviar el mensaje, WebSocket no conectado");
  }
}