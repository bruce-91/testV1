import React, { useState, useRef, useCallback } from "react";
import { Card } from "./ui/card";
import DraggableCard from "./DraggableCard";
import PlayerHand from "./PlayerHand";
import StackModal from "./StackModal";
import { useToast } from "../hooks/use-toast";

const GameBoard = ({ gameState, setGameState, cards, onMoveCardToHand, onMoveCardToPlayArea }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedCards, setSelectedCards] = useState([]);
  const [stackModal, setStackModal] = useState(null);
  const [hoverCard, setHoverCard] = useState(null);
  const boardRef = useRef(null);
  const { toast } = useToast();

  const handleDragStart = useCallback((card, event) => {
    setDraggedCard(card);
    const rect = event.target.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    if (!draggedCard || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newPosition = {
      x: event.clientX - boardRect.left - dragOffset.x,
      y: event.clientY - boardRect.top - dragOffset.y
    };

    // Check if dropping on another card to create stack
    const targetCard = gameState.playArea.find(card => {
      if (card.id === draggedCard.id) return false;
      const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
      if (!cardElement) return false;
      
      const cardRect = cardElement.getBoundingClientRect();
      return (
        event.clientX >= cardRect.left &&
        event.clientX <= cardRect.right &&
        event.clientY >= cardRect.top &&
        event.clientY <= cardRect.bottom
      );
    });

    if (targetCard) {
      // Create or add to stack
      setGameState(prev => ({
        ...prev,
        playArea: prev.playArea.map(card => {
          if (card.id === targetCard.id) {
            return {
              ...card,
              stack: card.stack ? [...card.stack, draggedCard] : [draggedCard]
            };
          }
          if (card.id === draggedCard.id) {
            return null; // Remove from play area as it's now in stack
          }
          return card;
        }).filter(Boolean)
      }));
      
      toast({
        title: "Stack Created",
        description: `${draggedCard.name} added to stack with ${targetCard.name}`
      });
    } else {
      // Move card to new position or add from hand
      if (gameState.playArea.find(card => card.id === draggedCard.id)) {
        // Move existing card
        setGameState(prev => ({
          ...prev,
          playArea: prev.playArea.map(card =>
            card.id === draggedCard.id
              ? { ...card, position: newPosition }
              : card
          )
        }));
      } else {
        // Add from hand
        onMoveCardToPlayArea(draggedCard, newPosition);
      }
    }

    setDraggedCard(null);
    setDragOffset({ x: 0, y: 0 });
  }, [draggedCard, dragOffset, gameState, setGameState, onMoveCardToPlayArea, toast]);

  const handleCardRotate = useCallback((cardId) => {
    setGameState(prev => ({
      ...prev,
      playArea: prev.playArea.map(card =>
        card.id === cardId
          ? { ...card, rotation: (card.rotation || 0) + 180 }
          : card
      )
    }));
  }, [setGameState]);

  const handleCardFlip = useCallback((cardId) => {
    setGameState(prev => ({
      ...prev,
      playArea: prev.playArea.map(card =>
        card.id === cardId
          ? { ...card, flipped: !card.flipped }
          : card
      )
    }));
  }, [setGameState]);

  const handleStackRightClick = useCallback((card, event) => {
    event.preventDefault();
    if (card.stack && card.stack.length > 0) {
      setStackModal({
        mainCard: card,
        stack: card.stack,
        position: { x: event.clientX, y: event.clientY }
      });
    }
  }, []);

  const handleCardHover = useCallback((card, isHovering) => {
    if (isHovering) {
      const timeoutId = setTimeout(() => {
        setHoverCard(card);
      }, 2000);
      card.hoverTimeout = timeoutId;
    } else {
      if (card.hoverTimeout) {
        clearTimeout(card.hoverTimeout);
      }
      setHoverCard(null);
    }
  }, []);

  return (
    <div className="h-full flex flex-col relative">
      {/* Player 2 Hand (Top) */}
      <PlayerHand 
        player={2}
        cards={gameState.player2Hand}
        onDragStart={handleDragStart}
        position="top"
      />

      {/* Game Board */}
      <div 
        ref={boardRef}
        className="flex-1 relative bg-slate-800 border border-slate-700 m-2 rounded-lg overflow-hidden"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          backgroundImage: gameState.playmats.backgroundImage 
            ? `url(${gameState.playmats.backgroundImage})` 
            : 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {/* Render cards in play area */}
        {gameState.playArea.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            position={card.position}
            rotation={card.rotation || 0}
            flipped={card.flipped || false}
            onDragStart={handleDragStart}
            onRotate={handleCardRotate}
            onFlip={handleCardFlip}
            onRightClick={handleStackRightClick}
            onHover={handleCardHover}
            hasStack={card.stack && card.stack.length > 0}
          />
        ))}

        {/* Hover Card Preview */}
        {hoverCard && (
          <div className="fixed top-4 right-4 z-50 pointer-events-none">
            <Card className="w-48 h-64 bg-slate-700 border-slate-600 shadow-2xl">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img 
                  src={hoverCard.image || '/api/placeholder/200/280'} 
                  alt={hoverCard.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Player 1 Hand (Bottom) */}
      <PlayerHand 
        player={1}
        cards={gameState.player1Hand}
        onDragStart={handleDragStart}
        position="bottom"
      />

      {/* Stack Modal */}
      {stackModal && (
        <StackModal
          mainCard={stackModal.mainCard}
          stack={stackModal.stack}
          position={stackModal.position}
          onClose={() => setStackModal(null)}
          onMoveToHand={onMoveCardToHand}
          onSeparateCard={(card) => {
            const newPosition = {
              x: stackModal.position.x - 100,
              y: stackModal.position.y - 100
            };
            onMoveCardToPlayArea(card, newPosition);
            setStackModal(null);
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;