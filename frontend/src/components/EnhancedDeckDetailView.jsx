import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ArrowLeft, Plus, Search, Upload, Image, Trash2, Settings, Minus } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const EnhancedDeckDetailView = ({ deck, cards, sleeves, onBack, onUpdateDeck, onRemoveCardFromDeck, onAddCardToDeck }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isSleeveSelectOpen, setIsSleeveSelectOpen] = useState(false);
  const [deckProfileImage, setDeckProfileImage] = useState(deck.profileImage || null);
  const { toast } = useToast();

  const availableCards = cards.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group deck cards by ID to show quantities
  const cardQuantities = deck.cards.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {});

  const uniqueCards = deck.cards.filter((card, index, self) => 
    index === self.findIndex(c => c.id === card.id)
  );

  const handleAddCardToDeck = (card) => {
    onAddCardToDeck(card, deck.id);
    toast({
      title: "Card Added",
      description: `${card.name} added to ${deck.name}`
    });
  };

  const handleRemoveOneCard = (cardId) => {
    onRemoveCardFromDeck(deck.id, cardId, 1); // Remove only one instance
    toast({
      title: "Card Removed",
      description: "One instance removed from deck"
    });
  };

  const handleAddOneCard = (card) => {
    onAddCardToDeck(card, deck.id);
    toast({
      title: "Card Added",
      description: `${card.name} added to deck`
    });
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setDeckProfileImage(imageUrl);
        onUpdateDeck({
          ...deck,
          profileImage: imageUrl
        });
        toast({
          title: "Profile Updated",
          description: "Deck profile image updated successfully"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSleeveSelection = (sleeve) => {
    onUpdateDeck({
      ...deck,
      cardBack: sleeve.url
    });
    setIsSleeveSelectOpen(false);
    toast({
      title: "Card Back Updated",
      description: `"${sleeve.name}" selected as card back for this deck`
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>
        
        <div className="flex items-center gap-4 flex-1">
          {/* Deck Profile Image */}
          <div className="relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600">
              {deckProfileImage ? (
                <img 
                  src={deckProfileImage} 
                  alt={deck.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <Image className="h-6 w-6 text-slate-400" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              title="Click to change deck image"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{deck.name}</h2>
            <p className="text-slate-400">
              {deck.cards.length} cards • {Object.keys(cardQuantities).length} unique •
              {deck.cardBack ? " Custom card back selected" : " Default card back"}
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isSleeveSelectOpen} onOpenChange={setIsSleeveSelectOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Card Back
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Select Card Back</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {sleeves.map((sleeve) => (
                    <Card 
                      key={sleeve.id}
                      className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={() => handleSleeveSelection(sleeve)}
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-lg">
                        <img 
                          src={sleeve.url} 
                          alt={sleeve.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-white text-sm font-medium truncate">
                          {sleeve.name}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cards
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Cards to {deck.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search available cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {availableCards.map((card) => (
                      <Card 
                        key={card.id} 
                        className="p-2 bg-slate-700 border-slate-600 cursor-pointer hover:bg-slate-600"
                        onClick={() => handleAddCardToDeck(card)}
                      >
                        <div className="w-full h-24 mb-2">
                          {card.image ? (
                            <img 
                              src={card.image} 
                              alt={card.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center">
                              <div className="text-slate-400 text-xs">No Image</div>
                            </div>
                          )}
                        </div>
                        <div className="text-white text-xs font-semibold line-clamp-2">
                          {card.name}
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {card.type}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                  
                  {availableCards.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p>No cards found</p>
                      <p className="text-sm">Try adjusting your search term</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Deck Cards */}
      <Card className="p-6 bg-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Deck Contents</h3>
        
        {uniqueCards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uniqueCards.map((card) => {
              const quantity = cardQuantities[card.id];
              return (
                <div key={card.id} className="relative">
                  <Card className="p-3 bg-slate-700 border-slate-600">
                    <div className="w-full h-32 mb-2">
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center">
                          <div className="text-slate-400 text-xs text-center">No Image</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-white text-sm font-semibold line-clamp-1">
                        {card.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {card.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          x{quantity}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOneCard(card.id)}
                        className="flex-1 text-red-400 border-red-400 hover:bg-red-400/20 h-6 text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddOneCard(card)}
                        className="flex-1 text-green-400 border-green-400 hover:bg-green-400/20 h-6 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <div className="text-lg mb-2">Empty Deck</div>
            <p>Add cards to this deck to get started</p>
            <Button 
              className="mt-4"
              onClick={() => setIsAddCardOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Card
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EnhancedDeckDetailView;