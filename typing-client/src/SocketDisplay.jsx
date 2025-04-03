import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function SocketDisplay() {
  const [string, setString] = useState(null);
  const [value, setValue] = useState("");
  const [totalStrings, setTotalStrings] = useState(0);
  const [score, setScore] = useState(0);
  const [isMatched, setIsMatched] = useState(false);

  const [isPause, setIsPause] = useState(true);

  useEffect(() => {
    if (!isPause) {
      socket.on("randomString", (string) => {
        setTotalStrings((totalStrings) => totalStrings + 1);
        setIsMatched(false);
        setString(string);
        setValue("");
      });

      if (string == value) {
        setScore((score) => score + 1);
        setIsMatched(true);
        socket.emit("randomString");
      }

      return () => {
        socket.off("randomString");
      };
    }
  }, [string, value, isPause]);

  const togglePlay = () => {
    isPause ? setIsPause(false) : setIsPause(true);
  };

  const getCharacterStyle = (char, index) => {
    if (string == value) return "text-green-500";
    if (index > value.length) return "text-gray-900"; // No style if not typed yet
    return char === value[index] ? "text-gray-300" : "text-gray-900";
  };

  return (
    <main className=" min-h-screen bg-gray-100 px-8 flex flex-col items-center justify-start pt-32 space-y-4">
      <button
        onClick={togglePlay}
        className={`${
          isPause ? "bg-green-400 text-green-700" : "bg-red-400 text-red-700"
        } px-5 py-2 rounded-full font-semibold`}
      >
        {isPause ? "Play" : "Pause"}
      </button>

      <div className="text-center">
        {/* { string ? (
          <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl tracking-wider">
          {string.split('').map((char, index)=> (
            <span key={index} className={`${getCharacterStyle(char, index)}`}>
              {char}
            </span>
          ))}
        </h1>
        ) : <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl">Wait for the string</h1>} */}

        {isPause ? (
          <h1 className="mt-4 text-5xl font-semibold text-red-500 text-balance sm:text-7xl">
            Test is paused
          </h1>
        ) : string ? (
          <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl tracking-wider">
            {string.split("").map((char, index) => (
              <span key={index} className={`${getCharacterStyle(char, index)}`}>
                {char}
              </span>
            ))}
          </h1>
        ) : (
          <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl">
            Wait for the string
          </h1>
        )}

        { !isPause ? (
          isMatched ? (
            <p className="text-green-500 italic mt-8 text-lg">Matched!!!</p>
          ) : (
            <p className="text-amber-500 italic mt-8 text-lg">Matching...</p>
          )
        ) : <div className="mt-8"/>}

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className=" bg-gray-200 rounded-full px-4 py-2 mt-6 border-none outline-none"
        />

        <p className="mt-8">
          Your score: <span className="text-2xl font-semibold">{score}</span>
        </p>
        <p className="mt-6">
          Success rate:{" "}
          <span className="text-2xl font-semibold">
            {Math.round((score * 100) / totalStrings || 0)}%
          </span>
        </p>
      </div>
    </main>
  );
}
