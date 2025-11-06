import YouTube from 'react-youtube';
import Player from './Player/Player';
import { usePlayerContext } from './Player/PlayerContext';
import TitleModal from './TitleModal';

const VideoPlayer = () => {
    const {
        showMessage,
        currentVideoIndex,
        onReady,
        listUrl,
        buttonTitleClick,
    } = usePlayerContext();

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
            <Player />
            {buttonTitleClick && <TitleModal />}
            <div
                style={{
                    opacity: 1,
                    visibility: 'visible',
                    position: 'absolute',
                    zIndex: -9999,
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
