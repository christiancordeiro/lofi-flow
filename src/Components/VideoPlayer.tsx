import YouTube from 'react-youtube';
import Player from './Player/Player';
import { usePlayerContext } from './Player/PlayerContext';
import Header from './Header';

const VideoPlayer = () => {
    const { showMessage, currentVideoIndex, onReady, listUrl } =
        usePlayerContext();

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
                <h1 className="absolute bottom-10 w-full text-center text-2xl text-white animate-pulse drop-shadow-[2px_2px_4px_rgba(255,255,0,0.8)] hidden xl:block">
                    Pressione alguma tecla para iniciar
                </h1>
            )}
            <Header currentVideoIndex={currentVideoIndex} />
            <Player />
            <div
                style={
                    {
                        opacity: 0,
                        visibility: 'hidden',
                        position: 'absolute',
                        zIndex: 9999,
                    }
                }
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
