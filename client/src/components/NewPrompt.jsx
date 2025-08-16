import React, { useEffect, useRef } from 'react'
import Upload from './Upload';
import { useState } from 'react';
import { IKImage } from 'imagekitio-react';
import { GoogleGenAI } from "@google/genai";
import { useMutation, useQueryClient, } from '@tanstack/react-query'


const NewPrompt = ({ data }) => {

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  })

  const endRef = useRef(null);
  const formRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);


  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        })
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] }).then(() => {
        formRef.current.reset()
        setQuestion("")
        setAnswer("")
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {},
        })
      });
    },
    onError: (err) => {
      console.log(err);
    }
  });


  async function main(text) {
    let contents;

    if (Object.keys(img.aiData || {}).length) {
      contents = [
        {
          role: "user",
          parts: [
            { inlineData: img.aiData },
            { text }
          ]
        }
      ];
    } else {
      contents = [
        {
          role: "user",
          parts: [{ text }]
        }
      ];
    }
    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
      });
      let accumulatorText = "";
      for await (const chunk of response) {
        accumulatorText += chunk.text;
        setAnswer(accumulatorText);
      }
      mutation.mutate();
    } catch (err) {
      console.log(err)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    const text = e.target.text.value;
    if (!text) return;

    setQuestion(text);
    await main(text)
  }

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun) {
      if (data?.history?.length === 1) {
        text=data.history[0].parts[0].text;
        setQuestion(text);
        main(text)
      }
    }
    hasRun.current=true;
  },[]);

  return (
    <>
      {img.isLoading && <div className=''>Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          className='rounded-2xl border-2 border-blue-300'
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className='question'>{question}</div>}
      {answer && <div className='answer'>{answer}</div>}
      <div className='mt-5' ref={endRef}>
        <form className='w-full p-2 mb-3 flex gap-2 bg-gray-700 rounded-2xl' action="" ref={formRef} onSubmit={handleSubmit} >

          <Upload setImg={setImg} />
          <input id="file" type='file' multiple={false} hidden />
          <input className='flex-1/2 outline-none border-none' name='text' type='text' placeholder='Ask me anything' />
          <button>
            <img className='w-6 h-6 border-none rounded-full cursor-pointer ' src="/upload.png" />
          </button>
        </form>
      </div>
    </>
  )
}

export default NewPrompt