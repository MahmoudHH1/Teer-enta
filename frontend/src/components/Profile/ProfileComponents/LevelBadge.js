import React from "react";

const LevelBadge = ({ level }) => {

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return "Silver";
      case 2:
        return "Bronze";
      case 3:
        return "Platinum";
      default:
        return "Unknown Level";
    }
  };

  return (
    <>
      <style>
        {`
                @keyframes customPulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }
                .custom-pulse {
                    animation: customPulse 2s ease-in-out infinite;
                }
            `}
      </style>
      <div
        className={`relative inline-flex items-center justify-center w-fit p-2 h-12 text-white font-bold rounded-full ${
          level === 1
            ? "bg-gray-400"
            : level === 2
            ? "bg-yellow-700"
            : "bg-indigo-300"
        } custom-pulse`}
        style={{ border: "2px solid black" }}
      >
        <span className="text-md">{getLevelText(level)}</span>
      </div>
    </>
  );
};

export default LevelBadge;
