import { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import forward from '../assets/player/forward.svg';
import previous from '../assets/player/previous.svg';
import play from '../assets/player/play.svg';
import pause from '../assets/player/pause.svg';
import noiseFile from '../assets/player/effect/noise.mp3';
import heart from '../assets/heart.svg';
import timer from '../assets/timer.svg';
import me from '../assets/me-pixel.png';
import alertSound from '../assets/alert.mp3';

export const changeBgGif = () => {
    const bg = document.getElementById('bg-gif') as HTMLImageElement;
    if (bg) {
        const gifPaths = [
            'public/gifs/gif1.gif',
            'public/gifs/gif2.gif',
            'public/gifs/gif3.gif',
            'public/gifs/gif4.gif',
            'public/gifs/gif5.gif',
            'public/gifs/gif6.gif',
            'public/gifs/gif7.gif',
            'public/gifs/gif8.gif',
            'public/gifs/gif9.gif',
            'public/gifs/gif10.gif',
        ];

        // Escolhe um GIF aleatório
        const randomGif = gifPaths[Math.floor(Math.random() * gifPaths.length)];

        bg.src = randomGif;
    }
};

const VideoPlayer = () => {
    const playerRef = useRef<YT.Player | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showMessage, setShowMessage] = useState(true); // Estado para controlar a exibição da mensagem
    const [videoTitle, setVideoTitle] = useState('Carregando...');
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Estado para o índice do vídeo atual
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar a reprodução do vídeo
    const listUrl = [
        'jfKfPfyJRdk',
        '5yx6BWlEVcY',
        'qH3fETPsqXU',
        '7NOSDKb0HlU',
        'GgbeNFD7l7Q',
        'HuFYqnbVbzY',
    ];
    const apiKey = import.meta.env.VITE_API_KEY;

    // Controle de estado para os ícones heart e timer
    const [heartIsVisible, setHeartIsVisible] = useState(false);
    const hasPlayedRef = useRef(false);
    const [pomodoro, setPomodoro] = useState({
        isVisible: false,
        timeLeft: 25 * 60,
        isRunning: false,
    });

    const startTimer = () => {
        setPomodoro((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    };

    const applyTvScreenClass = () => {
        const divEffect = document.getElementById('effect');
        if (divEffect) {
            divEffect.classList.add('loading-channel');
            setTimeout(() => {
                divEffect.classList.remove('loading-channel');
            }, 500);
        }
    };

    const playNoiseThenVideo = () => {
        const noise = new Audio(noiseFile);
        noise.play();
        setTimeout(() => {
            noise.pause();
            noise.currentTime = 0;
            if (videoRef.current) {
                videoRef.current.play();
            }
        }, 500);
    };

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
        const nextIndex =
            (currentVideoIndex - 1 + listUrl.length) % listUrl.length;
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
        setIsPlayerReady(true);

        // Escuta mudança de estado do player
        event.target.addEventListener(
            'onStateChange',
            (e: YT.OnStateChangeEvent) => {
                if (e.data === YT.PlayerState.CUED && shouldAutoPlay) {
                    playerRef.current?.playVideo();
                    if (hasUserInteracted) {
                        playerRef.current?.unMute();
                    }
                    setShouldAutoPlay(false);
                }
            }
        );
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
                const title =
                    data.items[0]?.snippet?.title || 'Título não encontrado';
                setVideoTitle(title);
            } catch (error) {
                console.error('Erro ao buscar título do vídeo:', error);
                setVideoTitle('Carregando título...');
            }
        };

        fetchVideoTitle();
    }, [currentVideoIndex]);

    useEffect(() => {
        const handleKeyPress = () => {
            if (isPlayerReady && playerRef.current) {
                playerRef.current.playVideo();
                playerRef.current.unMute();
                setShowMessage(false);
                setIsPlaying(true);
            } else {
                console.log('Player ainda não está pronto');
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isPlayerReady]);

    useEffect(() => {
        if (pomodoro.isRunning) {
            const interval = setInterval(() => {
                setPomodoro((prev) => {
                    const newTimeLeft =
                        prev.timeLeft > 0 ? prev.timeLeft - 1 : 0;

                    // Quando chega a zero
                    if (newTimeLeft === 0 && !hasPlayedRef.current) {
                        hasPlayedRef.current = true;

                        const audio = new Audio(alertSound);
                        audio.play();

                        setTimeout(() => {
                            audio.pause();
                            audio.currentTime = 0;
                        }, 6000);

                        setTimeout(() => {
                            setPomodoro({
                                ...prev,
                                timeLeft: 25 * 60,
                                isRunning: false,
                            });
                            hasPlayedRef.current = false; 
                        }, 1000);
                    }

                    return { ...prev, timeLeft: newTimeLeft };
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [pomodoro.isRunning]);
    

    // Resetar flag ao reiniciar o timer
    useEffect(() => {
        if (pomodoro.timeLeft > 0) {
            hasPlayedRef.current = false;
        }
    }, [pomodoro.timeLeft]);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0,
            mute: 1,
        },
    };

    return (
        <>
            {showMessage && (
                <h1 className="absolute bottom-10 w-full text-center text-2xl text-white animate-pulse drop-shadow-[2px_2px_4px_rgba(255,255,0,0.8)]">
                    Pressione alguma tecla para iniciar
                </h1>
            )}
            <div className="absolute right-12 top-8 z-20 drop-shadow-[2px_2px_4px_rgba(255,255,0,0.8)]">
                <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                        <button
                            title="Pomodoro"
                            onClick={() => {
                                setPomodoro((prev) => ({
                                    ...prev,
                                    isVisible: !prev.isVisible,
                                }));
                                setHeartIsVisible(false);
                            }}
                        >
                            <img
                                src={timer}
                                alt="timer icon"
                                className="w-6 h-6"
                            />
                        </button>
                        <div
                            className={`text-2xl absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                                pomodoro.isVisible
                                    ? 'translate-y-0 opacity-100'
                                    : '-translate-y-2 opacity-0 pointer-events-none'
                            }
                            `}
                        >
                            <h2>
                                {Math.floor(pomodoro.timeLeft / 60)
                                    .toString()
                                    .padStart(2, '0')}
                                :
                                {(pomodoro.timeLeft % 60)
                                    .toString()
                                    .padStart(2, '0')}
                            </h2>
                            <button onClick={startTimer}>
                                {pomodoro.isRunning ? 'Pause' : 'Start'}
                            </button>
                            <button
                                onClick={() =>
                                    setPomodoro((prev) => ({
                                        ...prev,
                                        timeLeft: prev.timeLeft + 5 * 60,
                                    }))
                                }
                            >
                                +5:00
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            title="About"
                            onClick={() => {
                                setHeartIsVisible(!heartIsVisible);
                                setPomodoro((prev) => ({
                                    ...prev,
                                    isVisible: false,
                                }));
                            }}
                        >
                            <img
                                src={heart}
                                alt="heart icon"
                                className="w-6 h-6"
                            />
                        </button>
                        <div
                            className={`text-2xl absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                                heartIsVisible
                                    ? 'translate-y-0 opacity-100'
                                    : '-translate-y-2 opacity-0 pointer-events-none'
                            }
                            `}
                        >
                            <div className="text-2xl absolute left-1/2 transform -translate-x-1/2">
                                <a
                                    href="https://www.instagram.com/christianc_f/"
                                    target="_blank"
                                    className="flex flex-col items-center justify-center"
                                >
                                    <img
                                        src={me}
                                        alt="Developer"
                                        className="w-20 h-20"
                                    />
                                    <h4 className="text-lg">@christianc_f</h4>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute left-12 top-8 z-20 drop-shadow-[2px_2px_4px_rgba(255,255,0,0.8)]">
                <h2 className="text-2xl">
                    listening now {currentVideoIndex + 1}
                </h2>
            </div>
            <div className="absolute left-12 bottom-8 z-20 drop-shadow-[2px_2px_4px_rgba(255,255,0,0.8)]">
                <div className="flex flex-col items-start gap-2">
                    <div className="flex justify-center items-center gap-3">
                        <button onClick={prevVideo}>
                            <img src={previous} className="w-6 h-6" />
                        </button>
                        <button onClick={togglePlayPause}>
                            <img
                                src={isPlaying ? pause : play}
                                className="w-6 h-6"
                            />
                        </button>
                        <button onClick={nextVideo}>
                            <img src={forward} className="w-6 h-6" />
                        </button>
                    </div>
                    <h2 className="text-2xl ">{videoTitle}</h2>
                </div>
            </div>
            <div
                style={{
                    opacity: 0,
                    visibility: 'hidden',
                    position: 'absolute',
                }}
            >
                <YouTube
                    videoId={listUrl[currentVideoIndex]}
                    opts={opts}
                    onReady={onReady}
                />
            </div>
        </>
    );
};

export default VideoPlayer;
