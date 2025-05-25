import { MoreVertical  } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

import { useUser } from "../services/UserContext";
interface UserMenuProps {
    onOpenRequests: () => void;
    onAddContact: () => void;
    onCreateGroup: () => void;
}   
const UserMenu = ({onOpenRequests, onAddContact, onCreateGroup}: UserMenuProps) => {
    const { logout } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <MoreVertical/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenRequests}>Solicitudes</DropdownMenuItem>
                <DropdownMenuItem onClick={onAddContact}>Añadir Contacto</DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateGroup}>Crear Grupo</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Cerrar Sesion</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu;