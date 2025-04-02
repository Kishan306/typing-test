import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function SocketDisplay() {
  const [string, setString] = useState(null);
  const [value, setValue] = useState('')
  const [score, setScore] = useState(0)
  const [isMatched, setIsMatched] = useState(false)

  useEffect(() => {
    socket.on("randomString", (string) => {
      setIsMatched(false)
      setString(string);
      setValue("")
    });

    if(string == value){
        setScore(score => score + 1)
        setIsMatched(true)
        socket.emit('randomString')
    }

    return () => {
      socket.off("randomString");
    };
  }, [string, value]);

  const getCharacterStyle = (char, index) => {
    if(string == value) return "text-green-500"
    if (index > value.length) return "text-gray-900"; // No style if not typed yet
    return char === value[index]
      ? "text-gray-300" 
      : "text-gray-900"; 
  };

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        { string ? (
          <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl tracking-wider">
          {string.split('').map((char, index)=> (
            <span key={index} className={`${getCharacterStyle(char, index)}`}>
              {char}
            </span>
          ))}
        </h1>
        ) : <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl">Wait for the string</h1>}

        {isMatched ? <p className="text-green-500 italic mt-8 text-lg">Matched!!!</p> : <p className="text-amber-500 italic mt-8 text-lg">Matching...</p>}

        <input value={value} onChange={(e)=> setValue(e.target.value)} className=" bg-gray-200 rounded-full px-4 py-2 mt-6 border-none outline-none"/>

        <p className="mt-8">your score: <span className="text-2xl font-semibold">{score}</span></p>
      </div>
    </main>
  );
}
