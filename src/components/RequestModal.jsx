import { Tabs, Tab, Card, CardBody, Button } from "@heroui/react";
import { Check, X } from "lucide-react";
import { getContactRequests, acceptContact, rejectContactRequest } from "../api/UserApi";
import "./RequestModal.css";
import { useUser } from "../services/UserContext";
import { useState, useEffect } from "react";

export default function RequestsModal({ isOpen, onClose }) {
  const [receivedRequests, setReceivedRequests] = useState(null);
  const sentRequests = ["Ana Torres", "Pedro Ramírez"];
  const {userId} = useUser();


  const getRecievedContactRequests = async () => {
    const data = await getContactRequests(userId, 0, 5);
    console.log(data);
    setReceivedRequests(data.values);
  }

  const acceptRequest = async (id) => {
    await acceptContact(id);
  }

  const rejectRequest = async (id) => {
    await rejectContactRequest(id);
  }

  if(!isOpen) {
    return null;
  }
  if (receivedRequests == null) {
    console.log("um");
    getRecievedContactRequests();
  }
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
          Solicitudes de Contacto
        </h2>

        <Tabs aria-label="Solicitudes">
          {/* Tab de Solicitudes Recibidas */}
          <Tab key="received" title="Recibidas 📥">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardBody>
                {receivedRequests !== null ? receivedRequests.length > 0 ?(
                  receivedRequests.map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <div key={index}>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {/* Botón de aceptar ✅  */}
                        <Button onPress={() => acceptRequest(user.id)} className="button-ry bg-green-600 !important hover:bg-green-600 text-white w-10 h-10 aspect-square flex items-center justify-center">
                          <Check className="w-6 h-6" />
                        </Button>
                        {/* Botón de rechazar ❌ */}
                        <Button onPress={() => rejectRequest(user.id)} className="button-rx bg-red-600 hover:bg-red-600 text-white w-10 h-10 aspect-squarex flex items-center justify-center">
                          <X className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) :(
                  <p className="text-gray-500 text-center">No tienes solicitudes recibidas.</p>
                ): <p className="text-gray-500 text-center">Cargando....</p>}
              </CardBody>
            </Card>
          </Tab>

          {/* Tab de Solicitudes Enviadas */}
          <Tab key="sent" title="Enviadas 📤">
            <Card className="bg-gray-50 shadow-sm rounded-lg">
              <CardBody>
                {sentRequests.length > 0 ? (
                  sentRequests.map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <span className="text-gray-700">{user}</span>
                      <Button className="button-rx bg-red-600 hover:bg-red-600 text-white w-10 h-10 aspect-squarex flex items-center justify-center">
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

        {/* Botón para cerrar el modal */}
        <div className="flex justify-end mt-4">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" onClick={() => {onClose();setReceivedRequests(null);}}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
