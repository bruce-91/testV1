import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Search, Package, Eye } from "lucide-react";

const DeckSearchTab = ({ folders, onViewDeck }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter out system folders and search by name
  const userFolders = folders.filter(f => !f.isSystemFolder);
  const filteredDecks = userFolders.filter(deck =>
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Search Decks</h3>
        <p className="text-slate-400">
          Search through your deck collection by name
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search deck names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Deck Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDecks.map((deck) => (
          <Card key={deck.id} className="p-4 bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
            <div className="flex items-center gap-4">
              {/* Deck Profile Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600 flex-shrink-0">
                {deck.profileImage ? (
                  <img 
                    src={deck.profileImage} 
                    alt={deck.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Deck Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-lg truncate">
                  {deck.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {deck.cards.length} cards
                  </Badge>
                  {deck.cardBack && (
                    <Badge variant="outline" className="text-xs">
                      Custom Back
                    </Badge>
                  )}
                </div>
                <div className="text-slate-400 text-sm mt-1">
                  {deck.cards.length > 0 ? 
                    `${new Set(deck.cards.map(c => c.id)).size} unique cards` : 
                    "Empty deck"
                  }
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDeck(deck)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 flex-shrink-0"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>

            {/* Card Preview (first few cards) */}
            {deck.cards.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-slate-400 text-xs mb-2">Recent cards:</div>
                <div className="flex gap-1 overflow-hidden">
                  {deck.cards.slice(0, 4).map((card, index) => (
                    <div key={`${card.id}-${index}`} className="w-8 h-10 bg-slate-700 rounded flex-shrink-0 border border-slate-600">
                      {card.image ? (
                        <img 
                          src={card.image} 
                          alt={card.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded"></div>
                      )}
                    </div>
                  ))}
                  {deck.cards.length > 4 && (
                    <div className="w-8 h-10 bg-slate-600 rounded flex-shrink-0 flex items-center justify-center border border-slate-500">
                      <span className="text-slate-300 text-xs">+{deck.cards.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredDecks.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-slate-500" />
          <div className="text-slate-400 text-lg mb-2">
            {searchTerm ? "No decks found" : "No decks available"}
          </div>
          <p className="text-slate-500">
            {searchTerm ? 
              "Try adjusting your search term" : 
              "Create your first deck to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DeckSearchTab;