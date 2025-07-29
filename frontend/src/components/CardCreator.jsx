import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Upload, Plus, Eye, EyeOff } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const CardCreator = ({ onAddCard }) => {
  const [cardData, setCardData] = useState({
    name: "",
    type: "",
    attribute: "",
    level: "",
    attack: "",
    defense: "",
    description: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setCardData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCard = () => {
    if (!cardData.name.trim()) {
      toast({
        title: "Error",
        description: "Card name is required",
        variant: "destructive"
      });
      return;
    }

    onAddCard(cardData);
    toast({
      title: "Success",
      description: `Card "${cardData.name}" created successfully!`
    });
    
    // Reset form
    setCardData({
      name: "",
      type: "",
      attribute: "",
      level: "",
      attack: "",
      defense: "",
      description: "",
      image: null
    });
    setPreviewImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create Custom Card</h2>
        <p className="text-slate-400">
          Design your own cards with custom properties and images
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-4">
          <Card className="p-4 bg-slate-800 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Card Properties</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-slate-300">Card Name *</Label>
                <Input
                  id="name"
                  value={cardData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter card name"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="type" className="text-slate-300">Type</Label>
                  <Input
                    id="type"
                    value={cardData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    placeholder="Monster, Spell, etc."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="attribute" className="text-slate-300">Attribute</Label>
                  <Input
                    id="attribute"
                    value={cardData.attribute}
                    onChange={(e) => handleInputChange("attribute", e.target.value)}
                    placeholder="Fire, Water, etc."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="level" className="text-slate-300">Level/Rank</Label>
                  <Input
                    id="level"
                    type="number"
                    value={cardData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    placeholder="0"
                    min="0"
                    max="12"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="attack" className="text-slate-300">ATK</Label>
                  <Input
                    id="attack"
                    type="number"
                    value={cardData.attack}
                    onChange={(e) => handleInputChange("attack", e.target.value)}
                    placeholder="0"
                    min="0"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="defense" className="text-slate-300">DEF</Label>
                  <Input
                    id="defense"
                    type="number"
                    value={cardData.defense}
                    onChange={(e) => handleInputChange("defense", e.target.value)}
                    placeholder="0"
                    min="0"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-300">Card Text/Effects</Label>
                <Textarea
                  id="description"
                  value={cardData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter card description or effects"
                  rows={3}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-slate-300">Card Image</Label>
                <div className="mt-2">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('image').click()}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleCreateCard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Card
          </Button>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className="text-slate-400 hover:text-white"
            >
              {isPreviewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {isPreviewVisible && (
            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex justify-center">
                <Card className="w-48 h-64 bg-slate-700 border-slate-600">
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Card preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 p-3 flex flex-col">
                        <div className="text-white text-sm font-bold mb-2">
                          {cardData.name || "Card Name"}
                        </div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {cardData.type || "Type"}
                          </Badge>
                          {cardData.level && (
                            <Badge variant="outline" className="text-xs">
                              Lv.{cardData.level}
                            </Badge>
                          )}
                        </div>

                        {cardData.attribute && (
                          <div className="text-slate-300 text-xs mb-2">
                            {cardData.attribute}
                          </div>
                        )}

                        <div className="flex-1 text-slate-300 text-xs leading-tight">
                          {cardData.description || "Card description will appear here..."}
                        </div>

                        {(cardData.attack || cardData.defense) && (
                          <div className="mt-auto text-xs text-slate-300 font-semibold">
                            ATK/{cardData.attack || "?"} DEF/{cardData.defense || "?"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCreator;