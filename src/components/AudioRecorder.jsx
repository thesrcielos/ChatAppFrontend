import React, { useState, useRef, useEffect } from 'react';
import { Mic, CircleStop, Trash, Send, Dot } from 'lucide-react';
import { sendAudioMessage } from '../api/ChatApi';
import "./AudioRecorder.css";
/**
 * BotonGrabadorAudio - Componente de botón que permite grabar, escuchar y enviar audios
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onAudioReady - Función que se ejecuta cuando se envía el audio, recibe el blob
 * @param {string} props.className - Clases CSS adicionales para el botón
 * @param {Object} props.style - Estilos adicionales para el botón
 */
const AudioRecorder = ({ contact, onOpen, setMessage, className = '', style = {} }) => {
  // Estados
  const [estado, setEstado] = useState('inactivo'); // 'inactivo', 'grabando', 'grabado'
  const [duracion, setDuracion] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  
  // Referencias
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  
  // Iniciar grabación
  const iniciarGrabacion = async () => {
    try {
      // Solo reiniciamos los valores si estamos comenzando una nueva grabación
      if (estado === 'inactivo') {
        audioChunksRef.current = [];
        setDuracion(0);
      }
      
      // Si estamos reanudando, usamos el stream existente
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }
      onOpen(true);
      // Crear MediaRecorder
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Solo creamos el blob final si hemos terminado la grabación
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          
          // Cerrar stream solo si hemos terminado completamente
          if (streamRef.current && estado === 'inactivo') {
            const data = await sendAudioMessage(audioBlob, {
              conversationId: contact.id,
              contactId:contact.contact.id,
              sentAt: new Date()
            });
            setMessage(data);
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
      };
      
      // Iniciar grabación
      mediaRecorder.start();
      setEstado('grabando');
      
      // Iniciar o reanudar temporizador
      timerRef.current = setInterval(() => {
        setDuracion(prevDuracion => prevDuracion + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error al iniciar/reanudar la grabación:', error);
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  };
  
  // Enviar audio
  const enviarAudio = () => {
    if (mediaRecorderRef.current && estado === 'grabando') {
      setEstado('inactivo');
      mediaRecorderRef.current.stop();
      // Detener temporizador
      clearInterval(timerRef.current);
    }
    onOpen(false);
    setAudioURL('');
    setAudioBlob(null);
  };
  
  // Cancelar grabación
  const cancelarGrabacion = () => {
    // Detener grabación si está en curso
    if (estado === 'grabando' && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
    
    // Cerrar stream si existe
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onOpen(false);
    
    // Limpiar URL de audio si existe
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    
    // Resetear estado
    setEstado('inactivo');
    setDuracion(0);
    setAudioURL('');
    setAudioBlob(null);
  };
  
  const pausarGrabacion = () => {
    if (mediaRecorderRef.current && estado === 'grabando') {
      mediaRecorderRef.current.stop(); // Detiene el grabador pero mantiene los chunks
      setEstado('pausado');
      console.log("pausado");
      // Detener temporizador
      clearInterval(timerRef.current);
    }
  };

  // Formatear tiempo
  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };
  
  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(timerRef.current);
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);
  
  // Renderizar interfaz según el estado
  const renderizarBoton = () => {
    switch (estado) {
      case 'inactivo':
        return (
          <button 
            onClick={iniciarGrabacion}
            className={`boton-grabador bg-transparent border-none`}
          >
            <Mic className='w-7 h-7'/>
          </button>
        );
        
      case 'grabando':
        return (
          <div className="contenedor-grabando">
            <button onClick={cancelarGrabacion}>
                <Trash/>
              </button>
            <span className="tiempo-grabacion">
              <span className="indicador-grabando"><Dot/></span> {formatearTiempo(duracion)}
            </span>
            <div className="botones-grabacion">
              <button onClick={pausarGrabacion} className="boton-detener">
                <CircleStop/>
              </button>
              <button onClick={enviarAudio} className='boton-enviar'>
                <Send />
              </button>
            </div>
          </div>
        );
        
        case 'pausado':
        return (
          <div className="contenedor-pausado inline-flex">
            <button onClick={cancelarGrabacion} className="boton-reanudar" title="Reanudar grabación">
                <Trash/>
              </button>
            <span className="tiempo-grabacion">
              <span className="indicador-pausado"><Dot/></span> {formatearTiempo(duracion)}
            </span>
            <audio src={audioURL} controls className="reproductor-audio" />
            <div className="botones-grabacion">
              <button onClick={iniciarGrabacion} className="boton-reanudar" title="Reanudar grabación">
                <Mic/>
              </button>
              <button onClick={enviarAudio} className="boton-reanudar" title="Reanudar grabación">
                <Send/>
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="grabador-audio-componente">
      {renderizarBoton()}
      
      <style jsx>{`
       
      `}</style>
    </div>
  );
};

export default AudioRecorder;