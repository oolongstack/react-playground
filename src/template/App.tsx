import confetti from "canvas-confetti";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  function onMouseMove(e: MouseEvent) {
    confetti({
      particleCount: 5,
      origin: {
        x: e.pageX / window.innerWidth,
        y: (e.pageY + 20) / window.innerHeight,
      },
    });
  }

  return (
    <>
      <h1>Hello World</h1>
      <div className="card" onMouseMove={onMouseMove}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
