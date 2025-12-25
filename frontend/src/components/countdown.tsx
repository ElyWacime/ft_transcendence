import { useEffect, useState } from "react";

type Props = {
  onFinish: () => void;
};

export default function Countdown({ onFinish }: Props) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      onFinish();
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, onFinish]);

  return (
    <div className="text-6xl font-bold text-center">
      {count}
    </div>
  );
}