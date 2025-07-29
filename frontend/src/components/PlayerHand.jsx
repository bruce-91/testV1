import React, { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Eye, EyeOff } from "lucide-react";

const PlayerHand = ({ player, cards, onDragStart, position }) => {
  const [isVisible, setIsVisible] = useState(false);

  const isTop = position === "top";

  return (
    <div 
      className={`relative h-20 bg-slate-800 border-t border-b border-slate-700 transition-all duration-300 ${
        isTop ? 'border-b' : 'border-t'
      }`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="absolute inset-0 flex items-center px-4">
        <div className="flex items-center gap-2 mr-4">
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            Player {player}
          </Badge>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300">
            {cards.length} cards
          </Badge>
          {isVisible ? (
            <Eye className="h-4 w-4 text-slate-400" />
          ) : (
            <EyeOff className="h-4 w-4 text-slate-400" />
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto flex-1">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`min-w-16 h-12 bg-slate-700 border-slate-600 cursor-grab hover:scale-105 transition-all duration-200 ${
                !isVisible ? 'bg-slate-600' : ''
              }`}
              draggable
              onDragStart={(e) => onDragStart(card, e)}
            >
              <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
                {isVisible ? (
                  card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="text-white text-xs font-semibold px-1 text-center line-clamp-2">
                      {card.name}
                    </div>
                  )
                ) : (
                  <div className="text-slate-400 text-xs">
                    Hidden
                  </div>
                )}
              </div>
            </Card>
          ))}
          
          {cards.length === 0 && (
            <div className="text-slate-500 text-sm flex items-center">
              No cards in hand
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;