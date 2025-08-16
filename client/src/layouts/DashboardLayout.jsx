import { useAuth } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import ChatList from '../components/ChatList'

const DashboardLayout = () => {

  const {userId,isLoaded}=useAuth()
  const navigate=useNavigate()

  useEffect(()=>{
    if(isLoaded && !userId){
      navigate("/sign-in");
    }
  },[isLoaded,userId,navigate]);
  
  if(!isLoaded) return "Loading...";

  return (
    <div className='flex gap-2 p-2 h-full'>
        <div className='flex-1/5'>
          <ChatList/>
        </div>
        <div className='flex-4/5 bg-gray-950'>
          <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout