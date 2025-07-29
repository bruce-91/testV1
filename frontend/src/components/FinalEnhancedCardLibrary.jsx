import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Folder, Plus, Search, MoreVertical, Hand, FolderOpen, Users, Package, Shield, Upload } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import DeckDetailView from "./DeckDetailView";

const FinalEnhancedCardLibrary = ({ cards, folders, sleeves, onAddFolder, onMoveCardToHand, onAddCardToDeck, onUpdateDeck, onRemoveCardFromDeck, onAddSleeve }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewingDeck, setViewingDeck] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isAddCardToDeckOpen, setIsAddCardToDeckOpen] = useState(false);
  const [isAddSleeveOpen, setIsAddSleeveOpen] = useState(false);
  const [selectedDeckForCard, setSelectedDeckForCard] = useState(null);
  const [cardSearchTerm, setCardSearchTerm] = useState("");
  const [sleeveName, setSleeveName] = useState("");
  const { toast } = useToast();

  // Get non-system folders (exclude sleeves)
  const userFolders = folders.filter(f => !f.isSystemFolder);
  const sleevesFolder = folders.find(f => f.isSystemFolder && f.name === "Sleeves");

  const filteredCards = selectedFolder === "sleeves" 
    ? sleeves
    : cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const searchableCards = cards.filter(card =>
    card.name.toLowerCase().includes(cardSearchTerm.toLowerCase())
  );

  // If viewing a deck detail, show that component
  if (viewingDeck) {
    return (
      <DeckDetailView 
        deck={viewingDeck}
        cards={cards}
        sleeves={sleeves}
        onBack={() => setViewingDeck(null)}
        onUpdateDeck={(updatedDeck) => {
          onUpdateDeck(updatedDeck);
          setViewingDeck(updatedDeck);
        }}
        onRemoveCardFromDeck={onRemoveCardFromDeck}
      />
    );
  }

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Deck name is required",
        variant: "destructive"
      });
      return;
    }

    onAddFolder(newFolderName);
    setNewFolderName("");
    setIsAddFolderOpen(false);
    toast({
      title: "Success",
      description: `Deck "${newFolderName}" created successfully!`
    });
  };

  const handleAddToHand = (card, player) => {
    onMoveCardToHand(card, player);
    toast({
      title: "Card Added",
      description: `${card.name} added to Player ${player}'s hand`
    });
  };

  const handleDragStart = (event, item, type) => {
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: type, // 'card' or 'folder'
      data: item
    }));
  };

  const handleAddCardToDeck = (card, deckId) => {
    onAddCardToDeck(card, deckId);
    toast({
      title: "Card Added to Deck",
      description: `${card.name} added to ${folders.find(f => f.id === deckId)?.name}`
    });
  };

  const handleDeployDeckToBoard = (folder) => {
    toast({
      title: "Deck Deployed", 
      description: `All cards from "${folder.name}" deployed to game board`
    });
  };

  const handleSleeveUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newSleeve = {
          id: Date.now().toString(),
          name: sleeveName || file.name,
          url: e.target.result
        };
        onAddSleeve(newSleeve);
        setSleeveName("");
        setIsAddSleeveOpen(false);
        toast({
          title: "Sleeve Added",
          description: `"${newSleeve.name}" added to sleeves collection`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Cards</h2>
          <p className="text-slate-400">
            Organize cards into decks and manage card sleeves
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add Sleeve Dialog */}
          <Dialog open={isAddSleeveOpen} onOpenChange={setIsAddSleeveOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Shield className="h-4 w-4 mr-2" />
                Add Sleeve
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Card Sleeve</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Sleeve name (optional)"
                  value={sleeveName}
                  onChange={(e) => setSleeveName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSleeveUpload}
                    className="hidden"
                    id="sleeve-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('sleeve-upload').click()}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Sleeve Image
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Card to Deck Dialog */}
          <Dialog open={isAddCardToDeckOpen} onOpenChange={setIsAddCardToDeckOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Add to Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Add Card to Deck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm">Select Deck:</label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {userFolders.map((folder) => (
                      <Button
                        key={folder.id}
                        variant={selectedDeckForCard === folder.id ? "secondary" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedDeckForCard(folder.id)}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        {folder.name} ({folder.cards.length})
                      </Button>
                    ))}
                  </div>
                </div>
                
                {selectedDeckForCard && (
                  <div>
                    <label className="text-slate-300 text-sm">Search Cards:</label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search card names..."
                        value={cardSearchTerm}
                        onChange={(e) => setCardSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto mt-2 space-y-1">
                      {searchableCards.map((card) => (
                        <Button
                          key={card.id}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => {
                            handleAddCardToDeck(card, selectedDeckForCard);
                            setCardSearchTerm("");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {card.type}
                            </Badge>
                            <span>{card.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* New Deck Dialog */}
          <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Deck
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Deck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Deck name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddFolder} className="flex-1">
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddFolderOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Collections</h3>
            
            <div className="space-y-2">
              <Button
                variant={selectedFolder === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                All Cards ({cards.length})
              </Button>

              <Button
                variant={selectedFolder === "sleeves" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder("sleeves")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Sleeves ({sleeves.length})
              </Button>
              
              {userFolders.map((folder) => (
                <div key={folder.id} className="group relative">
                  <Button
                    variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                    className="w-full justify-start pr-8"
                    onClick={() => setViewingDeck(folder)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, folder, 'folder')}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    {folder.name} ({folder.cards.length})
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem 
                        onClick={() => handleDeployDeckToBoard(folder)}
                        className="text-slate-300 hover:bg-slate-700"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Deploy to Board
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder={selectedFolder === "sleeves" ? "Search sleeves..." : "Search cards..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-4 bg-slate-800 border-slate-700">
            <h4 className="text-sm font-semibold text-white mb-2">💡 Quick Actions</h4>
            <div className="text-xs text-slate-400 space-y-1">
              <p>• Click deck names to view/edit contents</p>
              <p>• Drag cards to game board</p>
              <p>• Drag entire decks to deploy all cards</p>
              <p>• Upload sleeves for custom card backs</p>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="lg:col-span-3">
          {selectedFolder === "sleeves" ? (
            // Sleeves View
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCards.map((sleeve) => (
                <Card key={sleeve.id} className="p-3 bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                  <div className="w-full h-40 mb-3">
                    <img 
                      src={sleeve.url} 
                      alt={sleeve.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="text-white text-sm font-semibold text-center">
                    {sleeve.name}
                  </div>
                  <Badge variant="outline" className="w-full mt-2 justify-center">
                    Card Back
                  </Badge>
                </Card>
              ))}
              
              {filteredCards.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Shield className="h-12 w-12 mx-auto mb-2 text-slate-500" />
                  <div className="text-slate-400 text-lg mb-2">No sleeves found</div>
                  <p className="text-slate-500">Add custom card sleeves to get started</p>
                </div>
              )}
            </div>
          ) : (
            // Cards View
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCards.map((card) => (
                <Card 
                  key={card.id} 
                  className="p-3 bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, 'card')}
                >
                  <div className="relative">
                    <div className="w-full h-32 mb-3">
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded flex items-center justify-center">
                          <div className="text-slate-400 text-xs text-center">
                            No Image
                          </div>
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 bg-slate-800/80 hover:bg-slate-700"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem 
                          onClick={() => handleAddToHand(card, 1)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Hand className="h-4 w-4 mr-2" />
                          Add to Player 1 Hand
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAddToHand(card, 2)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Hand className="h-4 w-4 mr-2" />
                          Add to Player 2 Hand
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-semibold text-sm line-clamp-1">
                      {card.name}
                    </h4>
                    
                    <div className="flex flex-wrap gap-1">
                      {card.type && (
                        <Badge variant="secondary" className="text-xs">
                          {card.type}
                        </Badge>
                      )}
                      {card.level && (
                        <Badge variant="outline" className="text-xs">
                          Lv.{card.level}
                        </Badge>
                      )}
                    </div>

                    {(card.attack || card.defense) && (
                      <div className="text-xs text-slate-400">
                        ATK/{card.attack || "?"} DEF/{card.defense || "?"}
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {filteredCards.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-slate-400 text-lg mb-2">No cards found</div>
                  <p className="text-slate-500">
                    {searchTerm ? "Try adjusting your search term" : "Create your first card to get started"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalEnhancedCardLibrary;