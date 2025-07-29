import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Folder, Plus, Search, MoreVertical, Hand, FolderOpen } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const CardLibrary = ({ cards, folders, onAddFolder, onMoveCardToHand }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const { toast } = useToast();

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name is required",
        variant: "destructive"
      });
      return;
    }

    onAddFolder(newFolderName);
    setNewFolderName("");
    setIsAddFolderOpen(false);
    toast({
      title: "Success",
      description: `Folder "${newFolderName}" created successfully!`
    });
  };

  const handleAddToHand = (card, player) => {
    onMoveCardToHand(card, player);
    toast({
      title: "Card Added",
      description: `${card.name} added to Player ${player}'s hand`
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Cards</h2>
          <p className="text-slate-400">
            Organize and manage your card collection
          </p>
        </div>

        <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Folder name"
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-4 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">Folders</h3>
            
            <div className="space-y-2">
              <Button
                variant={selectedFolder === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                All Cards ({cards.length})
              </Button>
              
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name} ({folder.cards.length})
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </Card>
        </div>

        {/* Card Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCards.map((card) => (
              <Card key={card.id} className="p-3 bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
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
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">No cards found</div>
              <p className="text-slate-500">
                {searchTerm ? "Try adjusting your search term" : "Create your first card to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardLibrary;