import { useEffect } from 'react'
import name from '../assets/Name.svg'
import g from '../assets/gifs/aaaaaa2.gif'
import vignette from '../assets/vignette.png'
import scanline from '../assets/scanlines.png'
import VideoPlayer from '../Components/VideoPlayer'


const Intro = () => {
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
        <img src={g} alt="gif" className='w-full h-full relative object-cover' />
      </div>
    </main>
  )
}

export default Intro