import forward from '../../assets/player/forward.svg';
import previous from '../../assets/player/previous.svg';
import play from '../../assets/player/play.svg';
import pause from '../../assets/player/pause.svg';
import { usePlayerContext } from './PlayerContext';

const Player = () => {
    const {
        currentVideoTitle,
        prevVideo,
        nextVideo,
        togglePlayPause,
        isPlaying,
        setButtonTitleClick,
        buttonTitleClick,
        volume,
        handleVolumeChange,
    } = usePlayerContext();

    return (
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
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setButtonTitleClick(!buttonTitleClick)}
                    className="text-left"
                >
                    <h2 className="text-2xl">{currentVideoTitle}</h2>
                </button>
            </div>
        </div>
    );
};

export default Player;
