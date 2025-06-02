import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuItem} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { deleteMessage, editMessage } from "@/services/MessageService";
import { Message } from "@/types/types";
import { toast } from "sonner";
import { useChatStore } from "@/store/chatStore";
import { useUser } from "@/services/UserContext";
import { Dialog, DialogTrigger, DialogClose, DialogContent,
     DialogHeader, DialogTitle, 
     DialogFooter} from "./ui/dialog";
import { Button } from "./ui/button";
import { useRef, useEffect, useState } from "react";

interface MessageOptionsProps {
    message: Message;
}

const MessageOptions = ({message}: MessageOptionsProps) => {  
    const deleteMessageChat = useChatStore((state) => state.deleteMessage);
    const {userId} = useUser(); 
    const handleCopyMessage = () => {
        if(!message.message) return;
        navigator.clipboard.writeText(message.message);   
    }    

    const handleDeleteMessage = () => {
        if(!message.messageId) return;
        deleteMessage(message.messageId, userId ?? "");
        deleteMessageChat(String(message.conversationId), message.messageId);
    }

    return (
        <>
        <DropdownMenu modal={false}>
             <DropdownMenuTrigger className="z-10 absolute top-0.5 right-0.5">
                <ChevronDown 
              className="cursor-pointer bg-red h-6 w-6"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20">
                {(String(userId) === String(message.userId)) && (
                <>
                {!message.fileType && (
                    <EditMessageModal message={message}/>
                )}
                <DropdownMenuItem onClick={handleDeleteMessage}>
                    Eliminar
                </DropdownMenuItem>

                </>)}
                <DropdownMenuItem onClick={handleCopyMessage}>
                    Copiar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        </>
    )
}

interface EditMessageModalProps {
    message: Message;
}
const EditMessageModal = ({message}: EditMessageModalProps) => {
    const {userId} = useUser();
    const [text, setText] = useState(message.message || "");
    const editMessageChat = useChatStore((state) => state.editMessage);
    const handleEditMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!text.trim()) {
        toast.error("El mensaje no puede estar vacío.");
        e.preventDefault();
        return;
      }
      editMessage(message.messageId, text, String(userId) ?? "");
      editMessageChat(String(message.conversationId), message.messageId, text);
    }
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <DropdownMenuItem  onSelect={(e) => {e.preventDefault();}}>
                    Editar
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Mensaje</DialogTitle>
                </DialogHeader>
                <h3>Nuevo mensaje</h3>
                <MessageInput text={text}
                    setText={setText}
                />
                <DialogFooter>
                    <DialogClose>
                        <Button variant="secondary" className="bg-blue-500 text-white cursor-pointer"
                        onClick={handleEditMessage}>Aceptar</Button>    
                    </DialogClose>
                    <DialogClose>
                        <Button variant="secondary" 
                        className="bg-blue-500 text-white cursor-pointer">Cancelar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>    
    );
}

interface MessageInputProps {
    text: string;
    setText: (text: string) => void;
}
const MessageInput = ({text, setText}: MessageInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      setText(newText);
    };

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [text]);
  
    return (
      <div className="border rounded-lg flex justify-center items-center">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          className="focus:outline-none p-3 m-0 "
          maxLength={1500}
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

export default MessageOptions;