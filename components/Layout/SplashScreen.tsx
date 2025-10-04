"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 1300);

    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br to-[#5B3DF6] via-[#755FF5] from-[#02afa5] text-white px-4 text-center">
      <p className="text-2xl sm:text-3xl font-semibold leading-relaxed">
        Team <span className="text-yellow-400 ml-1">PassItOn</span> Welcomes
        you! 🎒📚
      </p>
    </div>
  );
}
