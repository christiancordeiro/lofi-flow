import { useEffect } from 'react'
import name from '../assets/Name.svg'
import g from '../assets/gifs/aaaaa.gif'
import vignette from '../assets/vignette.png'

const Intro = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=jfKfPfyJRdk&key=${apiKey}`

  useEffect(() => {
    async function req() {
      try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.error('Erro ao buscar os dados:', error)
      }
    }
    req()
  })

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