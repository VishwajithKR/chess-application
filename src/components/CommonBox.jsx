import React from "react";

const CommonBox = ({ boxId, img, isActive, selected, onClick, background }) => {
  const isHighlighted = isActive.includes(boxId);

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full flex items-center justify-center cursor-pointer ${background}`}
    >
      {selected && (
        <div className="absolute inset-0 ring-4 ring-yellow-500 z-10 pointer-events-none"></div>
      )}

      {isHighlighted && (
        <div className="absolute w-4 h-4 bg-green-500 rounded-full opacity-75 z-10"></div>
      )}

      {img && (
        <img
          src={img}
          alt="piece"
          className="w-10 h-10 object-contain z-20"
          draggable={false}
        />
      )}
    </div>
  );
};

export default CommonBox;
