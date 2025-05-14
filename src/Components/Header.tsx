import { useEffect, useRef, useState } from 'react';
import heart from '../assets/heart.svg';
import timer from '../assets/timer.svg';
import me from '../assets/me-pixel.png';
import alertSound from '../assets/alert.mp3';

interface HeaderProps {
    currentVideoIndex: number;
}

const Header = ({ currentVideoIndex }: HeaderProps) => {
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

    return (
        <>
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
        </>
    );
};

export default Header;
