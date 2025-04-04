import "./AudioMessagePlayer.css";
import React, { useRef, useState } from 'react';
import { Mic, Play, Pause } from 'lucide-react';

const AudioMessagePlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(parseInt(audioRef.current.duration));
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-ms inline-flex h-[50px] items-center justify-center bg-transparent rounded-lg max-w-xs">
      <div className="flex justify-center items-center space-x-2">
        <div className="bg-transparent p-2 m-0 rounded-full">
          <Mic className="text-inherit" size={20} />
        </div>
        <button 
          onClick={handlePlayPause} 
          className="audio-play p-2 bg-transparent hover:text-blue-600"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>
      <div className="flex flex-col h-full justify-end justify-between items-start">  
        <input 
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek} 
            className="audio-control w-full h-[10px] bg-gray-200 rounded-lg cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-[3px]
            [&::-webkit-slider-thumb]:h-[3px]
            [&::-webkit-slider-thumb]:bg-blue-500 
            [&::-webkit-slider-thumb]:rounded-full"
        />
        <div className="text-xs text-white-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioMessagePlayer;