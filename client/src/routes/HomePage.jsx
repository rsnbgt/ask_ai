import React from 'react'
import { Link } from 'react-router'

const HomePage = () => {
  
  return (

    <div className='flex items-center gap-3 h-full'>
      <div className='flex-1/2 flex flex-col justify-center items-center text-center'>
        <h1 className='text-8xl bg-gradient-to-r from-cyan-500 via-red-400 to-blue-500 bg-clip-text text-transparent '>ASK-AI</h1>
        <h2 className='text-lg'>Find answers in seconds</h2>
        <h3 className='max-w-0.7 font-thin'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus adipisci c
          upiditate a c vero.
        </h3>
        <Link className='px-2 py-2 bg-blue-600 border-1 rounded-3xl mt-2 text-lg hover:opacity-85 transition delay-150 duration-300 ease-in-out hover:scale-110  hover:text-blue-600 hover:bg-white' to="/dashboard">Get Started</Link>
      </div>
      <div className='flex-1/2 flex justify-center items-center'>
        <img className='rounded-3xl overflow-hidden w-1/2 shadow-blue-300 shadow-md transition hover:animate-pulse hover:scale-105' src="/robot.jpg" alt="robot"/>
      </div>
    </div>
  )
}

export default HomePage