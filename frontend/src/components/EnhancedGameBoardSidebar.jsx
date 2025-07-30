import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Users, Package } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import NumericLifeCounter from "./NumericLifeCounter";

const DiceIcon = ({ value }) => {
  const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const Icon = icons[value - 1] || Dice1;
  return <Icon className="h-6 w-6" />;
};

const EnhancedGameBoardSidebar = ({ folders, onDeployDeck }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isDeckSelectOpen, setIsDeckSelectOpen] = useState(false);
  const { toast } = useToast();

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);
        
        toast({
          title: "Dice Rolled",
          description: `Result: ${finalValue}`
        });
      }
    }, 100);
  };

  const handleDeployDeck = (deck) => {
    onDeployDeck(deck);
    setIsDeckSelectOpen(false);
    toast({
      title: "Deck Deployed",
      description: `${deck.name} deployed as a stack on the game board`
    });
  };

  return (
    <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 space-y-6">
      {/* Dice Roller */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <DiceIcon value={diceValue} />
          Dice Roller
        </h3>
        
        <div className="flex flex-col items-center space-y-3">
          <div className={`text-4xl transition-all duration-200 ${isRolling ? 'animate-spin' : ''}`}>
            <DiceIcon value={diceValue} />
          </div>
          
          <Button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isRolling ? "Rolling..." : "Roll Dice"}
          </Button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{diceValue}</div>
            <div className="text-xs text-slate-400">Last Roll</div>
          </div>
        </div>
      </Card>

      {/* Life Point Counters */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Life Points
        </h3>
        
        <div className="space-y-4">
          <NumericLifeCounter 
            player={1}
            initialValue={115}
            color="blue"
          />
          <NumericLifeCounter 
            player={2}
            initialValue={115}
            color="purple"
          />
        </div>
      </Card>

      {/* Deck Deployment */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Deploy Deck
        </h3>
        
        <Dialog open={isDeckSelectOpen} onOpenChange={setIsDeckSelectOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Package className="h-4 w-4 mr-2" />
              Select Deck
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Deploy Deck to Board</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {folders.filter(f => !f.isSystemFolder).map((deck) => (
                <Card 
                  key={deck.id}
                  className="p-3 bg-slate-700 border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleDeployDeck(deck)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-500">
                      {deck.profileImage ? (
                        <img 
                          src={deck.profileImage} 
                          alt={deck.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                          <Package className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-white font-medium">{deck.name}</div>
                      <div className="text-slate-400 text-sm">{deck.cards.length} cards</div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {folders.filter(f => !f.isSystemFolder).length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Package className="h-12 w-12 mx-auto mb-2 text-slate-500" />
                  <p>No decks available</p>
                  <p className="text-sm">Create a deck in My Cards first</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="mt-3 text-xs text-slate-400">
          Deploy an entire deck as a single stack on the game board
        </div>
      </Card>
    </div>
  );
};

export default EnhancedGameBoardSidebar;