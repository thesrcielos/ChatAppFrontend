import { MoreVertical  } from "lucide-react"
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "../services/UserContext";
import AddContactModal from "./AddContactModal";
import RequestsModal from "./RequestModal";
import CreateChatGroupModal from "./CreateGroupModal";
import Perfil from "./Profile";

const UserMenu = () => {
    const { logout } = useUser();
    const [showProfile, setShowProfile] = useState(false);

    const handleCloseProfile = () => {
        setShowProfile(false);
    };

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="cursor-pointer">
                    <MoreVertical/>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        setShowProfile(true);
                    }}>
                        Perfil
                    </DropdownMenuItem>
                    <RequestsModal>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Solicitudes</DropdownMenuItem>
                    </RequestsModal>
                    <br/>
                    <AddContactModal>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Añadir Contacto</DropdownMenuItem>
                    </AddContactModal>
                    <br/>
                    <CreateChatGroupModal>
                        <DropdownMenuItem onSelect={(e)=> e.preventDefault()}>Crear Grupo</DropdownMenuItem>
                    </CreateChatGroupModal>
                    <DropdownMenuItem onClick={logout}>Cerrar Sesion</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {showProfile && (
                <Perfil 
                    onClose={handleCloseProfile}
                >
                    <div className="hidden" />
                </Perfil>
            )}
        </>
    )
}

export default UserMenu;