import { Client } from "@stomp/stompjs";

const token = localStorage.getItem("token");
const ws_uri = import.meta.env.VITE_WEBSOCKET_URI;

let stompClient = new Client({
    brokerURL: ws_uri, // WebSocket directo
    reconnectDelay: 5000,
    connectHeaders: {
      'Authorization': `Bearer ${token}`, // Se envía el token en la conexión
    },
    debug: (msg) => console.log("[WebSocket]", msg),
    onConnect: () => {
      console.log("Conectado al WebSocket");
  
      stompClient.subscribe("/topic/conversation", (message) => {
        console.log("Mensaje recibido:", JSON.parse(message.body));
      });
    },
    onStompError: (frame) => {
      console.error("Error en STOMP:", frame.headers["message"]);
    },
  });
export const connectWebSocket = () => {
  stompClient.activate();
};

export const subscribeToDestination = (destination, callback) => {
  if (!stompClient || !stompClient.connected) {
    console.error("No se puede suscribir, WebSocket no conectado");
    return null;
  }
  
  return stompClient.subscribe(destination, (message) => {
    try {
      const payload = JSON.parse(message.body);
      callback(payload);
    } catch (e) {
      callback(message.body);
    }
  });
};

export const sendMessageWS = (message, additionalHeaders = {Authorization: `Bearer ${token}`}) => {
  if (stompClient && stompClient.connected) {
    // No añadimos el token de autorización aquí para evitar duplicados
    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify(message),
      headers: additionalHeaders
    });
  } else {
    console.error("No se pudo enviar el mensaje, WebSocket no conectado");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    if (stompClient.connected) {
      stompClient.deactivate();
      console.log("Desconectado del WebSocket");
    }
    stompClient = null;
  }
  
};