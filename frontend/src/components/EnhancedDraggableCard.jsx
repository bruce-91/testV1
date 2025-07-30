import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const EnhancedDraggableCard = ({ 
  card, 
  position, 
  rotation, 
  flipped, 
  onDragStart, 
  onRotate, 
  onFlip, 
  onRightClick, 
  onHover,
  onClick,
  hasStack,
  isHoveredStack,
  isSelected,
  deckCardBack
}) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showHoverZoom, setShowHoverZoom] = useState(false);

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

  const handleClick = (event) => {
    event.stopPropagation();
    if (onClick) onClick(card.id);
  };

  const handleMouseEnter = (event) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
    
    const hoverTimeout = setTimeout(() => {
      setShowHoverZoom(true);
    }, 2000);
    
    if (onHover) onHover(card, true);
    
    // Store timeout to clear it on mouse leave
    card.hoverTimeout = hoverTimeout;
  };

  const handleMouseLeave = () => {
    if (card.hoverTimeout) {
      clearTimeout(card.hoverTimeout);
    }
    setShowHoverZoom(false);
    if (onHover) onHover(card, false);
  };

  const handleMouseMove = (event) => {
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  // Determine which card back to show
  const cardBackImage = deckCardBack || "default";

  return (
    <>
      <div
        className={`absolute cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 ${
          isHoveredStack ? 'ring-2 ring-yellow-400' : ''
        } ${
          isSelected ? 'ring-2 ring-blue-400' : ''
        }`}
        style={{
          left: position?.x || 0,
          top: position?.y || 0,
          transform: `rotate(${rotation}deg)`,
          zIndex: hasStack ? 20 : 10
        }}
        draggable
        onDragStart={(e) => onDragStart(card, e)}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
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
              <div className="w-full h-full">
                {deckCardBack && deckCardBack !== "default" ? (
                  <img 
                    src={deckCardBack} 
                    alt="Card back"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <div className="text-slate-400 text-xs text-center">Card Back</div>
                  </div>
                )}
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

      {/* Hover Zoom Card */}
      {showHoverZoom && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 200,
            transform: hoverPosition.y < 200 ? 'translateY(200px)' : ''
          }}
        >
          <Card className="w-48 h-64 bg-slate-700 border-slate-600 shadow-2xl">
            <div className="w-full h-full rounded-lg overflow-hidden">
              {flipped ? (
                <div className="w-full h-full">
                  {deckCardBack && deckCardBack !== "default" ? (
                    <img 
                      src={deckCardBack} 
                      alt="Card back"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                      <div className="text-slate-400 text-sm text-center">Card Back</div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 p-4 flex flex-col">
                      <div className="text-white text-lg font-bold mb-2">
                        {card.name}
                      </div>
                      <div className="text-slate-300 text-sm mb-2">
                        {card.type} {card.attribute && `• ${card.attribute}`}
                      </div>
                      {card.level && (
                        <div className="text-slate-300 text-sm mb-2">
                          Level {card.level}
                        </div>
                      )}
                      <div className="flex-1 text-slate-300 text-xs leading-relaxed">
                        {card.description}
                      </div>
                      {(card.attack || card.defense) && (
                        <div className="mt-auto text-sm text-slate-300 font-semibold">
                          ATK/{card.attack || "?"} DEF/{card.defense || "?"}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default EnhancedDraggableCard;