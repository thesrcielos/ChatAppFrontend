import React, { useState, useRef, useEffect } from 'react';
import { Mic, CircleStop, Trash, Send, Dot } from 'lucide-react';
import { sendAudioMessage } from '../api/ChatApi';
import { useUser } from '../services/UserContext';
import "./AudioRecorder.css";
import { Chat, Message } from '@/types/types';
import {toLocalISOString} from '@/utils/dateUtils';

interface AudioRecorderProps {
  contact: Chat;
  onOpen: (isOpen: boolean) => void;
  setMessage: (message: Message) => void;
}

const AudioRecorder = ({ contact, onOpen, setMessage }: AudioRecorderProps) => {
  const [estado, setEstado] = useState<'inactivo' | 'grabando' | 'pausado'>('inactivo');
  const [duracion, setDuracion] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { userId } = useUser();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iniciarGrabacion = async () => {
    try {
      if (estado === 'inactivo') {
        audioChunksRef.current = [];
        setDuracion(0);
      }

      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      onOpen(true);

      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(finalBlob);
        const audioUrl = URL.createObjectURL(finalBlob);
        setAudioURL(audioUrl);

        if (streamRef.current && estado === 'inactivo') {
          const id = contact.isGroup ? userId : contact.contact.id;
          const data = await sendAudioMessage(finalBlob, {
            conversationId: contact.id,
            contactId: id ? parseInt(id, 10) : 0,
            sentAt: toLocalISOString(new Date())
          });
          setMessage(data);

          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setEstado('grabando');

      timerRef.current = setInterval(() => {
        setDuracion(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  };

  const enviarAudio = () => {
    if (estado === 'grabando' && mediaRecorderRef.current) {
      setEstado('inactivo');
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
    onOpen(false);
    setAudioURL('');
    setAudioBlob(null);
  };

  const cancelarGrabacion = () => {
    if (estado === 'grabando' && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    onOpen(false);

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }

    setEstado('inactivo');
    setDuracion(0);
    setAudioURL('');
    setAudioBlob(null);
  };

  const pausarGrabacion = () => {
    if (estado === 'grabando' && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setEstado('pausado');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reanudarGrabacion = () => {
  if (estado === 'pausado' && mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
    mediaRecorderRef.current.resume();
    setEstado('grabando');
    timerRef.current = setInterval(() => {
      setDuracion(prev => prev + 1);
    }, 1000);
  }
};

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const renderizarBoton = () => {
    switch (estado) {
      case 'inactivo':
        return (
          <button onClick={iniciarGrabacion} className="boton-grabador bg-transparent border-none">
            <Mic className='w-7 h-7' arial-label="Grabar audio"/>
          </button>
        );
      case 'grabando':
        return (
          <div className="contenedor-grabando">
            <button onClick={cancelarGrabacion}><Trash aria-label='Eliminar audio'/></button>
            <span className="tiempo-grabacion"><Dot /> {formatearTiempo(duracion)}</span>
            <div className="botones-grabacion">
              <button onClick={pausarGrabacion}><CircleStop arial-label='Detener grabacion'/></button>
              <button onClick={enviarAudio}><Send aria-label='Enviar audio'/></button>
            </div>
          </div>
        );
      case 'pausado':
        return (
          <div className="contenedor-pausado inline-flex">
            <button onClick={cancelarGrabacion}><Trash aria-label='Eliminar audio'/></button>
            <span className="tiempo-grabacion"><Dot /> {formatearTiempo(duracion)}</span>
            <audio src={audioURL} controls className="reproductor-audio" />
            <div className="botones-grabacion">
              <button onClick={reanudarGrabacion}><Mic aria-label='Continuar grabacion'/></button>
              <button onClick={enviarAudio}><Send aria-label='Enviar audio'/></button>
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
    </div>
  );
};

export default AudioRecorder;
