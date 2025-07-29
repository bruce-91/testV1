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
    cards: []
  },
  {
    id: "folder2", 
    name: "Water Deck",
    cards: []
  },
  {
    id: "folder3",
    name: "Spell Cards",
    cards: []
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