import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Minus } from "lucide-react";

const NumericLifeCounter = ({ player, initialValue = 115, color = "blue" }) => {
  const [lifePoints, setLifePoints] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleIncrement = () => {
    setLifePoints(prev => prev + 1);
  };

  const handleDecrement = () => {
    setLifePoints(prev => Math.max(0, prev - 1));
  };

  const handleDoubleClick = () => {
    setTempValue(lifePoints.toString());
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setTempValue(value);
    }
  };

  const handleInputSubmit = () => {
    const newValue = parseInt(tempValue) || 0;
    setLifePoints(Math.max(0, newValue));
    setIsEditing(false);
    setTempValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue("");
    }
  };

  const colorClasses = {
    blue: "text-blue-400 border-blue-400",
    purple: "text-purple-400 border-purple-400",
    green: "text-green-400 border-green-400",
    red: "text-red-400 border-red-400"
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-300 text-sm font-medium">Player {player}</span>
        <Badge variant="outline" className={`${colorClasses[color]} font-mono text-lg px-3 py-1`}>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={tempValue}
              onChange={handleInputChange}
              onBlur={handleInputSubmit}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-none outline-none text-center w-16"
              maxLength="6"
            />
          ) : (
            <span 
              onDoubleClick={handleDoubleClick}
              className="cursor-pointer"
              title="Double-click to edit"
            >
              {lifePoints}
            </span>
          )}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecrement}
          className={`flex-1 ${colorClasses[color]} hover:bg-opacity-20`}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <div className="text-slate-400 text-xs px-2">LP</div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleIncrement}
          className={`flex-1 ${colorClasses[color]} hover:bg-opacity-20`}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-xs text-slate-500">
          Double-click to edit
        </div>
      </div>
    </div>
  );
};

export default NumericLifeCounter;