// Mock data for the card game simulator

export const mockCards = [
  {
    id: "1",
    name: "Fire Dragon",
    type: "Monster",
    attribute: "Fire",
    level: "8",
    attack: "3000",
    defense: "2500",
    description: "A mighty dragon that breathes scorching flames. When this card is summoned, it can destroy one spell or trap card on the field.",
    image: null
  },
  {
    id: "2", 
    name: "Lightning Bolt",
    type: "Spell",
    attribute: "Thunder",
    level: "",
    attack: "",
    defense: "",
    description: "Deal 3000 points of damage to any target. This card can only be used once per turn.",
    image: null
  },
  {
    id: "3",
    name: "Water Guardian",
    type: "Monster", 
    attribute: "Water",
    level: "6",
    attack: "2200",
    defense: "2800",
    description: "A protective spirit of the seas. All Water-type monsters gain +300 ATK while this card is on the field.",
    image: null
  },
  {
    id: "4",
    name: "Healing Potion",
    type: "Spell",
    attribute: "Light",
    level: "",
    attack: "",
    defense: "",
    description: "Restore 1000 life points. You can activate this card from your hand during either player's turn.",
    image: null
  },
  {
    id: "5",
    name: "Dark Assassin",
    type: "Monster",
    attribute: "Dark", 
    level: "4",
    attack: "1800",
    defense: "1200",
    description: "A stealthy warrior that strikes from the shadows. This card can attack directly if your opponent has no monsters.",
    image: null
  },
  {
    id: "6",
    name: "Mirror Force",
    type: "Trap",
    attribute: "Light",
    level: "",
    attack: "",
    defense: "",
    description: "When an opponent's monster declares an attack: Destroy all Attack Position monsters your opponent controls.",
    image: null
  }
];

export const mockFolders = [
  {
    id: "folder1",
    name: "Fire Deck",
    cards: [mockCards[0], mockCards[1]],
    profileImage: null,
    cardBack: null
  },
  {
    id: "folder2", 
    name: "Water Deck",
    cards: [mockCards[2], mockCards[3]],
    profileImage: null,
    cardBack: null
  },
  {
    id: "folder3",
    name: "Spell Cards",
    cards: [mockCards[1], mockCards[3]],
    profileImage: null,
    cardBack: null
  },
  {
    id: "sleeves",
    name: "Sleeves",
    cards: [],
    profileImage: null,
    cardBack: null,
    isSystemFolder: true
  }
];

export const mockSleeves = [
  {
    id: "sleeve1",
    name: "Blue Celtic Pattern",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=420&fit=crop"
  },
  {
    id: "sleeve2",
    name: "Red Dragon Scale",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=420&fit=crop"
  },
  {
    id: "sleeve3",
    name: "Golden Ornate",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=420&fit=crop"
  },
  {
    id: "sleeve4",
    name: "Dark Magic Circle",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=420&fit=crop&sat=-100"
  },
  {
    id: "sleeve5",
    name: "Forest Guardian",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=420&fit=crop&hue=120"
  }
];

export const mockGameState = {
  player1Hand: [mockCards[0], mockCards[1]],
  player2Hand: [mockCards[2], mockCards[3]],
  playArea: [
    {
      ...mockCards[4],
      position: { x: 200, y: 150 },
      rotation: 0,
      flipped: false
    },
    {
      ...mockCards[5],
      position: { x: 350, y: 200 },
      rotation: 0,
      flipped: true
    }
  ],
  playmats: {
    backgroundImage: null,
    customZones: []
  }
};