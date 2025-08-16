import {useMutation,useQueryClient,} from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useState } from 'react'

const Dashboard = () => {

  const queryClient = useQueryClient();
  const navigate=useNavigate();

  const mutation = useMutation({
    mutationFn: (text)=>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`,{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json"
      },body:JSON.stringify({text})
    }).then((res)=>res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      navigate(`/dashboard/chats/${id}`)
    },
  });

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const text=e.target.text.value;
    if (!text) return;
    
    mutation.mutate(text);
  };

  return (
    <div className='flex flex-col items-center h-full'>
      <div className="flex-1/2 flex flex-col items-center justify-center w-3/4 gap-2">
        <div className="mb-4 opacity-35 flex items-center text-8xl bg-gradient-to-r from-cyan-500 via-red-400 to-blue-500 bg-clip-text text-transparent ">
          <h1>ASK-AI</h1>
        </div>
        <div className="flex gap-4 items-center justify-center w-full">
          <div className="border-2 border-gray-500 flex flex-col justify-center items-center w-1/3 bg-gray-700 p-2 rounded-2xl opacity-70">
            <img className='opacity-50 w-fit h-20' src="create.png" alt="create_photo"/>
            <span className='opacity-50'>New chat</span>
          </div>
          <div className="border-2 border-gray-500 flex flex-col justify-center items-center w-1/3 bg-gray-700 p-2 rounded-2xl opacity-70">
            <img className='opacity-50 w-fit h-20' src="analyzing.png" alt="analyses_photo"/>
            <span className='opacity-50'>Images</span>
          </div>
          <div className="border-2 border-gray-500 flex flex-col justify-center items-center w-1/3 bg-gray-700 p-2 rounded-2xl opacity-70">
            <img className='opacity-50 w-fit h-20' src="code.png" alt="code_photo"/>
            <span className='opacity-50 '>Code</span>
          </div>
        </div>
      </div>
      <div className="mt-auto w-1/2 h-fit p-2 bg-gray-800 border-none flex rounded-2xl items-center justify-center">
        <form onSubmit={handleSubmit} action="" className='flex justify-between items-center w-full h-full p-1 text-gray-300'>
          <input name="text" className=' w-full flex-1/2 outline-none border-none' type='text' placeholder='Ask me anything'/>
          <button className='' type='submit'>
            <img className='w-6 h-6 border-none rounded-full cursor-pointer ' src="/upload.png" alt="upload"/>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard