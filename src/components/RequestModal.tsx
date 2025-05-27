import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { getContactRequests, acceptContact, deleteContact,
  rejectContactRequest, getContactRequestsSent } from "../api/UserApi";
import "./RequestModal.css";
import { useUser } from "../services/UserContext";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
}

interface RequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestsModal({ isOpen, onClose }: RequestsModalProps) {
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequest[]>([]);
  const [sentRequestsFetched, setSentRequestsFetched] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    if (isOpen && !sentRequestsFetched) {
      getRecievedContactRequests();
      setSentRequestsFetched(true);
    }
  }, [isOpen, receivedRequests, sentRequests]);

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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Solicitudes de Contacto</h2>

        <Tabs defaultValue="Recibidas" aria-label="Solicitudes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Recibidas">Recibidas</TabsTrigger>
            <TabsTrigger value="Enviadas">Enviadas</TabsTrigger>
          </TabsList>
          <TabsContent value="Recibidas" aria-label="Solicitudes Recibidas">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardContent>
                {receivedRequests.length > 0 ? (
                  receivedRequests.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p className="text-left">{user.name}</p>
                        <p className="text-left">{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => acceptRequest(user.id)}
                          className="button-ry bg-green-600 hover:bg-green-600 text-white w-8 h-8 aspect-square 
                          flex items-center justify-center cursor-pointer"
                        >
                          <Check className="w-6 h-6" />
                        </Button>
                        <Button
                          onClick={() => rejectRequest(user.id)}
                          className="button-rx bg-red-600 hover:bg-red-600 text-white w-8 h-8 aspect-square 
                          flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No hay solicitudes pendientes.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Enviadas" arial-label="Solicitudes Enviadas">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardContent>
                {sentRequests.length > 0 ? (
                  sentRequests.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p>{user.name}</p>
                      <p>{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDeleteRequest(Number(user.id))}
                        className="button-rx bg-red-600 hover:bg-red-600 text-white aspect-square flex 
                        items-center justify-center cursor-pointer w-8 h-8"
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No has enviado solicitudes.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={() => {
              onClose();
              setSentRequestsFetched(false);
              setReceivedRequests([]);
            }}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
