import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import forward from '../assets/player/forward.svg'
import previous from '../assets/player/previous.svg'
import play from '../assets/player/play.svg'
import pause from '../assets/player/pause.svg'


const VideoPlayer = () => {
        const playerRef = useRef<YT.Player | null>(null); // Definindo o tipo corretamente
        const [showMessage, setShowMessage] = useState(true); // Estado para controlar a exibição da mensagem

        const onReady = (event: { target: YT.Player }) => {
                playerRef.current = event.target; // Define a referência para o player
        };

        const playVideo = () => {
                if (playerRef.current) {
                        playerRef.current.playVideo();
                        setShowMessage(false); // Esconde a mensagem após o vídeo começar
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
                        autoplay: 0
                },
        };

        return (
                <>
                        {showMessage && <h1 className='absolute bottom-10 w-full text-center text-2xl text-white animate-pulse'>Pressione alguma tecla para iniciar</h1>}
                        <div className='absolute left-12 bottom-8 z-20'>
                                <div className='flex flex-col items-start gap-3'>
                                        <div className='flex justify-center items-center gap-3'>
                                                <button onClick={() => console.log('anterior')}>
                                                        <img src={previous} className='w-6 h-6' />
                                                </button>
                                                <button onClick={() => console.log('play')}>
                                                        <img src={play} className='w-6 h-6' />
                                                </button>
                                                <button onClick={() => console.log('proxima')}>
                                                        <img src={forward} className='w-6 h-6' />
                                                </button>
                                        </div>
                                        <h2 className='text-white text-2xl'> nome da musica...</h2>
                                </div>
                        </div>
                        <div style={{ display: 'none' }}>
                                <YouTube videoId="jfKfPfyJRdk" opts={opts} onReady={onReady} />
                        </div>
                </>
        );
};

export default VideoPlayer;
