import { useEffect, useRef, useState } from 'react';
import noiseFile from '../../assets/player/effect/noise.mp3';

export const changeBgGif = () => {
    const bg = document.getElementById('bg-gif') as HTMLImageElement;
    if (bg) {
        const gifPaths = [
            '/gifs/gif1.gif',
            '/gifs/gif2.gif',
            '/gifs/gif3.gif',
            '/gifs/gif4.gif',
            '/gifs/gif5.gif',
            '/gifs/gif6.gif',
            '/gifs/gif7.gif',
            '/gifs/gif8.gif',
            '/gifs/gif9.gif',
            '/gifs/gif10.gif',
            '/gifs/gif11.gif',
            '/gifs/gif12.gif',
            '/gifs/gif13.gif',
            '/gifs/gif14.gif',
        ];
        const randomGif = gifPaths[Math.floor(Math.random() * gifPaths.length)];
        bg.src = randomGif;
    }
};

export const usePlayer = () => {
    const playerRef = useRef<YT.Player | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const listUrl = [
        'jfKfPfyJRdk',
        '5yx6BWlEVcY',
        'qH3fETPsqXU',
        '7NOSDKb0HlU',
        'GgbeNFD7l7Q',
        'HuFYqnbVbzY',
    ];
    const apiKey = import.meta.env.VITE_API_KEY;

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoTitle, setVideoTitle] = useState<string[]>([]);
    const [currentVideoTitle, setCurrentVideoTitle] = useState('Carregando...');
    const [volume, setVolume] = useState(100);
    const [showMessage, setShowMessage] = useState(true); // Estado para controlar a exibição da mensagem
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [buttonTitleClick, setButtonTitleClick] = useState(false);
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    const fetchVideoInfos = async () => {
        try {
            const promises = listUrl.map(async (videoId) => {
                const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
                const res = await fetch(apiUrl);
                const data = await res.json();

                return {
                    title:
                        data.items[0]?.snippet?.title ||
                        'Título não encontrado',
                    thumbnail:
                        data.items[0]?.snippet?.thumbnails?.medium?.url || '',
                };
            });

            const videos = await Promise.all(promises);

            const titles = videos.map((video) => video.title);
            const thumbnails = videos.map((video) => video.thumbnail);

            setVideoTitle(titles);
            setCurrentVideoTitle(titles[currentVideoIndex]);
            setThumbnails(thumbnails);
        } catch (error) {
            console.error('Erro ao buscar informações dos vídeos:', error);
        }
    };

    useEffect(() => {
        fetchVideoInfos();
    }, [currentVideoIndex]);

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
            setIsPlaying(!isPlaying);
        }
    };

    const nextVideo = () => {
        const nextIndex = (currentVideoIndex + 1) % listUrl.length;
        changeVideo(nextIndex);
    };

    const prevVideo = () => {
        const prevIndex =
            (currentVideoIndex - 1 + listUrl.length) % listUrl.length;
        changeVideo(prevIndex);
    };

    const changeVideo = (index: number) => {
        setCurrentVideoIndex(index);
        applyTvScreenClass();
        playNoiseThenVideo();
        changeBgGif();
        setShowMessage(false);
        setIsPlaying(true);

        const nextVideoId = listUrl[index];
        if (playerRef.current) {
            playerRef.current.loadVideoById(nextVideoId);
            if (!hasUserInteracted) setHasUserInteracted(true);
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

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        event.target.style.background = `linear-gradient(to right, white ${newVolume}%, rgb(204, 203, 203) ${newVolume}%)`;
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
        }
    };

    return {
        playerRef,
        videoRef,
        videoTitle,
        isPlaying,
        togglePlayPause,
        nextVideo,
        prevVideo,
        onReady,
        isPlayerReady,
        setShowMessage,
        listUrl,
        showMessage,
        currentVideoIndex,
        setCurrentVideoIndex,
        buttonTitleClick,
        setButtonTitleClick,
        thumbnails,
        currentVideoTitle,
        changeVideo,
        volume,
        handleVolumeChange,
    };
};
