import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import forward from '../assets/player/forward.svg'
import previous from '../assets/player/previous.svg'
import play from '../assets/player/play.svg'
import pause from '../assets/player/pause.svg'
import noiseFile from '../assets/player/effect/noise.mp3'
import * as gifs from '../assets/gifs';

export const changeBgGif = () => {
        const bg = document.getElementById('bg-gif') as HTMLImageElement;
        if (bg) {
                // Obtém as chaves do objeto `gifs` e escolhe uma aleatória
                const gifKeys = Object.keys(gifs) as (keyof typeof gifs)[];
                const randomKey = gifKeys[Math.floor(Math.random() * gifKeys.length)];

                bg.src = gifs[randomKey];
        }
}

const VideoPlayer = () => {
        const playerRef = useRef<YT.Player | null>(null); // Definindo o tipo corretamente
        const videoRef = useRef<HTMLVideoElement>(null);
        const [showMessage, setShowMessage] = useState(true); // Estado para controlar a exibição da mensagem
        const [videoTitle, setVideoTitle] = useState("Carregando...");
        const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Estado para o índice do vídeo atual
        const [hasUserInteracted, setHasUserInteracted] = useState(false);
        const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
        const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar a reprodução do vídeo
        const listUrl = ['jfKfPfyJRdk', '5yx6BWlEVcY', 'qH3fETPsqXU', '7NOSDKb0HlU', 'GgbeNFD7l7Q', 'HuFYqnbVbzY'];
        const apiKey = import.meta.env.VITE_API_KEY;

        const applyTvScreenClass = () => {
                const divEffect = document.getElementById("effect")
                if (divEffect) {
                        divEffect.classList.add("loading-channel")
                        setTimeout(() => {
                                divEffect.classList.remove("loading-channel")
                        }, 500)
                }
        }

        const playNoiseThenVideo = () => {
                const noise = new Audio(noiseFile)
                noise.play()
                setTimeout(() => {
                        noise.pause()
                        noise.currentTime = 0
                        if (videoRef.current) {
                                videoRef.current.play()
                        }
                }, 500)
        }

        const nextVideo = () => {
                const nextIndex = (currentVideoIndex + 1) % listUrl.length;
                setCurrentVideoIndex(nextIndex);
                applyTvScreenClass();
                playNoiseThenVideo();
                setIsPlaying(true);
                setShowMessage(false);
                changeBgGif();

                const nextVideoId = listUrl[nextIndex];

                if (playerRef.current) {
                        playerRef.current.loadVideoById(nextVideoId);

                        // Considera que o usuário interagiu ao clicar no botão de próximo
                        if (!hasUserInteracted) {
                                setHasUserInteracted(true);
                        }

                        // Define que deve tocar quando o vídeo estiver pronto
                        if (hasUserInteracted) {
                                playerRef.current.playVideo();
                                playerRef.current.unMute();
                        }

                        setShouldAutoPlay(true);
                }
        };

        const prevVideo = () => {
                const nextIndex = (currentVideoIndex - 1 + listUrl.length) % listUrl.length;
                setCurrentVideoIndex(nextIndex);
                applyTvScreenClass();
                playNoiseThenVideo();
                setIsPlaying(true);
                setShowMessage(false);
                changeBgGif();

                const nextVideoId = listUrl[nextIndex];

                if (playerRef.current) {
                        playerRef.current.loadVideoById(nextVideoId);
                        playerRef.current.playVideo();

                        // Considera que o usuário interagiu ao clicar no botão de próximo
                        if (!hasUserInteracted) {
                                setHasUserInteracted(true);
                        }

                        // Define que deve tocar quando o vídeo estiver pronto
                        if (hasUserInteracted) {
                                playerRef.current.playVideo();
                                playerRef.current.unMute();
                        }

                        setShouldAutoPlay(true);
                }
        };

        const onReady = (event: { target: YT.Player }) => {
                playerRef.current = event.target;

                // Escuta mudança de estado do player
                event.target.addEventListener("onStateChange", (e: YT.OnStateChangeEvent) => {
                        if (e.data === YT.PlayerState.CUED && shouldAutoPlay) {
                                playerRef.current?.playVideo();
                                if (hasUserInteracted) {
                                        playerRef.current?.unMute();
                                }
                                setShouldAutoPlay(false);
                        }
                });
        };

        const togglePlayPause = () => {
                if (playerRef.current) {
                        if (isPlaying) {
                                playerRef.current.pauseVideo();
                                setShowMessage(true);
                        } else {
                                playerRef.current.playVideo();
                                playerRef.current.unMute();
                                setShowMessage(false);
                        }
                        setIsPlaying(!isPlaying); // Alterna o estado de reprodução
                }
        };


        useEffect(() => {
                const fetchVideoTitle = async () => {
                        try {
                                const videoId = listUrl[currentVideoIndex];
                                const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
                                const res = await fetch(apiUrl);
                                const data = await res.json();
                                console.log(data);
                                const title = data.items[0]?.snippet?.title || 'Título não encontrado';
                                setVideoTitle(title);
                        } catch (error) {
                                console.error('Erro ao buscar título do vídeo:', error);
                                setVideoTitle('Carregando título...');
                        }
                };

                fetchVideoTitle();
        }, [currentVideoIndex]);



        const opts = {
                height: '390',
                width: '640',
                playerVars: {
                        autoplay: 0,
                        mute: 1
                },
        };

        return (
                <>
                        {showMessage && <h1 className='absolute bottom-10 w-full text-center text-2xl text-white animate-pulse'>Pressione alguma tecla para iniciar</h1>}
                        <div className='absolute left-12 bottom-8 z-20'>
                                <div className='flex flex-col items-start gap-2'>
                                        <div className='flex justify-center items-center gap-3'>
                                                <button onClick={prevVideo}>
                                                        <img src={previous} className='w-6 h-6' />
                                                </button>
                                                <button onClick={togglePlayPause}>
                                                        <img src={isPlaying ? pause : play} className='w-6 h-6' />
                                                </button>
                                                <button onClick={nextVideo}>
                                                        <img src={forward} className='w-6 h-6' />
                                                </button>
                                        </div>
                                        <h2 className="text-white text-2xl">{videoTitle}</h2>
                                </div>
                        </div>
                        <div style={{ opacity: 0, visibility: 'hidden', position: 'absolute' }}>
                                <YouTube videoId={listUrl[currentVideoIndex]} opts={opts} onReady={onReady} />
                        </div>
                </>
        );
};

export default VideoPlayer;
