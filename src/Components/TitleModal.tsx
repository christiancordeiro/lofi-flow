import { usePlayerContext } from './Player/PlayerContext';

const TitleModal = () => {
    const { thumbnails, videoTitle, changeVideo, setButtonTitleClick } =
        usePlayerContext();

    const handleClick = (index: number) => {
        changeVideo(index);
        setButtonTitleClick(false);
    };

    return (
        <div className="absolute w-full h-full overflow-hidden bg-black bg-opacity-90 z-50">
            <div className="absolute left-12 right-0 md:right-12 top-8 bottom-8 md:bottom-0 max-h-screen overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    {thumbnails?.map((img, index) => (
                        <div key={index} className="w-60">
                            <button onClick={() => handleClick(index)}>
                                <img
                                    src={img}
                                    alt="icon thumb"
                                    className="bg-cover"
                                />
                                <h4 className="text-white text-lg mt-2">
                                    {videoTitle[index]}
                                </h4>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TitleModal;
