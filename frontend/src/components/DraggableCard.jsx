import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const DraggableCard = ({ 
  card, 
  position, 
  rotation, 
  flipped, 
  onDragStart, 
  onRotate, 
  onFlip, 
  onRightClick, 
  onHover,
  hasStack 
}) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 'r' && event.target.dataset?.cardId === card.id) {
        onRotate(card.id);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [card.id, onRotate]);

  const handleMouseDown = (event) => {
    event.target.dataset.cardId = card.id;
    event.target.focus();
  };

  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105"
      style={{
        left: position?.x || 0,
        top: position?.y || 0,
        transform: `rotate(${rotation}deg)`,
        zIndex: hasStack ? 20 : 10
      }}
      draggable
      onDragStart={(e) => onDragStart(card, e)}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => onHover(card, true)}
      onMouseLeave={() => onHover(card, false)}
      onDoubleClick={() => onFlip(card.id)}
      onContextMenu={(e) => onRightClick(card, e)}
      data-card-id={card.id}
      tabIndex={0}
    >
      <Card className="w-24 h-32 bg-slate-700 border-slate-600 shadow-lg hover:shadow-xl relative">
        {hasStack && (
          <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs z-10">
            Stack
          </Badge>
        )}
        
        <div className="w-full h-full rounded-lg overflow-hidden">
          {flipped ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
              <div className="text-slate-400 text-xs text-center">Card Back</div>
            </div>
          ) : (
            <>
              {card.image ? (
                <img 
                  src={card.image} 
                  alt={card.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 p-1 flex flex-col">
                  <div className="text-white text-xs font-semibold mb-1 line-clamp-2">
                    {card.name}
                  </div>
                  <div className="text-slate-300 text-xs">
                    {card.type}
                  </div>
                  {card.attack && card.defense && (
                    <div className="mt-auto text-xs text-slate-300">
                      ATK/{card.attack} DEF/{card.defense}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DraggableCard;