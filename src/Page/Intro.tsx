import name from '../assets/Name.svg';
import vignette from '../assets/vignette.png';
import scanline from '../assets/scanlines.png';
import VideoPlayer from '../Components/VideoPlayer';
import { useEffect, useState } from 'react';
import { changeBgGif } from '../Components/VideoPlayer';
import initial from '/gifs/glitch.gif';

const Intro = () => {
    const [showInitial, setShowInitial] = useState<boolean>(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInitial(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        changeBgGif();
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <main className="flex items-center justify-center h-screen z-0 relative">
                <img src={scanline} alt="scanline" className="absolute" />
                <VideoPlayer />
                <div className="flex items-center justify-center h-screen z-10 px-4 lg:px-0">
                    <img src={name} alt="name site" className="w-72 lg:w-96" />
                </div>
                <div className="w-full h-full z-10 absolute top-0 left-0">
                    <img
                        src={vignette}
                        alt="lateral effect"
                        className="w-full h-full relative"
                    />
                </div>
                <div className="w-full h-full -z-10 absolute top-0 left-0">
                    <div id="effect"></div>
                    <img
                        src=""
                        alt="gif"
                        className="w-full h-full relative object-cover"
                        id="bg-gif"
                    />
                </div>
            </main>

            {showInitial && (
                <div className="absolute top-0 left-0 w-full h-full z-50 bg-black">
                    <img
                        src={initial}
                        alt="loading animation"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </div>
    );
};

export default Intro;
