import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Hand, Layers } from "lucide-react";

const StackModal = ({ mainCard, stack, position, onClose, onMoveToHand, onSeparateCard }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{
          position: 'absolute',
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.min(position.y, window.innerHeight - 300)
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Card Stack</h3>
            <Badge className="bg-slate-700 text-slate-300">
              {stack.length + 1} cards
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Main Card (Top of Stack) */}
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-2">Top Card</div>
            <Card className="w-full h-32 bg-slate-600 border-slate-500">
              <div className="w-full h-full rounded-lg overflow-hidden">
                {mainCard.image ? (
                  <img 
                    src={mainCard.image} 
                    alt={mainCard.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 p-2 flex flex-col">
                    <div className="text-white text-xs font-semibold mb-1">
                      {mainCard.name}
                    </div>
                    <div className="text-slate-300 text-xs">
                      {mainCard.type}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onMoveToHand(mainCard, 1)}
              >
                <Hand className="h-3 w-3 mr-1" />
                P1
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => onMoveToHand(mainCard, 2)}
              >
                <Hand className="h-3 w-3 mr-1" />
                P2
              </Button>
            </div>
          </div>

          {/* Stack Cards */}
          {stack.map((card, index) => (
            <div key={card.id} className="bg-slate-700 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-2">Card {index + 2}</div>
              <Card className="w-full h-32 bg-slate-600 border-slate-500">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  {card.image ? (
                    <img 
                      src={card.image} 
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 p-2 flex flex-col">
                      <div className="text-white text-xs font-semibold mb-1">
                        {card.name}
                      </div>
                      <div className="text-slate-300 text-xs">
                        {card.type}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => onMoveToHand(card, 1)}
                >
                  <Hand className="h-3 w-3 mr-1" />
                  P1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => onMoveToHand(card, 2)}
                >
                  <Hand className="h-3 w-3 mr-1" />
                  P2
                </Button>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-full mt-1 text-xs"
                onClick={() => onSeparateCard(card)}
              >
                Separate
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Right-click a card to add to hand • Left-click to separate from stack
        </div>
      </div>
    </div>
  );
};

export default StackModal;