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
    name: 'Pure Water',
    formula: 'H₂O',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Tidal Splash', desc: 'A soothing jet of pure water. Heals 120 HP and provides 30 Shield.', effect: 'heal', value: 120 }
  },
  {
    id: 'CO2',
    name: 'Carbon Dioxide Gas',
    formula: 'CO₂',
    required: [
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Extinguisher Stun', desc: 'Puffs dry ice fog. Stuns the target and blocks 80 incoming damage.', effect: 'stun', value: 80 }
  },
  {
    id: 'NaCl',
    name: 'Table Salt',
    formula: 'NaCl',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'Cl', qty: 1 }
    ],
    powerup: { name: 'Brine Cannon', desc: 'Corrosive salt spray. Shatters opponent shielding and deals 95 damage.', effect: 'damage', value: 95 }
  },
  {
    id: 'CH4',
    name: 'Methane Gas',
    formula: 'CH₄',
    required: [
      { symbol: 'C', qty: 1 },
      { symbol: 'H', qty: 4 }
    ],
    powerup: { name: 'Methane Explosion', desc: 'Ignites natural blue flames. Deals a devastating 150 fire damage.', effect: 'damage', value: 150 }
  },
  {
    id: 'HCl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'Cl', qty: 1 }
    ],
    powerup: { name: 'Acid Corrosive', desc: 'Strong stomach acid wash. Pierces all shields to deal 110 direct damage.', effect: 'damage', value: 110 }
  },
  {
    id: 'NaOH',
    name: 'Sodium Hydroxide (Lye)',
    formula: 'NaOH',
    required: [
      { symbol: 'Na', qty: 1 },
      { symbol: 'O', qty: 1 },
      { symbol: 'H', qty: 1 }
    ],
    powerup: { name: 'Lye Purge', desc: 'Caustic laboratory chemical bath. Deals 130 damage.', effect: 'damage', value: 130 }
  },
  {
    id: 'C6H12O6',
    name: 'Glucose Syrup',
    formula: 'C₆H₁₂O₆',
    required: [
      { symbol: 'C', qty: 2 }, // Reduced requirement slightly for practical battle drafting (2, 2, 2 instead of 6,12,6)
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Metabolic Surge', desc: 'Instant bio-cellular fuel. Heals 150 HP and clears stun.', effect: 'heal', value: 150 }
  },
  {
    id: 'NH3',
    name: 'Household Ammonia',
    formula: 'NH₃',
    required: [
      { symbol: 'N', qty: 1 },
      { symbol: 'H', qty: 3 }
    ],
    powerup: { name: 'Pungent Ammonia Spray', desc: 'Powerful chemical vapor. Deals 90 damage and stuns the opponent.', effect: 'stun', value: 90 }
  },
  {
    id: 'SiO2',
    name: 'Quartz Sand',
    formula: 'SiO₂',
    required: [
      { symbol: 'Si', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Crystalline Barrier', desc: 'Fused solid quartz shield. Grants 140 Shield.', effect: 'shield', value: 140 }
  },
  {
    id: 'Fe2O3',
    name: 'Ferric Rust',
    formula: 'Fe₂O₃',
    required: [
      { symbol: 'Fe', qty: 2 },
      { symbol: 'O', qty: 1 } // Simplified for drafting
    ],
    powerup: { name: 'Oxide Decay', desc: 'Deals 100 oxidation damage and corrodes 40 opponent shield.', effect: 'damage', value: 100 }
  },
  {
    id: 'CuSO4',
    name: 'Copper Sulfate crystals',
    formula: 'CuSO₄',
    required: [
      { symbol: 'Cu', qty: 1 },
      { symbol: 'O', qty: 2 } // Simplified
    ],
    powerup: { name: 'Vitriol Splash', desc: 'Chalcocyanite vapor acid. Deals 115 damage.', effect: 'damage', value: 115 }
  },
  {
    id: 'LiCoO2',
    name: 'Lithium Cobalt Battery Core',
    formula: 'LiCoO₂',
    required: [
      { symbol: 'Li', qty: 1 },
      { symbol: 'Co', qty: 1 },
      { symbol: 'O', qty: 1 } // Simplified
    ],
    powerup: { name: 'Cathode Discharge', desc: 'High-energy electrical short-circuit. Deals 140 electric damage.', effect: 'damage', value: 140 }
  },
  {
    id: 'N2O',
    name: 'Dinitrogen Monoxide (Laughing Gas)',
    formula: 'N₂O',
    required: [
      { symbol: 'N', qty: 2 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Euphoric Stun', desc: 'Inhaling laughing gas dazes the opponent. Stuns the target and heals 50 HP.', effect: 'stun', value: 50 }
  },
  {
    id: 'H2SO4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 } // Simplified for draft availability
    ],
    powerup: { name: 'Vitriolic Deluge', desc: 'Extremely concentrated acid torrent. Bypasses shielding to deal 145 devastating damage.', effect: 'damage', value: 145 }
  },
  {
    id: 'CaCO3',
    name: 'Calcium Carbonate (Limestone)',
    formula: 'CaCO₃',
    required: [
      { symbol: 'Ca', qty: 1 },
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 2 } // Simplified
    ],
    powerup: { name: 'Calcified Castle', desc: 'A thick, solid chalk-lime barrier. Grants 160 solid Shield points.', effect: 'shield', value: 160 }
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
    powerup: { name: 'Effervescent fizz', desc: 'Soothing alkaline carbonated surge. Heals 130 HP and provides +40 Shield.', effect: 'heal', value: 135 }
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
    powerup: { name: 'Gunpowder Volley', desc: 'Detonates potassium gunpowder sparklets. Deals 155 explosive kinetic damage.', effect: 'damage', value: 155 }
  },
  {
    id: 'C2H6O',
    name: 'Ethanol (Ethyl Alcohol)',
    formula: 'C₂H₆O',
    required: [
      { symbol: 'C', qty: 2 },
      { symbol: 'H', qty: 2 }, // simplified
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Antiseptic Cleansing', desc: 'Pure chemical solvent sterilization. Heals 140 HP and clears stun.', effect: 'heal', value: 140 }
  },
  {
    id: 'KI',
    name: 'Potassium Iodide',
    formula: 'KI',
    required: [
      { symbol: 'K', qty: 1 },
      { symbol: 'I', qty: 1 }
    ],
    powerup: { name: 'Elephant Toothpaste Foam', desc: 'Extremely fast peroxide foam explosion that blinds the opponent. Stuns and deals 80 damage.', effect: 'stun', value: 80 }
  },
  {
    id: 'MgSO4',
    name: 'Magnesium Sulfate (Epsom Salt)',
    formula: 'MgSO₄',
    required: [
      { symbol: 'Mg', qty: 1 },
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 } // simplified
    ],
    powerup: { name: 'Therapeutic Soak', desc: 'Muscle relaxing alchemical mineral bath. Heals 150 HP.', effect: 'heal', value: 150 }
  },
  {
    id: 'KMnO4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    required: [
      { symbol: 'K', qty: 1 },
      { symbol: 'Mn', qty: 1 },
      { symbol: 'O', qty: 1 } // simplified
    ],
    powerup: { name: 'Deep Purple Oxidation', desc: 'Vibrant violet flash that decays organic material. Deals 135 damage.', effect: 'damage', value: 135 }
  },
  {
    id: 'H2O2',
    name: 'Hydrogen Peroxide (Sterilizer)',
    formula: 'H₂O₂',
    required: [
      { symbol: 'H', qty: 2 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Foaming Disinfection', desc: 'Active bubbling oxygen. Heals 145 HP and provides 25 Shield.', effect: 'heal', value: 145 }
  },
  {
    id: 'HF',
    name: 'Hydrofluoric Acid',
    formula: 'HF',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'F', qty: 1 }
    ],
    powerup: { name: 'Glass Etchant', desc: 'Highly corrosive, non-metal piercing fluoride stream. Deals 130 direct damage and stuns the opponent.', effect: 'stun', value: 130 }
  },
  {
    id: 'H2CO3',
    name: 'Carbonic Acid',
    formula: 'H₂CO₃',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'C', qty: 1 },
      { symbol: 'O', qty: 1 } // simplified
    ],
    powerup: { name: 'Carbonated Splash', desc: 'Sparks carbonated soda fizz. Deals 95 damage and regenerates 40 health.', effect: 'heal', value: 95 }
  },
  {
    id: 'CaO',
    name: 'Calcium Oxide (Quicklime)',
    formula: 'CaO',
    required: [
      { symbol: 'Ca', qty: 1 },
      { symbol: 'O', qty: 1 }
    ],
    powerup: { name: 'Exothermic Lime Slurry', desc: 'Violently boils upon water contact. Deals 110 thermal damage.', effect: 'damage', value: 110 }
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
    powerup: { name: 'Chlorine Disinfectant', desc: 'Pungent chlorine wash that clears all buffs and inflicts 120 damage.', effect: 'damage', value: 120 }
  },
  {
    id: 'H3PO4',
    name: 'Phosphoric Acid',
    formula: 'H₃PO₄',
    required: [
      { symbol: 'P', qty: 1 },
      { symbol: 'O', qty: 2 } // simplified
    ],
    powerup: { name: 'Acidic Rust Remover', desc: 'Concentrated phosphor acid jet. Corrodes 60 Shield and deals 100 damage.', effect: 'damage', value: 100 }
  },
  {
    id: 'SO2',
    name: 'Sulfur Dioxide Gas',
    formula: 'SO₂',
    required: [
      { symbol: 'S', qty: 1 },
      { symbol: 'O', qty: 2 }
    ],
    powerup: { name: 'Volcanic Smog', desc: 'Suffocating dense volcanic smog. Deals 115 damage and stuns for 1 turn.', effect: 'stun', value: 115 }
  },
  {
    id: 'HNO3',
    name: 'Nitric Acid',
    formula: 'HNO₃',
    required: [
      { symbol: 'H', qty: 1 },
      { symbol: 'N', qty: 1 },
      { symbol: 'O', qty: 2 } // simplified
    ],
    powerup: { name: 'Gold Dissolving Aqua', desc: 'Corrosive laboratory oxidizer that bypasses shields to deal 135 raw damage.', effect: 'damage', value: 135 }
  },
  {
    id: 'FeS2',
    name: 'Iron Pyrite (Fools Gold)',
    formula: 'FeS₂',
    required: [
      { symbol: 'Fe', qty: 1 },
      { symbol: 'S', qty: 2 }
    ],
    powerup: { name: 'Sparking Pyrite Slag', desc: 'Glistening brass-yellow crystal strike. Deals 100 damage and shields 50 HP.', effect: 'shield', value: 100 }
  },
  {
    id: 'AuCl3',
    name: 'Gold Trichloride',
    formula: 'AuCl₃',
    required: [
      { symbol: 'Au', qty: 1 },
      { symbol: 'Cl', qty: 2 } // simplified
    ],
    powerup: { name: 'Aurum Auric Strike', desc: 'Precious heavy metal catalyst. Deals 145 devastating impact damage.', effect: 'damage', value: 145 }
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
      // Alkali metals: highly reactive, violently combustible with water or acidic halogens!
      // Forms salts and metal hydroxides
      if (num % 2 === 0) {
        name = `${el.name} Hydroxide`;
        formula = `${sym}OH`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 }, { symbol: 'H', qty: 1 });
        powerupName = `${sym}-Base Corrosion`;
        powerupDesc = `Strong caustic alkali base solution. Dissolves organic armor dealing 115 damage.`;
        powerupValue = 115;
      } else {
        name = `${el.name} Chloride`;
        formula = `${sym}Cl`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 1 });
        powerupName = `${sym}-Ionic Blast`;
        powerupDesc = `Unstable alkali metal halide. Crushes defense, dealing 110 burst damage and healing 20 HP.`;
        powerupValue = 110;
        powerupEffect = 'damage';
      }
    } else if (cat === 'alkaline') {
      // Alkaline earth metals: forms brilliant oxide shields and halide salts!
      if (num % 2 === 0) {
        name = `${el.name} Oxide`;
        formula = `${sym}O`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
        powerupName = `${sym}-Thermal Flare`;
        powerupDesc = `Extremely thermal magnesium-style oxide flash. Grants 110 Shield and deals 40 damage.`;
        powerupEffect = 'shield';
        powerupValue = 110;
      } else {
        name = `${el.name} Chloride`;
        formula = `${sym}Cl₂`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 2 });
        powerupName = `${sym}-Saline Wave`;
        powerupDesc = `Bouncy alkaline salt splash. Deals 110 splash damage.`;
        powerupValue = 110;
      }
    } else if (cat === 'halogen') {
      // Halogens: super reactive, forms volatile haloacids and salts!
      name = `Hydrogen ${el.name === 'Astatine' ? 'Astatide' : el.name === 'Tennessine' ? 'Tennesside' : el.name.replace(/ine$/, 'ide')}`;
      formula = `H${sym}`;
      required.push({ symbol: 'H', qty: 1 }, { symbol: sym, qty: 1 });
      powerupName = `${sym}-Halogen Acid`;
      powerupDesc = `Volatile haloacid spray. Deals 120 caustic damage and corrodes shielding.`;
      powerupValue = 120;
    } else if (cat === 'metalloid') {
      // Metalloid: forms covalent oxide glass shields
      name = `${el.name} Dioxide`;
      formula = `${sym}O₂`;
      required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 2 });
      powerupName = `${sym}-Glass Barrier`;
      powerupDesc = `High-durability semi-conductive metalloid glass. Generates 130 Shield.`;
      powerupEffect = 'shield';
      powerupValue = 130;
    } else if (cat === 'nonmetal') {
      // Nonmetals: forms oxides or hydrides
      if (num === 7) { // Nitrogen already covered in NH3, or let's make diatomic Nitrogen N2!
        name = 'Diatomic Nitrogen Gas';
        formula = 'N₂';
        required.push({ symbol: 'N', qty: 2 });
        powerupName = 'Cryogenic Deep Freeze';
        powerupDesc = 'Pours liquid nitrogen spray. Stuns the target for 1 turn.';
        powerupEffect = 'stun';
        powerupValue = 1;
      } else {
        name = `${el.name} Hydride`;
        formula = `${sym}H₄`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'H', qty: 2 }); // Simplified
        powerupName = `${sym}-Covalent Burst`;
        powerupDesc = `Volatile organic hydride combusts, dealing 110 damage.`;
        powerupValue = 110;
      }
    } else {
      // Transition metals, Lanthanides, and Actinides: Forms versatile metallic salts & oxides!
      if (num >= 89 && num <= 103) {
        // Actinides: highly radioactive!
        name = `${el.name} Oxide Catalyst`;
        formula = `${sym}O₂`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 2 });
        powerupName = `${sym}-Rad Fission`;
        powerupDesc = `Heavy radioactive actinide disintegration. Deals 145 raw cosmic fission damage.`;
        powerupValue = 145;
      } else if (num >= 57 && num <= 71) {
        // Lanthanides: rare earths!
        name = `${el.name} Oxide glass`;
        formula = `${sym}₂O₃`;
        required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 }); // Simplified
        powerupName = `${sym}-Phosphor Shield`;
        powerupDesc = `Luminescent rare earth oxide barrier. Repairs cells to heal 100 HP and adds 40 Shield.`;
        powerupEffect = 'heal';
        powerupValue = 100;
      } else {
        // General Transition metals (Fe, Cu, Zn, Ag, Au, Pt, Ti, etc.)
        if (num % 3 === 0) {
          name = `${el.name} Chloride compound`;
          formula = `${sym}Cl₂`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'Cl', qty: 1 }); // Simplified
          powerupName = `${sym}-Spark Sparks`;
          powerupDesc = `Metal halide salt sparks. Deals 110 impact damage.`;
          powerupValue = 110;
        } else if (num % 3 === 1) {
          name = `${el.name} Oxide film`;
          formula = `${sym}O`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 });
          powerupName = `${sym}-Passivation Shield`;
          powerupDesc = `Oxidized metallic passivation crust. Grants a dense 120 HP shield.`;
          powerupEffect = 'shield';
          powerupValue = 120;
        } else {
          name = `${el.name} Sulfate crystal`;
          formula = `${sym}SO₄`;
          required.push({ symbol: sym, qty: 1 }, { symbol: 'O', qty: 1 }); // Simplified with Oxygen for draft feasibility
          powerupName = `${sym}-Catalytic Flash`;
          powerupDesc = `Sulfate metallic catalyst enhances cells. Heals 120 HP.`;
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
    
    let name = `Pure Elemental ${el.name}`;
    let formula = sym;
    let powerupName = `${sym}-Atomic Overdrive`;
    let powerupDesc = `Gorgeously aligned dense molecular crystal of ${el.name}. Fires a coherent energy wave for ${80 + (num % 30)} damage.`;
    let effect: 'damage' | 'heal' | 'shield' | 'stun' | 'evade' = 'damage';
    let value = 80 + (num % 30);

    if (cat === 'noble') {
      name = `Monatomic ${el.name} Gas`;
      formula = sym;
      powerupName = `${el.name} Auroral Flash`;
      powerupDesc = `High-energy excited plasma of noble ${el.name}. Discharges solar photons, curing stuns and healing 100 HP.`;
      effect = 'heal';
      value = 100;
    } else if (['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'].includes(sym)) {
      name = `Diatomic ${el.name} Gas`;
      formula = `${sym}₂`;
      powerupName = `${el.name} Halogen Blast`;
      powerupDesc = `High-affinity diatomic ${el.name} covalent molecules release energy. Deals ${90 + (num % 15)} damage.`;
    } else if (sym === 'C') {
      name = `Allotropic Carbon Crystal`;
      formula = `C`;
      powerupName = `Diamond Lattice Strike`;
      powerupDesc = `Indestructible covalent carbon diamond armor. Deals 110 damage and adds 40 Shield.`;
      value = 110;
    } else if (sym === 'S') {
      name = `Octasulfur Ring`;
      formula = `S₈`;
      powerupName = `Chalcogen Volatility`;
      powerupDesc = `Fused yellow octasulfur rings combust rapidly. Deals 120 corrosive fire damage.`;
      value = 120;
    } else if (sym === 'P') {
      name = `Tetraphosphorus Molecule`;
      formula = `P₄`;
      powerupName = `Allotropic Flame`;
      powerupDesc = `Highly reactive white phosphorus tetramers ignite on air. Stuns target and deals 80 damage.`;
      effect = 'stun';
      value = 80;
    } else if (cat === 'metalloid') {
      name = `Crystalline ${el.name} Metalloid`;
      formula = sym;
      powerupName = `${sym}-Semiconductor Wave`;
      powerupDesc = `Tuned metalloid crystal regulates energy. Grants a solid 110 HP shield.`;
      effect = 'shield';
      value = 110;
    } else if (cat === 'alkali') {
      name = `Solid ${el.name} Metallic Core`;
      formula = sym;
      powerupName = `${sym}-Exothermic Fission`;
      powerupDesc = `Soft alkali metal lattice reacts with atmospheric moisture. Deals 110 explosive damage.`;
    } else if (cat === 'alkaline') {
      name = `Solid ${el.name} Metal Shield`;
      formula = sym;
      powerupName = `${sym}-Alkaline Defense`;
      powerupDesc = `Light alkaline earth metal passivation layer. Grants 120 Shield.`;
      effect = 'shield';
      value = 120;
    } else {
      name = `Solid ${el.name} Metallic Lattice`;
      formula = sym;
      powerupName = `${sym}-Alloy Impact`;
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
