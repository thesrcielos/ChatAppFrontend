import "./Chat.css";
import { useState } from "react";
import { Send, Menu } from "lucide-react";
import { Button, Card, Input } from "@heroui/react";
import { sendMessageWS } from "../services/MessageService";
import { getUserContacts } from "../api/UserApi";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { text: "Hola, ¿cómo estás?", sender: "other" },
    { text: "¡Hola! Todo bien, ¿y tú?", sender: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessageWS({content: newMessage,
                conversationId: 0,
                contactId:0,
                sentAt: new Date()
    });
    setMessages([...messages, { text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  const getUserChats = () => {
    const contacts = getUserContacts();

  }

  return (
    <div className="flex w-screen justify-left item-left h-screen">
      {/* Lista de contactos (izquierda) */}
      <aside className="w-2/5 pl-2 bg-gray shadow-lg">
        <h2 className="p-2 text-left font-bold mb-4">Chats</h2>
        <div className="space-y-1 divide-y divide-gray-300 text-left">
            <Button className="w-full py-3 text-left" variant="outline">Juan Pérez</Button>
            <Button className="w-full py-3 text-left" variant="outline">Carlos Ramírez</Button>
            <Button className="w-full py-3 text-left" variant="outline">Ana López</Button>
        </div>
      </aside>

      {/* Área de chat (derecha) */}
      <main className="flex-1 flex flex-col">
        {/* Barra superior */}
        <header className="p-4 bg-blue-500 text-white font-bold text-lg">
          Juan Pérez
        </header>

        {/* Mensajes */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 text-left rounded-lg max-w-xs ${
                msg.sender === "me"
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input y botón de enviar */}
        <footer className="p-4 border-t bg-white flex items-center gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 border rounded-lg"
          />
          <Button onClick={sendMessage} className="bg-blue-500 text-white">
            <Send className="w-5 h-5" />
          </Button>
        </footer>
      </main>
    </div>
  );
}
