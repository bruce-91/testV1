import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./ui/card";
import DraggableCard from "./DraggableCard";
import PlayerHand from "./PlayerHand";
import StackModal from "./StackModal";
import { useToast } from "../hooks/use-toast";

const EnhancedGameBoard = ({ gameState, setGameState, cards, onMoveCardToHand, onMoveCardToPlayArea }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedCards, setSelectedCards] = useState([]);
  const [stackModal, setStackModal] = useState(null);
  const [hoverCard, setHoverCard] = useState(null);
  const [hoveredStack, setHoveredStack] = useState(null);
  const boardRef = useRef(null);
  const { toast } = useToast();

  // Handle keyboard events for stack shuffling
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 's' && hoveredStack) {
        handleShuffleStack(hoveredStack);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [hoveredStack]);

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
    if (!draggedCard && !event.dataTransfer) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    // Handle drop from library
    if (event.dataTransfer) {
      try {
        const dropData = JSON.parse(event.dataTransfer.getData('application/json'));
        const dropPosition = {
          x: event.clientX - boardRect.left - 50,
          y: event.clientY - boardRect.top - 50
        };

        if (dropData.type === 'card') {
          // Single card drop
          onMoveCardToPlayArea(dropData.data, dropPosition);
          toast({
            title: "Card Deployed",
            description: `${dropData.data.name} added to game board`
          });
        } else if (dropData.type === 'folder') {
          // Folder drop - deploy all cards
          const folder = dropData.data;
          folder.cards.forEach((card, index) => {
            const offsetPosition = {
              x: dropPosition.x + (index % 5) * 30,
              y: dropPosition.y + Math.floor(index / 5) * 40
            };
            onMoveCardToPlayArea(card, offsetPosition);
          });
          toast({
            title: "Deck Deployed",
            description: `All ${folder.cards.length} cards from "${folder.name}" deployed to board`
          });
        }
        return;
      } catch (e) {
        // Not a library drop, continue with regular card drag
      }
    }

    if (!draggedCard || !boardRef.current) return;

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

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

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
      // Set hover card for zoom
      const timeoutId = setTimeout(() => {
        setHoverCard(card);
      }, 2000);
      card.hoverTimeout = timeoutId;
      
      // Set hovered stack for shuffling
      if (card.stack && card.stack.length > 0) {
        setHoveredStack(card.id);
      }
    } else {
      if (card.hoverTimeout) {
        clearTimeout(card.hoverTimeout);
      }
      setHoverCard(null);
      setHoveredStack(null);
    }
  }, []);

  const handleShuffleStack = useCallback((cardId) => {
    setGameState(prev => ({
      ...prev,
      playArea: prev.playArea.map(card => {
        if (card.id === cardId && card.stack && card.stack.length > 0) {
          // Fisher-Yates shuffle
          const shuffledStack = [...card.stack];
          for (let i = shuffledStack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledStack[i], shuffledStack[j]] = [shuffledStack[j], shuffledStack[i]];
          }
          return { ...card, stack: shuffledStack };
        }
        return card;
      })
    }));
    
    toast({
      title: "Stack Shuffled",
      description: "Card stack has been shuffled"
    });
  }, [setGameState, toast]);

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
        onDragOver={handleDragOver}
        style={{
          backgroundImage: gameState.playmats.backgroundImage 
            ? `url(${gameState.playmats.backgroundImage})` 
            : 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
          backgroundSize: gameState.playmats.backgroundImage ? 'cover' : '20px 20px',
          backgroundPosition: gameState.playmats.backgroundImage ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundRepeat: gameState.playmats.backgroundImage ? 'no-repeat' : 'repeat'
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
            isHoveredStack={hoveredStack === card.id}
          />
        ))}

        {/* Stack Shuffle Indicator */}
        {hoveredStack && (
          <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm shadow-lg">
            Press 'S' to shuffle stack
          </div>
        )}

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

export default EnhancedGameBoard;