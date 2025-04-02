import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function SocketDisplay() {
  const [string, setString] = useState("wait for the string");
  const [value, setValue] = useState('')
  const [score, setScore] = useState(0)
  const [isMatched, setIsMatched] = useState(false)

  useEffect(() => {
    socket.on("randomString", (string) => {
      setString(string);
      setValue("")
      setIsMatched(false)
    });

    if(string == value){
        setScore(score => score + 1)
        setIsMatched(true)
        setValue("")
        socket.emit('randomString')
    }

    return () => {
      socket.off("randomString");
    };
  }, [string, value]);

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-5xl font-semibold text-balance text-gray-900 sm:text-7xl tracking-wider">
          {string}
        </h1>

        {isMatched ? <p className="text-green-500 italic mt-8 text-lg">Matched!!!</p> : <p className="text-amber-500 italic mt-8 text-lg">Matching...</p>}

        <input value={value} onChange={(e)=> setValue(e.target.value)} className="border-gray-200 bg-gray-200 rounded-full px-4 py-2 mt-6"/>

        <p className="mt-8">your score: <span className="text-2xl font-semibold">{score}</span></p>
      </div>
    </main>
  );
}
