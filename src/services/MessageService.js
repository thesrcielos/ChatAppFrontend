import { Client } from "@stomp/stompjs";

let token;
const ws_uri = import.meta.env.VITE_WEBSOCKET_URI;
let stompClient;
const subscribers = []

const createWS = () => {
  token = localStorage.getItem("token");
  stompClient = new Client({
      brokerURL: ws_uri, // WebSocket directo
      reconnectDelay: 5000,
      connectHeaders: {
        'Authorization': `Bearer ${token}`, // Se envía el token en la conexión
      },
      debug: (msg) => console.log("[WebSocket]", msg),
      onConnect: () => {
        console.log("Conectado al WebSocket");
    
        stompClient.subscribe("/user/topic/conversation", (message) => {
          const data = JSON.parse(message.body)
          subscribers.forEach(
            (callback) => callback(data)
          );
          console.log("Mensaje recibido:", data);
        });
      },
      onStompError: (frame) => {
        console.error("Error en STOMP:", frame.headers["message"]);
      },
    });
}

export const connectWebSocket = () => {
  createWS();
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


export const sendAudioWS = async (file, message, additionalHeaders = 
  {Authorization: `Bearer ${token}`}) => {
  if (stompClient && stompClient.connected) {
    message["content"] = await fileToBase64(file);
    // No añadimos el token de autorización aquí para evitar duplicados
    console.log(message.content);
    stompClient.publish({
      destination: "/app/audio/upload",
      body: JSON.stringify(message),
      headers: additionalHeaders
    });
  } else {
    console.error("No se pudo enviar el mensaje, WebSocket no conectado");
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    }
    reader.onerror = (error) => reject(error);
  });
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

export const subscribe = (callback) => {
  if (!subscribers.includes(callback)) {
    subscribers.push(callback);
  }
}