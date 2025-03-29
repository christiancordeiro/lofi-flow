import name from '../assets/Name.svg'
import g from '../assets/gifs/aaaaa.gif'
import vignette from '../assets/vignette.png'

const Intro = () => {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <img src={name} alt="name site" className='w-96' />
      </div>
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