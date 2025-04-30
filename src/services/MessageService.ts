import { Client, IMessage, StompSubscription, StompHeaders } from "@stomp/stompjs";

let token: string | null;
const ws_uri: string = import.meta.env.VITE_WEBSOCKET_URI;

let stompClient: Client | null;
const subscribers: Record<string, (data: any) => void> = {};

const createWS = (): void => {
  token = localStorage.getItem("token");

  stompClient = new Client({
    brokerURL: ws_uri,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (msg: string) => console.log("[WebSocket]", msg),
    onConnect: () => {
      console.log("Conectado al WebSocket");

      stompClient?.subscribe("/user/topic/conversation", (message: IMessage) => {
        const data = JSON.parse(message.body);
        subscribers[data.conversationId]?.(data);
      });
    },
    onStompError: (frame) => {
      console.error("Error en STOMP:", frame.headers["message"]);
    },
  });
};

export const connectWebSocket = (): void => {
  createWS();
  stompClient?.activate();
};

export const subscribeToDestination = (
  destination: string,
  callback: (payload: any) => void
): StompSubscription | null => {
  if (!stompClient || !stompClient.connected) {
    console.error("No se puede suscribir, WebSocket no conectado");
    return null;
  }

  return stompClient.subscribe(destination, (message: IMessage) => {
    try {
      const payload = JSON.parse(message.body);
      callback(payload);
    } catch (e) {
      callback(message.body);
    }
  });
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

export const sendAudioWS = async (
  file: File,
  message: any,
  additionalHeaders: StompHeaders = { Authorization: `Bearer ${token}` }
): Promise<void> => {
  if (stompClient && stompClient.connected) {
    message["content"] = await fileToBase64(file);
    stompClient.publish({
      destination: "/app/audio/upload",
      body: JSON.stringify(message),
      headers: additionalHeaders,
    });
  } else {
    console.error("No se pudo enviar el mensaje, WebSocket no conectado");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const disconnectWebSocket = (): void => {
  if (stompClient) {
    if (stompClient.connected) {
      stompClient.deactivate();
      console.log("Desconectado del WebSocket");
    }
    stompClient = null;
  }
};

export const subscribe = (id: string, callback: (data: any) => void): void => {
  if (!subscribers[id]) {
    subscribers[id] = callback;
  }
};
