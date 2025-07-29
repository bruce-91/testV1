import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Upload, Image, Trash2, Check } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const PlaymatSettings = ({ gameState, setGameState }) => {
  const [uploadedImages, setUploadedImages] = useState([
    { id: '1', name: 'Yu-Gi-Oh Field', url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', isActive: false },
    { id: '2', name: 'Magic Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop', isActive: false },
    { id: '3', name: 'Cyberpunk Arena', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', isActive: false }
  ]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now().toString(),
          name: uploadName || file.name,
          url: e.target.result,
          isActive: false
        };
        setUploadedImages(prev => [...prev, newImage]);
        setUploadName("");
        setIsUploadDialogOpen(false);
        toast({
          title: "Success",
          description: `Playmat "${newImage.name}" uploaded successfully!`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPlaymat = (imageId) => {
    const selectedImage = uploadedImages.find(img => img.id === imageId);
    if (selectedImage) {
      setGameState(prev => ({
        ...prev,
        playmats: {
          ...prev.playmats,
          backgroundImage: selectedImage.url
        }
      }));
      
      setUploadedImages(prev => 
        prev.map(img => ({ ...img, isActive: img.id === imageId }))
      );
      
      toast({
        title: "Playmat Updated",
        description: `"${selectedImage.name}" is now your active playmat`
      });
    }
  };

  const handleRemoveDefault = () => {
    setGameState(prev => ({
      ...prev,
      playmats: {
        ...prev.playmats,
        backgroundImage: null
      }
    }));
    
    setUploadedImages(prev => 
      prev.map(img => ({ ...img, isActive: false }))
    );
    
    toast({
      title: "Playmat Reset",
      description: "Using default textured background"
    });
  };

  const handleDeleteImage = (imageId) => {
    const imageToDelete = uploadedImages.find(img => img.id === imageId);
    
    if (imageToDelete?.isActive) {
      handleRemoveDefault();
    }
    
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    toast({
      title: "Image Deleted",
      description: "Playmat image removed successfully"
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Playmat Customization</h2>
          <p className="text-slate-400">
            Upload and select background images for your game board
          </p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Playmat Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="playmat-name" className="text-slate-300">Name (optional)</Label>
                <Input
                  id="playmat-name"
                  placeholder="Enter playmat name"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="playmat-file" className="text-slate-300">Image File</Label>
                <input
                  id="playmat-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('playmat-file').click()}
                  className="w-full mt-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose Image File
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {/* Current Active Playmat */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Current Playmat</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-600">
              {gameState.playmats.backgroundImage ? (
                <img 
                  src={gameState.playmats.backgroundImage} 
                  alt="Current playmat"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                  }}
                />
              )}
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">
                {gameState.playmats.backgroundImage ? 
                  uploadedImages.find(img => img.isActive)?.name || "Custom Image" : 
                  "Default Textured Background"
                }
              </div>
              <div className="text-slate-400 text-sm">
                {gameState.playmats.backgroundImage ? "Custom playmat active" : "Using default pattern"}
              </div>
            </div>
            {gameState.playmats.backgroundImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveDefault}
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                Reset to Default
              </Button>
            )}
          </div>
        </Card>

        {/* Available Playmats */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Available Playmats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <Card className={`overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                  image.isActive ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-slate-500'
                }`}>
                  <div className="aspect-video relative">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onClick={() => handleSelectPlaymat(image.id)}
                    />
                    {image.isActive && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <Badge className="bg-blue-600 text-white">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-600/80 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <div className="text-white text-sm font-medium truncate">
                      {image.name}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          {uploadedImages.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Image className="h-12 w-12 mx-auto mb-2 text-slate-500" />
              <p>No custom playmats uploaded yet</p>
              <p className="text-sm">Upload your first playmat to get started</p>
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-3">Tips</h3>
          <div className="text-slate-400 text-sm space-y-2">
            <p>• Recommended image size: 1920x1080 or higher for best quality</p>
            <p>• Supported formats: JPG, PNG, GIF</p>
            <p>• Images will be automatically scaled to fit the game board</p>
            <p>• Click on any playmat to set it as active</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlaymatSettings;