import { useState, useEffect } from "react";
import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { Check, X } from "lucide-react";
import { getContactRequests, acceptContact, rejectContactRequest } from "../api/UserApi";
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
  const sentRequests = ["Ana Torres", "Pedro Ramírez"];
  const { userId } = useUser();

  useEffect(() => {
    if (isOpen && receivedRequests.length === 0) {
      getRecievedContactRequests();
    }
  }, [isOpen, receivedRequests]);

  const getRecievedContactRequests = async () => {
    try {
      const data = await getContactRequests(userId, 0, 5);
      setReceivedRequests(data.values);
    } catch (error) {
      console.error("Error al obtener las solicitudes", error);
    }
  };

  const acceptRequest = async (id: string) => {
    try {
      await acceptContact(id);
      setReceivedRequests(receivedRequests.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error al aceptar solicitud", error);
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      await rejectContactRequest(id);
      setReceivedRequests(receivedRequests.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error al rechazar solicitud", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">Solicitudes de Contacto</h2>

        <Tabs aria-label="Solicitudes">
          <Tab key="received" title="Recibidas 📥">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardBody>
                {receivedRequests.length > 0 ? (
                  receivedRequests.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => acceptRequest(user.id)}
                          className="button-ry bg-green-600 hover:bg-green-600 text-white w-10 h-10 aspect-square flex items-center justify-center"
                        >
                          <Check className="w-6 h-6" />
                        </Button>
                        <Button
                          onClick={() => rejectRequest(user.id)}
                          className="button-rx bg-red-600 hover:bg-red-600 text-white w-10 h-10 aspect-square flex items-center justify-center"
                        >
                          <X className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">Cargando....</p>
                )}
              </CardBody>
            </Card>
          </Tab>

          <Tab key="sent" title="Enviadas 📤">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardBody>
                {sentRequests.length > 0 ? (
                  sentRequests.map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <span className="text-gray-700">{user}</span>
                      <Button className="button-rx bg-red-600 hover:bg-red-600 text-white w-10 h-10 aspect-square flex items-center justify-center">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No has enviado solicitudes.</p>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            onClick={() => {
              onClose();
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
