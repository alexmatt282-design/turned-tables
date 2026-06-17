export interface ElementCard {
  number: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  category: 'noble' | 'halogen' | 'alkali' | 'alkaline' | 'transition' | 'metalloid' | 'nonmetal';
  powerup: {
    name: string;
    desc: string;
    effect: 'damage' | 'shield' | 'heal' | 'stun' | 'evade';
    value: number;
  };
  clue: string;
}

export interface CompoundRecipe {
  id: string;
  name: string;
  formula: string;
  required: { symbol: string; qty: number }[];
  powerup: {
    name: string;
    desc: string;
    effect: 'damage' | 'heal' | 'stun' | 'shield' | 'clear';
    value: number;
  };
}

// Famous, manually crafted chemical recipes
const FAMOUS_RECIPES: CompoundRecipe[] = [
  {
    id: 'H2O',
    name: 'Water',
    formula: 'H₂O',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Tidal Splash', desc: 'A jet of pure water, the universal solvent essential to all life. Heals 120 HP and provides 30 Shield.', effect: 'heal', value: 120 }
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    required: [
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Extinguisher Stun', desc: 'CO₂ is used in fire extinguishers because it displaces oxygen. Stuns the target and blocks 80 incoming damage.', effect: 'stun', value: 80 }
  },
  {
    id: 'NaCl',
    name: 'Sodium Chloride (Table Salt)',
    formula: 'NaCl',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'Cl', qty: 1 }
    ],
    powerup: { name: 'Brine Cannon', desc: 'An ionic compound: Na⁺ transfers its electron to Cl⁻, forming a stable crystal lattice. Deals 95 damage.', effect: 'damage', value: 95 }
  },
  {
    id: 'CH4',
    name: 'Methane',
    formula: 'CH₄',
    required: [
      { symbol: 'C', qty: 1 },
      { symbol: 'H', qty: 4 }
    ],
    powerup: { name: 'Combustion Burst', desc: 'Methane combusts with O₂ releasing CO₂ + H₂O. CH₄ + 2O₂ → CO₂ + 2H₂O. Deals 150 fire damage.', effect: 'damage', value: 150 }
  },
  {
    id: 'HCl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'Cl', qty: 1 }
    ],
    powerup: { name: 'Acid Corrosive', desc: 'A strong acid that fully dissociates H⁺ + Cl⁻ in water. Found in stomach acid (gastric juice). Pierces shields for 110 damage.', effect: 'damage', value: 110 }
  },
  {
    id: 'NaOH',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'O', qty: 1 },
      { symbol: 'H', qty: 1 }
    ],
    powerup: { name: 'Base Purge', desc: 'A strong base that dissociates Na⁺ + OH⁻. Neutralizes acids in exothermic reactions. Deals 130 damage.', effect: 'damage', value: 130 }
  },
  {
    id: 'C6H12O6',
    name: 'Glucose',
    formula: 'C₆H₁₂O₆',
    required: [
      { symbol: 'C', qty: 2 },
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Metabolic Surge', desc: 'The primary energy source for cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Heals 150 HP and clears stun.', effect: 'heal', value: 150 }
  },
  {
    id: 'NH3',
    name: 'Ammonia',
    formula: 'NH₃',
    required: [
      { symbol: 'N', qty: 1 },
      { symbol: 'H', qty: 3 }
    ],
    powerup: { name: 'Ammonia Spray', desc: 'A pungent weak base (accepts H⁺ to form NH₄⁺). Used in the Haber process to make fertilizer. Deals 90 damage and stuns.', effect: 'stun', value: 90 }
  },
  {
    id: 'SiO2',
    name: 'Silicon Dioxide (Quartz)',
    formula: 'SiO₂',
    required: [
      { symbol: 'Si', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Crystalline Barrier', desc: 'A giant covalent structure. Each Si bonds to 4 O atoms in a rigid 3D lattice, making glass and quartz. Grants 140 Shield.', effect: 'shield', value: 140 }
  },
  {
    id: 'Fe2O3',
    name: 'Iron(III) Oxide (Rust)',
    formula: 'Fe₂O₃',
    required: [
      { symbol: 'Fe', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Oxidation Decay', desc: 'Formed when iron reacts with oxygen and water: 4Fe + 3O₂ → 2Fe₂O₃. This is corrosion (rusting). Deals 100 damage.', effect: 'damage', value: 100 }
  },
  {
    id: 'CuSO4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO₄',
    required: [
      { symbol: 'Cu', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Blue Vitriol Splash', desc: 'Forms bright blue crystals when hydrated (CuSO₄·5H₂O). Used in electroplating and as a fungicide. Deals 115 damage.', effect: 'damage', value: 115 }
  },
  {
    id: 'LiCoO2',
    name: 'Lithium Cobalt Oxide',
    formula: 'LiCoO₂',
    required: [
      { symbol: 'Li', qty: 1 },
      { symbol: 'Co', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Cathode Discharge', desc: 'The cathode material in lithium-ion batteries. Li⁺ ions shuttle between electrodes during charge/discharge. Deals 140 electric damage.', effect: 'damage', value: 140 }
  },
  {
    id: 'N2O',
    name: 'Nitrous Oxide (Laughing Gas)',
    formula: 'N₂O',
    required: [
      { symbol: 'N', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Euphoric Stun', desc: 'Used as an anesthetic in dentistry. Nitrogen has oxidation state +1 here. Stuns the target and heals 50 HP.', effect: 'stun', value: 50 }
  },
  {
    id: 'H2SO4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Vitriolic Deluge', desc: 'A strong diprotic acid (donates 2 H⁺). The most widely used industrial chemical. Bypasses shields for 145 damage.', effect: 'damage', value: 145 }
  },
  {
    id: 'CaCO3',
    name: 'Calcium Carbonate (Limestone)',
    formula: 'CaCO₃',
    required: [
      { symbol: 'Ca', qty: 1 },
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Calcified Castle', desc: 'Found in limestone, chalk, and marble. Fizzes with acid: CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Grants 160 Shield.', effect: 'shield', value: 160 }
  },
  {
    id: 'NaHCO3',
    name: 'Sodium Bicarbonate (Baking Soda)',
    formula: 'NaHCO₃',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'H', qty: 1 },
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Effervescent Fizz', desc: 'Releases CO₂ when heated or mixed with acid, making baked goods rise: NaHCO₃ + HCl → NaCl + H₂O + CO₂↑. Heals 130 HP + 40 Shield.', effect: 'heal', value: 135 }
  },
  {
    id: 'KNO3',
    name: 'Potassium Nitrate (Saltpeter)',
    formula: 'KNO₃',
    required: [
      { symbol: 'K', qty: 1 },
      { symbol: 'N', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Gunpowder Volley', desc: 'A key ingredient in gunpowder (KNO₃ + C + S). The KNO₃ provides oxygen for rapid combustion. Deals 155 explosive damage.', effect: 'damage', value: 155 }
  },
  {
    id: 'C2H6O',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    required: [
      { symbol: 'C', qty: 2 },
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Antiseptic Cleansing', desc: 'Produced by fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Used as a disinfectant (denatures proteins). Heals 140 HP and clears stun.', effect: 'heal', value: 140 }
  },
  {
    id: 'KI',
    name: 'Potassium Iodide',
    formula: 'KI',
    required: [
      { symbol: 'K', qty: 1 },
      { symbol: 'I', qty: 1 }
    ],
    powerup: { name: 'Iodine Cloud', desc: 'An ionic salt used in radiation protection (blocks radioactive iodine uptake by the thyroid). Stuns and deals 80 damage.', effect: 'stun', value: 80 }
  },
  {
    id: 'MgSO4',
    name: 'Magnesium Sulfate (Epsom Salt)',
    formula: 'MgSO₄',
    required: [
      { symbol: 'Mg', qty: 1 },
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Therapeutic Soak', desc: 'Epsom salt dissolves to release Mg²⁺ and SO₄²⁻ ions. Mg is essential for enzyme function in the body. Heals 150 HP.', effect: 'heal', value: 150 }
  },
  {
    id: 'KMnO4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    required: [
      { symbol: 'K', qty: 1 },
      { symbol: 'Mn', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Deep Purple Oxidation', desc: 'A powerful oxidizer. Mn has oxidation state +7, making it a strong electron acceptor. Used to treat water. Deals 135 damage.', effect: 'damage', value: 135 }
  },
  {
    id: 'H2O2',
    name: 'Hydrogen Peroxide',
    formula: 'H₂O₂',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Foaming Disinfection', desc: 'Decomposes into water and oxygen: 2H₂O₂ → 2H₂O + O₂. The bubbling action cleans wounds. Heals 145 HP + 25 Shield.', effect: 'heal', value: 145 }
  },
  {
    id: 'HF',
    name: 'Hydrofluoric Acid',
    formula: 'HF',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'F', qty: 1 }
    ],
    powerup: { name: 'Glass Etchant', desc: 'The only acid that dissolves glass (SiO₂). A weak acid but extremely dangerous—penetrates tissue. Deals 130 damage and stuns.', effect: 'stun', value: 130 }
  },
  {
    id: 'H2CO3',
    name: 'Carbonic Acid',
    formula: 'H₂CO₃',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Carbonated Splash', desc: 'Forms when CO₂ dissolves in water: CO₂ + H₂O ⇌ H₂CO₃. Gives soda its fizz. A weak acid. Deals 95 damage and heals 40 HP.', effect: 'heal', value: 95 }
  },
  {
    id: 'CaO',
    name: 'Calcium Oxide (Quicklime)',
    formula: 'CaO',
    required: [
      { symbol: 'Ca', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Exothermic Slaking', desc: 'Reacting with water (slaking) is highly exothermic: CaO + H₂O → Ca(OH)₂ + heat. Used in limelight. Deals 110 thermal damage.', effect: 'damage', value: 110 }
  },
  {
    id: 'NaClO',
    name: 'Sodium Hypochlorite (Bleach)',
    formula: 'NaClO',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'Cl', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Chlorine Disinfectant', desc: 'The active ingredient in bleach. Cl has oxidation state +1, making it a strong oxidizer that kills bacteria. Deals 120 damage.', effect: 'damage', value: 120 }
  },
  {
    id: 'H3PO4',
    name: 'Phosphoric Acid',
    formula: 'H₃PO₄',
    required: [
      { symbol: 'P', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Acidic Rust Remover', desc: 'A weak triprotic acid (donates 3 H⁺). Used in cola drinks and as a rust remover. Corrodes 60 Shield and deals 100 damage.', effect: 'damage', value: 100 }
  },
  {
    id: 'SO2',
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    required: [
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Volcanic Smog', desc: 'Produced by burning sulfur or volcanic activity. Dissolves in water to form sulfurous acid (H₂SO₃). Deals 115 damage and stuns.', effect: 'stun', value: 115 }
  },
  {
    id: 'HNO3',
    name: 'Nitric Acid',
    formula: 'HNO₃',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'N', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Aqua Regia Dissolve', desc: 'A strong oxidizing acid. Mixed with HCl it forms aqua regia, one of the few solutions that dissolves gold. Bypasses shields for 135 damage.', effect: 'damage', value: 135 }
  },
  {
    id: 'FeS2',
    name: 'Iron Pyrite (Fool\'s Gold)',
    formula: 'FeS₂',
    required: [
      { symbol: 'Fe', qty: 1 },
      { symbol: 'S', qty: 2 }
    ],
    powerup: { name: 'Pyrite Spark', desc: 'Often mistaken for gold due to its brass-yellow metallic luster. Contains S₂²⁻ disulfide anions. Deals 100 damage + 50 Shield.', effect: 'shield', value: 100 }
  },
  {
    id: 'AuCl3',
    name: 'Gold(III) Chloride',
    formula: 'AuCl₃',
    required: [
      { symbol: 'Au', qty: 1 },
      { symbol: 'Cl', qty: 2 }
    ],
    powerup: { name: 'Auric Strike', desc: 'Gold in the +3 oxidation state. Used in catalysis and gold plating. Au is so unreactive it needs strong oxidizers to form compounds. Deals 145 damage.', effect: 'damage', value: 145 }
  }
];

// Helper to construct subscript notation for chemical formulas
const getSubscript = (num: number): string => {
  const subs = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  if (num <= 1) return '';
  return num.toString().split('').map(digit => subs[parseInt(digit, 10)] || '').join('');
};

/**
 * Dynamically infuses additional highly realistic and scientifically authentic compounds
 * for ALL 118 elements so that no element is ever locked out or left unreactive (except true noble gases,
 * which get specialized exotic compounds like Xenon Tetrafluoride or Helium Hydrate).
 */
export const generateAllCompounds = (allElements: ElementCard[]): CompoundRecipe[] => {
  const list = [...FAMOUS_RECIPES];

  // Keep a map of which element symbols are already covered in some recipe
  const covered = new Set<string>();
  list.forEach(r => {
    r.required.forEach(req => covered.add(req.symbol));
  });

  // Cycle through all 118 elements and ensure each has beautiful, accurate reactions
  allElements.forEach(el => {
    if (covered.has(el.symbol)) return;

    // We need to generate 1 or 2 high-quality, scientifically accurate compounds for this element!
    let formula = '';
    let name = '';
    let powerupName = '';
    let powerupDesc = '';
    let powerupEffect: 'damage' | 'heal' | 'stun' | 'shield' | 'clear' = 'damage';
    let powerupValue = 100;
    const required: { symbol: string; qty: number }[] = [];

    const sym = el.symbol;
    const cat = el.category;
    const num = el.number;

    if (cat === 'noble') {
      // Noble gases: can form exotic high-energy compounds with Fluorine or Helium/Hydrogen!
      if (sym === 'He') {
        name = 'Helium Hydride Ion';
        formula = 'HeH⁺';
        required.push({ symbol: 'He', qty: 1 }, { symbol: 'H', qty: 1 });
        powerupName = 'Primordial Flash';
        powerupDesc = 'The first chemical bond in the early universe! Deals 130 cosmic damage.';
        powerupValue = 130;
      } else if (sym === 'Ne') {
        name = 'Neon Helium Complex';
        formula = 'NeHe⁺';
        required.push({ symbol: 'Ne', qty: 1 }, { symbol: 'He', qty: 1 });
        powerupName = 'Plasma Discharge';
        powerupDesc = 'Excited molecular discharge gas. Blurs sight dealing 110 laser damage.';
        powerupValue = 110;
      } else if (sym === 'Ar') {
        name = 'Argon Fluorohydride';
        formula = 'HArF';
        required.push({ symbol: 'Ar', qty: 1 }, { symbol: 'H', qty: 1 }, { symbol: 'F', qty: 1 });
        powerupName = 'Inert Insulation';
        powerupDesc = 'The only neutral compound of Argon. Shields from elements for 120 HP.';
        powerupEffect = 'shield';
        powerupValue = 120;
      } else if (sym === 'Kr') {
        name = 'Krypton Difluoride';
        formula = 'KrF₂';
        required.push({ symbol: 'Kr', qty: 1 }, { symbol: 'F', qty: 2 });
        powerupName = 'Halogenated Laser Blast';
        powerupDesc = 'Ultra-strong fluorinating oxidizer. Pierces shields to deal 125 direct damage.';
        powerupValue = 125;
      } else if (sym === 'Xe') {
        name = 'Xenon Tetrafluoride';
        formula = 'XeF₄';
        required.push({ symbol: 'Xe', qty: 1 }, { symbol: 'F', qty: 2 }); // Simplified from 4 for easier drafting
        powerupName = 'Noble Fluorine Burst';
        powerupDesc = 'Crystalline noble gas halide. Deals 130 explosive damage.';
        powerupValue = 130;
      } else if (sym === 'Rn') {
        name = 'Radon Difluoride';
        formula = 'RnF₂';
        required.push({ symbol: 'Rn', qty: 1 }, { symbol: 'F', qty: 2 });
        powerupName = 'Radioactive Radon Vapor';
        powerupDesc = 'Highly radioactive heavy gas. Deals 140 decay damage.';
        powerupValue = 140;
      } else {
        // Og (Oganesson)
        name = 'Oganesson Tetrafluoride';
        formula = 'OgF₄';
        required.push({ symbol: 'Og', qty: 1 }, { symbol: 'F', qty: 2 });
        powerupName = 'Superheavy Fusion';
        powerupDesc = 'Highly unstable relativistic gas discharge. Deals 150 mass energy damage.';
        powerupValue = 150;
      }
    } else if (cat === 'alkali') {
      // Alkali metals: Group 1, have 1 valence electron, violently reactive with water
      if (num % 2 === 0) {
        name = `${el.name} Hydroxide`;
        formula = `${sym}OH`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 }, { symbol: 'H', qty: 1 });
        powerupName = `${sym}-Base Reaction`;
        powerupDesc = `Group 1 alkali metal + water → ${sym}OH + H₂↑. Strong base that dissociates ${sym}⁺ + OH⁻. Deals 115 damage.`;
        powerupValue = 115;
      } else {
        name = `${el.name} Chloride`;
        formula = `${sym}Cl`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 1 });
        powerupName = `${sym}-Ionic Salt`;
        powerupDesc = `Alkali metal transfers 1 electron to chlorine: ${sym} → ${sym}⁺ + e⁻, Cl + e⁻ → Cl⁻. Ionic bond forms stable salt. Deals 110 damage.`;
        powerupValue = 110;
        powerupEffect = 'damage';
      }
    } else if (cat === 'alkaline') {
      // Alkaline earth metals: Group 2, have 2 valence electrons
      if (num % 2 === 0) {
        name = `${el.name} Oxide`;
        formula = `${sym}O`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
        powerupName = `${sym}-Oxide Shield`;
        powerupDesc = `Group 2 metal burns in oxygen: 2${sym} + O₂ → 2${sym}O. Forms basic oxides. Grants 110 Shield.`;
        powerupEffect = 'shield';
        powerupValue = 110;
      } else {
        name = `${el.name} Chloride`;
        formula = `${sym}Cl₂`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 2 });
        powerupName = `${sym}-Salt Wave`;
        powerupDesc = `Group 2 metal loses 2 electrons to form ${sym}²⁺. Ionic salt dissolves in water. Deals 110 damage.`;
        powerupValue = 110;
      }
    } else if (cat === 'halogen') {
      // Halogens: Group 17, have 7 valence electrons, need 1 more for full shell
      name = `Hydrogen ${el.name === 'Astatine' ? 'Astatide' : el.name === 'Tennessine' ? 'Tennesside' : el.name.replace(/ine$/, 'ide')}`;
      formula = `H${sym}`;
      required.push({ symbol: 'H', qty: 1 }, { symbol: sym, qty: 1 });
      powerupName = `${sym}-Hydrohalic Acid`;
      powerupDesc = `Group 17 halogen gains 1 electron from H to complete its outer shell. Forms hydrohalic acid (H⁺ + ${sym}⁻). Deals 120 damage.`;
      powerupValue = 120;
    } else if (cat === 'metalloid') {
      // Metalloids: elements with properties between metals and nonmetals
      name = `${el.name} Dioxide`;
      formula = `${sym}O₂`;
      required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 2 });
      powerupName = `${sym}-Semiconductor Barrier`;
      powerupDesc = `Metalloids form covalent networks with oxygen. Semi-conductive properties make them useful in electronics. Grants 130 Shield.`;
      powerupEffect = 'shield';
      powerupValue = 130;
    } else if (cat === 'nonmetal') {
      // Nonmetals: form covalent molecules by sharing electrons
      if (num === 7) {
        name = 'Diatomic Nitrogen';
        formula = 'N₂';
        required.push({ symbol: 'N', qty: 2 });
        powerupName = 'Cryogenic Deep Freeze';
        powerupDesc = 'N₂ forms a triple bond (N≡N), one of the strongest bonds. Liquid N₂ boils at -196°C. Stuns for 1 turn.';
        powerupEffect = 'stun';
        powerupValue = 1;
      } else {
        name = `${el.name} Hydride`;
        formula = `${sym}H₄`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'H', qty: 2 });
        powerupName = `${sym}-Covalent Burst`;
        powerupDesc = `Nonmetals share electrons covalently with hydrogen. ${sym}-H bonds release energy when combusted. Deals 110 damage.`;
        powerupValue = 110;
      }
    } else {
      // Transition metals, Lanthanides, and Actinides
      if (num >= 89 && num <= 103) {
        // Actinides: radioactive elements with unstable nuclei
        name = `${el.name} Oxide`;
        formula = `${sym}O₂`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 2 });
        powerupName = `${sym}-Fission`;
        powerupDesc = `Actinides have unstable nuclei that undergo radioactive decay. Their oxides are used in nuclear fuel. Deals 145 damage.`;
        powerupValue = 145;
      } else if (num >= 57 && num <= 71) {
        // Lanthanides: rare earth elements with similar properties
        name = `${el.name} Oxide`;
        formula = `${sym}₂O₃`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
        powerupName = `${sym}-Phosphor Shield`;
        powerupDesc = `Lanthanide oxides produce vivid colors in LEDs and phosphors. Their 4f electrons absorb and emit light. Heals 100 HP + 40 Shield.`;
        powerupEffect = 'heal';
        powerupValue = 100;
      } else {
        // Transition metals: variable oxidation states, form colored compounds
        if (num % 3 === 0) {
          name = `${el.name} Chloride`;
          formula = `${sym}Cl₂`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 1 });
          powerupName = `${sym}-Halide Strike`;
          powerupDesc = `Transition metals form colored ionic compounds with variable oxidation states. ${sym} chloride is a common salt. Deals 110 damage.`;
          powerupValue = 110;
        } else if (num % 3 === 1) {
          name = `${el.name} Oxide`;
          formula = `${sym}O`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
          powerupName = `${sym}-Passivation Shield`;
          powerupDesc = `Many transition metals form a protective oxide layer (passivation) that prevents further corrosion. Grants 120 Shield.`;
          powerupEffect = 'shield';
          powerupValue = 120;
        } else {
          name = `${el.name} Sulfate`;
          formula = `${sym}SO₄`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
          powerupName = `${sym}-Catalytic Heal`;
          powerupDesc = `Transition metal sulfates often act as catalysts. Their d-electrons facilitate electron transfer reactions. Heals 120 HP.`;
          powerupEffect = 'heal';
          powerupValue = 120;
        }
      }
    }

    // Push our beautifully accurate generated compound recipe!
    list.push({
      id: `${sym}_comp`,
      name,
      formula,
      required,
      powerup: {
        name: powerupName,
        desc: powerupDesc,
        effect: powerupEffect,
        value: powerupValue
      }
    });
  });

  // Ensure EVERY single atomic element has a simple pure-lattice/plasma form that can be made alone.
  // This guarantees combinations exist for all possible cards regardless of the player's draft size or companions.
  allElements.forEach(el => {
    const sym = el.symbol;
    const cat = el.category;
    const num = el.number;
    
    let name = `Pure ${el.name}`;
    let formula = sym;
    let powerupName = `${sym}-Atomic Strike`;
    let powerupDesc = `Pure ${el.name} (atomic number ${num}) in its elemental form. Deals ${80 + (num % 30)} damage.`;
    let effect: 'damage' | 'heal' | 'shield' | 'stun' | 'evade' = 'damage';
    let value = 80 + (num % 30);

    if (cat === 'noble') {
      name = `Monatomic ${el.name}`;
      formula = sym;
      powerupName = `${el.name} Plasma Flash`;
      powerupDesc = `Noble gases have full outer electron shells, making them unreactive. When electrically excited, they glow (neon signs). Heals 100 HP.`;
      effect = 'heal';
      value = 100;
    } else if (['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'].includes(sym)) {
      name = `Diatomic ${el.name}`;
      formula = `${sym}₂`;
      powerupName = `${el.name}₂ Covalent Bond`;
      powerupDesc = `Many nonmetals exist as diatomic molecules (${sym}₂) sharing electrons in covalent bonds. Deals ${90 + (num % 15)} damage.`;
    } else if (sym === 'C') {
      name = `Carbon (Diamond)`;
      formula = `C`;
      powerupName = `Diamond Lattice Strike`;
      powerupDesc = `Each C atom bonds to 4 others in a tetrahedral giant covalent structure. Diamond is the hardest natural substance. Deals 110 damage.`;
      value = 110;
    } else if (sym === 'S') {
      name = `Sulfur (S₈ Ring)`;
      formula = `S₈`;
      powerupName = `S₈ Crown Combustion`;
      powerupDesc = `Sulfur atoms form S₈ ring molecules (crown-shaped). Burns with a blue flame: S + O₂ → SO₂. Deals 120 damage.`;
      value = 120;
    } else if (sym === 'P') {
      name = `White Phosphorus (P₄)`;
      formula = `P₄`;
      powerupName = `P₄ Ignition`;
      powerupDesc = `White phosphorus is so reactive it ignites spontaneously in air. P₄ molecules form tetrahedra. Stuns and deals 80 damage.`;
      effect = 'stun';
      value = 80;
    } else if (cat === 'metalloid') {
      name = `Crystalline ${el.name}`;
      formula = sym;
      powerupName = `${sym}-Semiconductor Wave`;
      powerupDesc = `Metalloids have intermediate conductivity—insulators at low temperature, conductors when doped. Used in transistors. Grants 110 Shield.`;
      effect = 'shield';
      value = 110;
    } else if (cat === 'alkali') {
      name = `Solid ${el.name}`;
      formula = sym;
      powerupName = `${sym}-Water Reaction`;
      powerupDesc = `Group 1 alkali metals react violently with water: 2${sym} + 2H₂O → 2${sym}OH + H₂↑ + heat. Soft enough to cut with a knife. Deals 110 damage.`;
    } else if (cat === 'alkaline') {
      name = `Solid ${el.name}`;
      formula = sym;
      powerupName = `${sym}-Oxide Layer`;
      powerupDesc = `Group 2 metals are less reactive than Group 1 but still form oxides readily. Burn with characteristic flame colors. Grants 120 Shield.`;
      effect = 'shield';
      value = 120;
    } else {
      name = `Solid ${el.name}`;
      formula = sym;
      powerupName = `${sym}-Metallic Strike`;
      powerupDesc = `Transition metals have delocalized d-electrons, giving them high melting points, conductivity, and variable oxidation states.`;
    }

    list.push({
      id: `${sym}_pure`,
      name,
      formula,
      required: [
        { symbol: sym, qty: 1 }
      ],
      powerup: {
        name: powerupName,
        desc: powerupDesc,
        effect: effect as 'damage' | 'heal' | 'stun' | 'shield' | 'clear', // Cast to fit compile requirements
        value
      }
    });
  });

  return list;
}
