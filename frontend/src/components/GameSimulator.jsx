import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import FinalEnhancedGameBoard from "./FinalEnhancedGameBoard";
import CardCreator from "./CardCreator";
import FinalEnhancedCardLibrary from "./FinalEnhancedCardLibrary";
import PlaymatSettings from "./PlaymatSettings";
import { mockCards, mockFolders, mockSleeves } from "../utils/mockData";
import { Users, Plus, Library, Settings } from "lucide-react";

const GameSimulator = () => {
  const [cards, setCards] = useState(mockCards);
  const [folders, setFolders] = useState(mockFolders);
  const [sleeves, setSleeves] = useState(mockSleeves);
  const [gameState, setGameState] = useState({
    player1Hand: [mockCards[0], mockCards[1]], // Fire Dragon, Lightning Bolt
    player2Hand: [mockCards[2], mockCards[3]], // Water Guardian, Healing Potion
    playArea: [
      {
        ...mockCards[4], // Dark Assassin
        position: { x: 200, y: 150 },
        rotation: 0,
        flipped: false
      },
      {
        ...mockCards[5], // Mirror Force
        position: { x: 350, y: 200 },
        rotation: 0,
        flipped: true
      }
    ],
    playmats: {
      backgroundImage: null,
      customZones: []
    }
  });

  const addCard = useCallback((newCard) => {
    setCards(prev => [...prev, { ...newCard, id: Date.now().toString() }]);
  }, []);

  const addFolder = useCallback((folderName) => {
    setFolders(prev => [...prev, {
      id: Date.now().toString(),
      name: folderName,
      cards: [],
      profileImage: null,
      cardBack: null
    }]);
  }, []);

  const addSleeve = useCallback((newSleeve) => {
    setSleeves(prev => [...prev, newSleeve]);
  }, []);

  const addCardToDeck = useCallback((card, deckId) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === deckId) {
        return {
          ...folder,
          cards: [...folder.cards, card]
        };
      }
      return folder;
    }));
  }, []);

  const updateDeck = useCallback((updatedDeck) => {
    setFolders(prev => prev.map(folder => 
      folder.id === updatedDeck.id ? updatedDeck : folder
    ));
  }, []);

  const removeCardFromDeck = useCallback((deckId, cardId) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === deckId) {
        return {
          ...folder,
          cards: folder.cards.filter(card => card.id !== cardId)
        };
      }
      return folder;
    }));
  }, []);

  const moveCardToHand = useCallback((card, player) => {
    setGameState(prev => ({
      ...prev,
      [`player${player}Hand`]: [...prev[`player${player}Hand`], card],
      playArea: prev.playArea.filter(item => item.id !== card.id)
    }));
  }, []);

  const moveCardToPlayArea = useCallback((card, position) => {
    setGameState(prev => {
      const newPlayArea = [...prev.playArea];
      newPlayArea.push({
        ...card,
        position,
        rotation: 0,
        flipped: false
      });
      
      return {
        ...prev,
        playArea: newPlayArea,
        player1Hand: prev.player1Hand.filter(c => c.id !== card.id),
        player2Hand: prev.player2Hand.filter(c => c.id !== card.id)
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="border-b border-slate-700 bg-slate-800">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Card Game Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generic virtual tabletop for any card game
          </p>
        </div>
      </div>

      <Tabs defaultValue="game" className="h-[calc(100vh-80px)]">
        <TabsList className="w-full bg-slate-800 border-b border-slate-700 rounded-none h-12">
          <TabsTrigger value="game" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Game Board
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Cards
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            My Cards
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Playmat Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="game" className="h-full p-0">
          <FinalEnhancedGameBoard 
            gameState={gameState}
            setGameState={setGameState}
            cards={cards}
            folders={folders}
            onMoveCardToHand={moveCardToHand}
            onMoveCardToPlayArea={moveCardToPlayArea}
          />
        </TabsContent>

        <TabsContent value="create" className="h-full p-4">
          <CardCreator onAddCard={addCard} />
        </TabsContent>

        <TabsContent value="library" className="h-full p-4">
          <FinalEnhancedCardLibrary 
            cards={cards}
            folders={folders}
            sleeves={sleeves}
            onAddFolder={addFolder}
            onMoveCardToHand={moveCardToHand}
            onAddCardToDeck={addCardToDeck}
            onUpdateDeck={updateDeck}
            onRemoveCardFromDeck={removeCardFromDeck}
            onAddSleeve={addSleeve}
          />
        </TabsContent>

        <TabsContent value="settings" className="h-full p-4">
          <PlaymatSettings 
            gameState={gameState}
            setGameState={setGameState}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameSimulator;