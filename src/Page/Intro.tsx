import name from '../assets/Name.svg'
import vignette from '../assets/vignette.png'
import scanline from '../assets/scanlines.png'
import VideoPlayer from '../Components/VideoPlayer'
import { useEffect } from 'react';
import { changeBgGif } from '../Components/VideoPlayer';



const Intro = () => {

  useEffect(() => {
    changeBgGif()
  }, [])

  return (
    <main className='flex items-center justify-center h-screen z-10 relative'>
      <img src={scanline} alt="scanline" className='absolute' />
      <VideoPlayer />
      <div className="flex items-center justify-center h-screen z-20">
        <img src={name} alt="name site" className="w-96" />
      </div>
      {/* <div className=' w-full h-screen '>

      </div> */}
      <div className='w-full h-full z-10 absolute top-0 left-0'>
        <img src={vignette} alt="lateral effect" className='w-full h-full relative' />
      </div>
      <div className='w-full h-full -z-10 absolute top-0 left-0'>
        <div id='effect'></div>
        <img src="" alt="gif" className='w-full h-full relative object-cover' id='bg-gif' />
      </div>
    </main>
  )
}

export default Intro