import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "./ui/card";
import EnhancedDraggableCard from "./EnhancedDraggableCard";
import PlayerHand from "./PlayerHand";
import StackModal from "./StackModal";
import EnhancedGameBoardSidebar from "./EnhancedGameBoardSidebar";
import { useToast } from "../hooks/use-toast";

const UltimateGameBoard = ({ gameState, setGameState, cards, folders, onMoveCardToHand, onMoveCardToPlayArea }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedCards, setSelectedCards] = useState([]);
  const [stackModal, setStackModal] = useState(null);
  const [hoverCard, setHoverCard] = useState(null);
  const [hoveredStack, setHoveredStack] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const boardRef = useRef(null);
  const { toast } = useToast();

  // Track card rotation states and deck origins
  const [cardStates, setCardStates] = useState({});

  // Handle keyboard events for stack shuffling and card deletion
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === 's' && hoveredStack) {
        handleShuffleStack(hoveredStack);
      }
      
      if (event.key === 'Delete' && selectedCard) {
        handleDeleteCard(selectedCard);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [hoveredStack, selectedCard]);

  const getDeckCardBack = (card) => {
    // Find which deck this card originally came from
    const originDeck = folders.find(folder => 
      folder.cards.some(deckCard => deckCard.id === card.id)
    );
    return originDeck?.cardBack || null;
  };

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
          // Single card drop - preserve deck origin
          const cardWithState = {
            ...dropData.data,
            deckOrigin: folders.find(f => f.cards.some(c => c.id === dropData.data.id))?.id
          };
          onMoveCardToPlayArea(cardWithState, dropPosition);
          toast({
            title: "Card Deployed",
            description: `${dropData.data.name} added to game board`
          });
        } else if (dropData.type === 'folder') {
          // Folder drop - deploy all cards with deck origin
          const folder = dropData.data;
          folder.cards.forEach((card, index) => {
            const offsetPosition = {
              x: dropPosition.x + (index % 5) * 30,
              y: dropPosition.y + Math.floor(index / 5) * 40
            };
            const cardWithState = {
              ...card,
              deckOrigin: folder.id
            };
            onMoveCardToPlayArea(cardWithState, offsetPosition);
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
      // Create or add to stack - preserve rotation
      const cardToAdd = {
        ...draggedCard,
        savedRotation: cardStates[draggedCard.id]?.rotation || 0
      };
      
      setGameState(prev => ({
        ...prev,
        playArea: prev.playArea.map(card => {
          if (card.id === targetCard.id) {
            return {
              ...card,
              stack: card.stack ? [...card.stack, cardToAdd] : [cardToAdd]
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
        // Moving existing card - preserve rotation state
        setGameState(prev => ({
          ...prev,
          playArea: prev.playArea.map(card =>
            card.id === draggedCard.id
              ? { 
                  ...card, 
                  position: newPosition,
                  rotation: cardStates[draggedCard.id]?.rotation || card.rotation || 0
                }
              : card
          )
        }));
      } else {
        // Add from hand - restore saved rotation if exists
        const restoredRotation = cardStates[draggedCard.id]?.rotation || 0;
        onMoveCardToPlayArea({
          ...draggedCard,
          rotation: restoredRotation
        }, newPosition);
      }
    }

    setDraggedCard(null);
    setDragOffset({ x: 0, y: 0 });
  }, [draggedCard, dragOffset, gameState, setGameState, onMoveCardToPlayArea, toast, cardStates, folders]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleCardClick = useCallback((cardId) => {
    setSelectedCard(cardId);
    toast({
      title: "Card Selected",
      description: "Press Delete key to remove from board"
    });
  }, [toast]);

  const handleDeleteCard = useCallback((cardId) => {
    setGameState(prev => ({
      ...prev,
      playArea: prev.playArea.filter(card => card.id !== cardId)
    }));
    
    setSelectedCard(null);
    toast({
      title: "Card Removed",
      description: "Card removed from game board"
    });
  }, [setGameState, toast]);

  const handleCardRotate = useCallback((cardId) => {
    setGameState(prev => ({
      ...prev,
      playArea: prev.playArea.map(card =>
        card.id === cardId
          ? { ...card, rotation: (card.rotation || 0) + 180 }
          : card
      )
    }));
    
    // Save rotation state
    setCardStates(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        rotation: ((prev[cardId]?.rotation || 0) + 180) % 360
      }
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
      // Set hovered stack for shuffling
      if (card.stack && card.stack.length > 0) {
        setHoveredStack(card.id);
      }
    } else {
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

  const handleDeployDeck = useCallback((deck) => {
    if (deck.cards.length === 0) {
      toast({
        title: "Empty Deck",
        description: "This deck has no cards to deploy",
        variant: "destructive"
      });
      return;
    }

    // Deploy deck as a stack in the center of the board
    const centerPosition = { x: 400, y: 300 };
    const [firstCard, ...restCards] = deck.cards;
    
    const stackedCard = {
      ...firstCard,
      position: centerPosition,
      rotation: 0,
      flipped: false,
      deckOrigin: deck.id,
      stack: restCards.map(card => ({ ...card, deckOrigin: deck.id }))
    };

    setGameState(prev => ({
      ...prev,
      playArea: [...prev.playArea, stackedCard]
    }));
  }, [setGameState, toast]);

  // Enhanced move to hand that saves rotation state
  const handleMoveToHand = useCallback((card, player) => {
    // Save current rotation state before moving to hand
    const currentCard = gameState.playArea.find(c => c.id === card.id);
    if (currentCard) {
      setCardStates(prev => ({
        ...prev,
        [card.id]: {
          ...prev[card.id],
          rotation: currentCard.rotation || 0
        }
      }));
    }
    
    onMoveCardToHand(card, player);
  }, [gameState.playArea, onMoveCardToHand]);

  return (
    <div className="h-full flex">
      {/* Main Game Area */}
      <div className="flex-1 flex flex-col relative">
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
          onClick={() => setSelectedCard(null)} // Deselect when clicking empty space
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
            <EnhancedDraggableCard
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
              onClick={() => handleCardClick(card.id)}
              hasStack={card.stack && card.stack.length > 0}
              isHoveredStack={hoveredStack === card.id}
              isSelected={selectedCard === card.id}
              deckCardBack={getDeckCardBack(card)}
            />
          ))}

          {/* Instructions Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-800/90 border border-slate-600 rounded-lg p-3 text-white text-sm space-y-1 pointer-events-none">
            <div>• Click card + Delete key to remove</div>
            <div>• Press 'S' while hovering stack to shuffle</div>
            <div>• Hover 2s for card zoom at cursor</div>
            <div>• Double-click to flip, R key to rotate</div>
          </div>

          {/* Stack Shuffle Indicator */}
          {hoveredStack && (
            <div className="absolute top-4 left-4 bg-yellow-600 border border-yellow-500 rounded-lg p-3 text-white text-sm shadow-lg">
              Press 'S' to shuffle stack
            </div>
          )}

          {/* Selected Card Indicator */}
          {selectedCard && (
            <div className="absolute top-4 right-4 bg-blue-600 border border-blue-500 rounded-lg p-3 text-white text-sm shadow-lg">
              Press 'Delete' to remove selected card
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
            onMoveToHand={handleMoveToHand}
            onSeparateCard={(card) => {
              const newPosition = {
                x: stackModal.position.x - 100,
                y: stackModal.position.y - 100
              };
              // Restore saved rotation when separating from stack
              const cardWithRotation = {
                ...card,
                rotation: card.savedRotation || 0
              };
              onMoveCardToPlayArea(cardWithRotation, newPosition);
              setStackModal(null);
            }}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <EnhancedGameBoardSidebar 
        folders={folders}
        onDeployDeck={handleDeployDeck}
      />
    </div>
  );
};

export default UltimateGameBoard;