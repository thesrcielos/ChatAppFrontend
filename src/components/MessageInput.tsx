import { useRef, useEffect } from "react";

interface MessageInputProps {
    text: string;
    setText: (text: string) => void;
    sendMessage: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  }
const MessageInput = ({text, setText, sendMessage} : MessageInputProps) => {
    const textareaRef = useRef(null);
  
    // Función para manejar cambios en el texto
    const handleChange = (e) => {
      const nuevoTexto = e.target.value;
      setText(nuevoTexto);
    };
  
    // Ajustar altura automáticamente
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [text]);
  
    return (
      <div className="container border rounded-lg flex justify-center items-center">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          className="input-container focus:outline-none p-3 m-0 "
          maxLength={1500}
          onKeyDown={sendMessage}
          style={{
            width: '100%',
            resize: 'none',
            overflow: 'auto',
            maxHeight: '200px',
            lineHeight: '20px'
          }}
          rows={1}
          placeholder="Escribe un mensaje"
        />
      </div>
    );
  };

export default MessageInput;