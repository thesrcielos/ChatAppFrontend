import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { getContactRequests, acceptContact, deleteContact,
  rejectContactRequest, getContactRequestsSent } from "../api/UserApi";
import "./RequestModal.css";
import { useUser } from "../services/UserContext";
import { Dialog, DialogTrigger,DialogContent, DialogHeader
      ,DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import useIsMobile from "@/services/IsMobile";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
}

interface RequestsModalProps {
  children: React.ReactNode;
}

export default function RequestsModal({ children}: RequestsModalProps) {
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [sentRequestsFetched, setSentRequestsFetched] = useState(false);
  const { userId } = useUser();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sentRequestsFetched) {
      getRecievedContactRequests();
      setSentRequestsFetched(true);
    }
  }, [receivedRequests, sentRequests]);

  const getRecievedContactRequests = async () => {
    try {
      const data = await getContactRequests(Number(userId), 0, 5);
      setReceivedRequests(data.values);

      const sentRequestsData = await getContactRequestsSent(Number(userId), 0, 5);
      setSentRequests(sentRequestsData.values);
    } catch (error) {
      console.error("Error al obtener las solicitudes", error);
    }
  };

  const acceptRequest = async (id: string) => {
    try {
      await acceptContact(Number(id));
      setReceivedRequests(receivedRequests.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error al aceptar solicitud", error);
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      await rejectContactRequest(Number(id));
      setReceivedRequests(receivedRequests.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error al rechazar solicitud", error);
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await deleteContact(id);
      setSentRequests(sentRequests.filter((request) => request.id !== id.toString()));
    } catch (error) {
      console.error("Error al eliminar solicitud", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        {children}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-md ${isMobile ? 'w-[95vw] translate-x-0 translate-y-0 fixed top-0 left-0 rounded-none max-h-screen overflow-auto' : ''} m-2`}>
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Solicitudes de Contacto</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="Recibidas" aria-label="Solicitudes">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="Recibidas">Recibidas</TabsTrigger>
            <TabsTrigger value="Enviadas">Enviadas</TabsTrigger>
          </TabsList>

          <TabsContent value="Recibidas" aria-label="Solicitudes Recibidas">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardContent className="p-2 sm:p-4">
                {receivedRequests.length > 0 ? (
                  receivedRequests.map((user) => (
                    <div
                      key={user.id}
                      className={`flex ${isMobile ? 'flex-col gap-2 items-start' : 'justify-between items-center'} p-2 border-b`}
                    >
                      <div>
                        <p className="text-left">{user.name}</p>
                        <p className="text-left text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          onClick={() => acceptRequest(user.id)}
                          className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 flex items-center justify-center"
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => rejectRequest(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 flex items-center justify-center"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">No hay solicitudes pendientes.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Enviadas" aria-label="Solicitudes Enviadas">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardContent className="p-2 sm:p-4">
                {sentRequests.length > 0 ? (
                  sentRequests.map((user) => (
                    <div
                      key={user.id}
                      className={`flex ${isMobile ? 'flex-col gap-2 items-start' : 'justify-between items-center'} p-2 border-b`}
                    >
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          onClick={() => handleDeleteRequest(Number(user.id))}
                          className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 flex items-center justify-center"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">No has enviado solicitudes.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start mt-4">
          <DialogClose asChild>
            <Button
              onClick={() => {
                setSentRequestsFetched(false);
                setReceivedRequests([]);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
