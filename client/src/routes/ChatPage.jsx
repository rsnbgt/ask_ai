import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router';
import NewPrompt from '../components/NewPrompt';
import { IKImage } from 'imagekitio-react';


const ChatPage = () => {

  const path=useLocation().pathname
  const chatId=path.split("/").pop()

  const { isPending, error, data } = useQuery({
    queryKey: ['chat',chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,{
        credentials:"include",
      }).then((res) =>
        res.json(),
      ),
  })

  const user="p-2 mb-2 bg-gray-700 rounded-2xl max-w-[80%] self-end"
  const ai="w-2/3 flex flex-col"
  return (
    <div className='h-full flex flex-col items-center'>
      <div className="flex overflow-y-auto w-full h-full justify-center">
        <div className="w-2/3 flex flex-col">
            {isPending
            ?"Loading..."
            :error
            ?"Something went wrong!"
            :data?.history?.map((message,i)=>(
              <>
              {message.img &&(
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={message.img}
                  height="300"
                  width="400"
                  transformation={[{height:300,width:400}]}
                  loading='lazy'
                  lqip={{active:true,quality:20}}
                />
              )}
              <div className={
                message.role==="user"?user:ai
              } key={i}>
                {message.parts[0].text}
              </div>
              </>
            ))}

          <div className='mt-auto'>
          {data && <NewPrompt data={data}/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage