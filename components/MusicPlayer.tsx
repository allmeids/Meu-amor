import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Maximize2, Minimize2 } from 'lucide-react';

const SONG_ID = 'PXGycbkbtW0'; // Ali Gatie - It's You

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Oculto por padrão (apenas barra)
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Se o player já estiver instanciado, não faz nada
    if (playerRef.current) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }
  }, []);

  const initPlayer = () => {
    // Verificação dupla para evitar recriação
    if (playerRef.current) return;

    try {
      // Nota: Não atribuímos playerRef.current aqui diretamente para evitar
      // referências instáveis antes do onReady.
      new window.YT.Player('yt-player', {
        height: '200', 
        width: '300',
        videoId: SONG_ID,
        playerVars: {
          'playsinline': 1,
          'controls': 1,
          'origin': window.location.origin,
          'autoplay': 0,
          'loop': 1, // Repetir a música
          'playlist': SONG_ID, // Necessário para o loop funcionar no iframe API
          'rel': 0,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
        }
      });
    } catch (err) {
      console.warn("YouTube API init failed");
    }
  };

  const onPlayerReady = (event: any) => {
    // Esta é a forma mais segura de obter a referência do player
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === 1) { // Playing
      setIsPlaying(true);
    } else if (event.data === 2) { // Paused
      setIsPlaying(false);
    }
  };

  const safePlay = () => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  };

  const safePause = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || typeof playerRef.current.mute !== 'function') return;
    
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleStart = () => {
    setHasInteracted(true);
    // Pequeno delay ou chamada direta se o player já estiver pronto
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
      playerRef.current.unMute();
      playerRef.current.setVolume(50);
    } else {
      // Se o usuário clicar muito rápido antes do onReady, tentamos novamente em breve
      setTimeout(() => {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
            playerRef.current.unMute();
            playerRef.current.setVolume(50);
        }
      }, 500);
    }
  };

  if (!hasInteracted) {
    return (
      <div className="fixed inset-0 z-[100] bg-love-50/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
        <div className="animate-in zoom-in duration-500 flex flex-col items-center">
          <div className="w-24 h-24 bg-love-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Music size={40} className="text-love-600" />
          </div>
          <h1 className="font-script text-5xl text-love-600 mb-4">Nossa História</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Preparei algo especial para nós. Clique abaixo para começar. ❤️
          </p>
          <button 
            onClick={handleStart}
            className="bg-love-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-love-700 transition-transform transform hover:scale-105 flex items-center gap-3"
          >
            <Play fill="currentColor" /> Entrar com Música
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      
      {/* Container do Vídeo (Oculto por padrão, mas expansível se quiser ver o clipe) */}
      <div className={`transition-all duration-300 overflow-hidden rounded-lg shadow-2xl border-4 border-white ${isPlayerVisible ? 'w-[300px] h-[200px] opacity-100 translate-y-0' : 'w-0 h-0 opacity-0 translate-y-10'}`}>
        <div id="yt-player"></div>
      </div>

      {/* Barra de Controle Compacta */}
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-love-200 flex items-center gap-3 transition-all hover:scale-105">
        <button 
          onClick={() => setIsPlayerVisible(!isPlayerVisible)}
          className="text-love-400 hover:text-love-600 mr-2"
          title={isPlayerVisible ? "Esconder Vídeo" : "Mostrar Vídeo"}
        >
          {isPlayerVisible ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        <button 
          onClick={togglePlay}
          className="w-10 h-10 bg-love-500 rounded-full flex items-center justify-center text-white hover:bg-love-600 transition-colors shadow-sm"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
        </button>

        <div className="flex flex-col mr-2 min-w-[100px]">
          <span className="text-xs font-bold text-love-900">EU TE AMO</span>
          <span className="text-[10px] text-love-600">
             {isPlaying ? 'Tocando...' : 'Pausado'}
          </span>
        </div>

        <button onClick={toggleMute} className="text-love-400 hover:text-love-600">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
};