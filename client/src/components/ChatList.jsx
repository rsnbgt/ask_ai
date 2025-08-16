import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'

const ChatList = () => {

   const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{
        credentials:"include",
      }).then((res) =>
        res.json(),
      ),
  })

  return (
    <div className='flex flex-col h-full'>
        <span className='font-semibold mb-2 text-lg text-blue-300'>DASHBOARD</span>
        <Link to="/dashboard">Create a new  Chat</Link>
        <Link to="/">Explore</Link>
        {/* <Link to="/">Contact</Link> */}
        <hr className='opacity-15 border-1 mx-2 my-2'/>
        <span className='font-semibold mb-2 text-lg text-blue-300'>RECENT CHATS</span>
        <div className='flex flex-col overflow-y-scroll '>
          {isPending
            ?"Loading..."
            :error
            ?"Something went Wrong!"
            :data?.map((chat)=>(
              <Link className="p-1 pl-2 rounded-2xl hover:bg-gray-900" to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}
              </Link>
            ))}            
        </div>
        <hr className='opacity-15 border-1 mx-2 my-2'/>
        <div className='flex items-center justify-center mt-auto gap-2'>
            <img className='overflow-hidden w-5 h-5 hover:animate-bounce ' src="/up-arrow.png" alt=""/>
            <span className='font-medium text-blue-300'>Updrade to pro</span>
        </div>
    </div>
  )
}

export default ChatList