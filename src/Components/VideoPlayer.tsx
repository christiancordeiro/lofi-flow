import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import forward from '../assets/player/forward.svg'
import previous from '../assets/player/previous.svg'
import play from '../assets/player/play.svg'
import pause from '../assets/player/pause.svg'

type YouTubeVideo = {
        id: string;
        snippet: {
                title: string;
        };
};

const VideoPlayer = () => {
        const playerRef = useRef<YT.Player | null>(null); // Definindo o tipo corretamente
        const [showMessage, setShowMessage] = useState(true); // Estado para controlar a exibição da mensagem
        const [videoTitle, setVideoTitle] = useState("Carregando...");
        const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Estado para o índice do vídeo atual
        const [hasUserInteracted, setHasUserInteracted] = useState(false);
        const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
        const listUrl = ['jfKfPfyJRdk', '5yx6BWlEVcY', 'qH3fETPsqXU', '7NOSDKb0HlU', 'GgbeNFD7l7Q', 'HuFYqnbVbzY']

        // const apiKey = import.meta.env.VITE_API_KEY;
        // const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${listUrl.join(',')}&key=${apiKey}`

        const getTitleIframe = () => {
                // Atualiza o título
                const iframe = playerRef.current?.getIframe();
                if (iframe) {
                        const title = iframe.getAttribute("title");
                        setVideoTitle(title || "Título não encontrado");
                }
        }

        const nextVideo = () => {
                const nextIndex = (currentVideoIndex + 1) % listUrl.length;
                setCurrentVideoIndex(nextIndex);

                const nextVideoId = listUrl[nextIndex];

                if (playerRef.current) {
                        playerRef.current.loadVideoById(nextVideoId);

                        // Considera que o usuário interagiu ao clicar no botão de próximo
                        if (!hasUserInteracted) {
                                setHasUserInteracted(true);
                        }

                        // Define que deve tocar quando o vídeo estiver pronto
                        if (hasUserInteracted) {
                                setShouldAutoPlay(true);
                        }

                        getTitleIframe(); // Atualiza o título do vídeo
                }
        };

        const prevVideo = () => {
                const nextIndex = (currentVideoIndex - 1) % listUrl.length;
                setCurrentVideoIndex(nextIndex);

                const nextVideoId = listUrl[nextIndex];

                if (playerRef.current) {
                        playerRef.current.loadVideoById(nextVideoId);

                        // Considera que o usuário interagiu ao clicar no botão de próximo
                        if (!hasUserInteracted) {
                                setHasUserInteracted(true);
                        }

                        // Define que deve tocar quando o vídeo estiver pronto
                        if (hasUserInteracted) {
                                setShouldAutoPlay(true);
                        }

                        getTitleIframe(); // Atualiza o título do vídeo
                }
        };

        const onReady = (event: { target: YT.Player }) => {
                playerRef.current = event.target;

                // Espera um pequeno tempo até o iframe estar no DOM
                const iframe = event.target.getIframe();
                if (iframe) {
                        const title = iframe.getAttribute("title");
                        setVideoTitle(title || "Título não encontrado");
                }

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

        const playVideo = () => {
                if (playerRef.current) {
                        playerRef.current.playVideo();
                        playerRef.current.unMute();
                        setShowMessage(false); // Esconde a mensagem após o vídeo começar
                        setHasUserInteracted(true);
                }
        };

        useEffect(() => {
                const handleKeyPress = () => {
                        playVideo();
                };

                document.addEventListener("keypress", handleKeyPress);
                return () => {
                        document.removeEventListener("keypress", handleKeyPress);
                };
        }, []);

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
                                                <button onClick={() => console.log('play')}>
                                                        <img src={play} className='w-6 h-6' />
                                                </button>
                                                <button onClick={nextVideo}>
                                                        <img src={forward} className='w-6 h-6' />
                                                </button>
                                        </div>
                                        <h2 className="text-white text-2xl">{videoTitle}</h2>
                                </div>
                        </div>
                        <div style={{ display: 'none' }}>
                                <YouTube videoId={listUrl[currentVideoIndex]} opts={opts} onReady={onReady} />
                        </div>
                </>
        );
};

export default VideoPlayer;
