import { supabase } from '../lib/supabase';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Users, Shield, Zap, Sparkles, BookOpen, TriangleAlert as AlertTriangle, RefreshCw, Check, X, Circle as HelpCircle, Flame, Droplet, Wind, Sword, Trophy, Play, MessageSquare, Award, User, Crown, Send, Dices, Lock } from 'lucide-react';
import audio from '../utils/audio';
import { generateAllCompounds } from '../data/compoundsData';
import { MultiplayerLobby } from './MultiplayerLobby';
import type { RoomMode, RoomPlayer } from '../lib/multiplayer';

interface TurnedTablesProps {
  onBack: () => void;
  onAddStars: (amount: number) => void;
  stars: number;
  level: number;
  userId?: string;
}

// Full-featured Type Definitions
interface ElementCard {
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

interface Player {
  id: 1 | 2;
  name: string;
  hp: number;
  shield: number;
  deck: ElementCard[];
  compounds: string[]; // list of synthesized compound IDs
  score: number;
  isBot?: boolean;
}

interface CompoundRecipe {
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

// Accurate Periodic Positions & Scientific Powers for All 118 Periodic Elements
// Compact array representation of all 118 elements to minimize bundle footprint
const RAW_ELEMENTS: Array<[number, string, string, number, number, 'noble' | 'halogen' | 'alkali' | 'alkaline' | 'transition' | 'metalloid' | 'nonmetal', string]> = [
  [1, 'H', 'Hydrogen', 1, 1, 'nonmetal', 'The lightest and most abundant element, forming star fuel and body water.'],
  [2, 'He', 'Helium', 1, 18, 'noble', 'Unreactive noble gas that floats balloons and makes voices super squeaky.'],
  [3, 'Li', 'Lithium', 2, 1, 'alkali', 'Ultra-light solid metal, powering modern rechargeable batteries in phones.'],
  [4, 'Be', 'Beryllium', 2, 2, 'alkaline', 'Tough light metal used in aerospace, missile guidance, and precious emeralds.'],
  [5, 'B', 'Boron', 2, 13, 'metalloid', 'Hard mineral used in heat-resistant borosilicate lab glassware and eyewash.'],
  [6, 'C', 'Carbon', 2, 14, 'nonmetal', 'Organic atomic backbone of life, making up diamonds, graphite, and coal.'],
  [7, 'N', 'Nitrogen', 2, 15, 'nonmetal', 'Makes up 78% of air, used in liquid form for instant cryogenic freezing.'],
  [8, 'O', 'Oxygen', 2, 16, 'nonmetal', 'Highly reactive gas essential for human breathing and aerobic combustion.'],
  [9, 'F', 'Fluorine', 2, 17, 'halogen', 'Super reactive halogen gas used in toothpaste to make teeth enamel stronger.'],
  [10, 'Ne', 'Neon', 2, 18, 'noble', 'Glows vibrant reddish-orange when high-voltage electricity passes through it.'],
  [11, 'Na', 'Sodium', 3, 1, 'alkali', 'Soft explosive alkali metal that forms table salt when combined with Chlorine.'],
  [12, 'Mg', 'Magnesium', 3, 2, 'alkaline', 'Burns with a blinding white light, used in distress flares and sparklers.'],
  [13, 'Al', 'Aluminum', 3, 13, 'transition', 'Lightweight, rust-free metal used for soda beverage cans and aerospace foils.'],
  [14, 'Si', 'Silicon', 3, 14, 'metalloid', 'Semiconductor backbone powering microchips, transistors, and sandy beaches.'],
  [15, 'P', 'Phosphorus', 3, 15, 'nonmetal', 'Highly reactive non-metal, found on the friction-strike tips of matchsticks.'],
  [16, 'S', 'Sulfur', 3, 16, 'nonmetal', 'Pungent bright yellow mineral common in volcanoes that smells like rotten eggs.'],
  [17, 'Cl', 'Chlorine', 3, 17, 'halogen', 'Corrosive greenish-yellow gas used to disinfect municipal drinking water.'],
  [18, 'Ar', 'Argon', 3, 18, 'noble', 'Inert noble gas used to fill light bulbs and defend historical documents.'],
  [19, 'K', 'Potassium', 4, 1, 'alkali', 'Violently reactive alkali metal abundant in yellow bananas and soil fertilizers.'],
  [20, 'Ca', 'Calcium', 4, 2, 'alkaline', 'Essential alkaline-earth metal for scaling strong bones, teeth, and chalk.'],
  [21, 'Sc', 'Scandium', 4, 3, 'transition', 'Rare metal compound added to produce high-strength sport equipment alloys.'],
  [22, 'Ti', 'Titanium', 4, 4, 'transition', 'High-strength transition metal of aerospace, titanium implants, and spacecraft.'],
  [23, 'V', 'Vanadium', 4, 5, 'transition', 'Extremely hard metal used to forge heavy-duty industrial vanadium steel alloys.'],
  [24, 'Cr', 'Chromium', 4, 6, 'transition', 'Lustrous, corrosion-resistant coating used on automobile bumpers and rims.'],
  [25, 'Mn', 'Manganese', 4, 7, 'transition', 'Vital steel additive that facilitates heavy structural rail track manufacturing.'],
  [26, 'Fe', 'Iron', 4, 8, 'transition', 'Magnetic foundation of heavy steel, rust, and oxygen transport in blood.'],
  [27, 'Co', 'Cobalt', 4, 9, 'transition', 'Lustrous blue metal used in jet turbine alloys and rechargeable batteries.'],
  [28, 'Ni', 'Nickel', 4, 10, 'transition', 'Resistant metal used extensively for guitar strings, coinage, and plating.'],
  [29, 'Cu', 'Copper', 4, 11, 'transition', 'Reddish-orange metallic conductor ideal for household electricity wiring.'],
  [30, 'Zn', 'Zinc', 4, 12, 'transition', 'Coats raw steel to halt rusting, and plays a vital role in immune health.'],
  [31, 'Ga', 'Gallium', 4, 13, 'transition', 'Amazing post-transition metal that melts into a liquid pool in your hand.'],
  [32, 'Ge', 'Germanium', 4, 14, 'metalloid', 'Semiconductor mineral crucial for fiber optic systems and night-vision optics.'],
  [33, 'As', 'Arsenic', 4, 15, 'metalloid', 'Metalloid famous for historic toxicity, once used as an invisible poison.'],
  [34, 'Se', 'Selenium', 4, 16, 'nonmetal', 'Photoconductive element used in solar panels and light-sensor photocells.'],
  [35, 'Br', 'Bromine', 4, 17, 'halogen', 'The only non-metallic element that stays liquid at room temperatures.'],
  [36, 'Kr', 'Krypton', 4, 18, 'noble', 'Gases used in energy-saving neon lights, searchlights, and flash tools.'],
  [37, 'Rb', 'Rubidium', 5, 1, 'alkali', 'Highly reactive alkali metal that immediately ignites on contact with air.'],
  [38, 'Sr', 'Strontium', 5, 2, 'alkaline', 'Heavy alkaline earth metal used to color fireworks with crimson red explosions.'],
  [39, 'Y', 'Yttrium', 5, 3, 'transition', 'Rare metal utilized to make red color phosphors and high-strength lasers.'],
  [40, 'Zr', 'Zirconium', 5, 4, 'transition', 'Corrosion-proof transition metal used as structural clads in nuclear reactors.'],
  [41, 'Nb', 'Niobium', 5, 5, 'transition', 'Superconducting element used to build high-power MRI scanner electromagnets.'],
  [42, 'Mo', 'Molybdenum', 5, 6, 'transition', 'Incredibly high-melting metal preferred for armor plates and drills.'],
  [43, 'Tc', 'Technetium', 5, 7, 'transition', 'The first synthetic element, highly radioactive and valued for medical scans.'],
  [44, 'Ru', 'Ruthenium', 5, 8, 'transition', 'Hard platinum group metal used to make highly durable electrical contacts.'],
  [45, 'Rh', 'Rhodium', 5, 9, 'transition', 'One of the rarest, most expensive precious metals, used in catalytic converters.'],
  [46, 'Pd', 'Palladium', 5, 10, 'transition', 'Absorbs massive amounts of hydrogen gas, crucial in green hydrogen energy.'],
  [47, 'Ag', 'Silver', 5, 11, 'transition', 'Classic precious metal holding the highest electrical status of any element.'],
  [48, 'Cd', 'Cadmium', 5, 12, 'transition', 'Tough metal historical in yellow pigments and older rechargeable cells.'],
  [49, 'In', 'Indium', 5, 13, 'transition', 'Extremely soft metal essential to manufacture touchscreens and LCD displays.'],
  [50, 'Sn', 'Tin', 5, 14, 'transition', 'Corrosion blocker plated onto steel food cans and utilized in soldering.'],
  [51, 'Sb', 'Antimony', 5, 15, 'metalloid', 'Dark toxic metalloid used to harden lead bullets and as a flame retardant.'],
  [52, 'Te', 'Tellurium', 5, 16, 'metalloid', 'Rare metalloid added to make highly efficient thin-film solar energy cells.'],
  [53, 'I', 'Iodine', 5, 17, 'halogen', 'Dark purple disinfectant used widely to sanitize cuts and promote thyroid health.'],
  [54, 'Xe', 'Xenon', 5, 18, 'noble', 'Heavy noble gas used inside high-intensity camera flashes and spacecraft ion engines.'],
  [55, 'Cs', 'Cesium', 6, 1, 'alkali', 'Extreme alkali metal that defines the exact, hyper-precise second in atomic clocks.'],
  [56, 'Ba', 'Barium', 6, 2, 'alkaline', 'Heavy metal element consumed in barium shakes to outline internal organs under X-rays.'],
  
  // Lanthanides Group (Mapped to custom Period 8, groups 4 to 18 for beautiful layout)
  [57, 'La', 'Lanthanum', 8, 4, 'transition', 'Eponymous lanthanide rare metal added to expand high-end telescope lenses.'],
  [58, 'Ce', 'Cerium', 8, 5, 'transition', 'Highly active rare-earth metal used as sparking flints in hand pocket lighters.'],
  [59, 'Pr', 'Praseodymium', 8, 6, 'transition', 'Alloyed with neodymium to yield super-intense protective goggles for glassmakers.'],
  [60, 'Nd', 'Neodymium', 8, 7, 'transition', 'Strong magnetic material used to make super-powerful modern permanent magnets.'],
  [61, 'Pm', 'Promethium', 8, 8, 'transition', 'Unstable radio-isotope utilized as clean energy glowing paints in space gadgets.'],
  [62, 'Sm', 'Samarium', 8, 9, 'transition', 'Highly stable magnetic metal resistant to demagnetization at high temperatures.'],
  [63, 'Eu', 'Europium', 8, 10, 'transition', 'Highly reactive element that glows bright red inside Euro cash security marks.'],
  [64, 'Gd', 'Gadolinium', 8, 11, 'transition', 'Intense magnetic metal used as a medical MRI contrast fluid agent.'],
  [65, 'Tb', 'Terbium', 8, 12, 'transition', 'Phosphorescent metal used to light up green-glowing solid state screens.'],
  [66, 'Dy', 'Dysprosium', 8, 13, 'transition', 'Absorbs neutrons easily without swelling, stabilizing nuclear reactor rods.'],
  [67, 'Ho', 'Holmium', 8, 14, 'transition', 'Contains unique magnetic strength used to construct high-focus laser scalpel gears.'],
  [68, 'Er', 'Erbium', 8, 15, 'transition', 'Amplifier compound infused in high-speed undersea fiber optic data channels.'],
  [69, 'Tm', 'Thulium', 8, 16, 'transition', 'One of the rarest elements, used in compact radar emitters and lasers.'],
  [70, 'Yb', 'Ytterbium', 8, 17, 'transition', 'High-strength alloy additive, historically utilized to monitor earthquake stress.'],
  [71, 'Lu', 'Lutetium', 8, 18, 'transition', 'Heavy rare earth element used in advanced, high-targeted cancer therapies.'],
  
  // Period 6 Main Group continued after Lanthanum series
  [72, 'Hf', 'Hafnium', 6, 4, 'transition', 'Heavy neutron sponge material used safely inside nuclear submarine controls.'],
  [73, 'Ta', 'Tantalum', 6, 5, 'transition', 'Extremely chemical-proof metal prized for miniature micro-capacitors in devices.'],
  [74, 'W', 'Tungsten', 6, 6, 'transition', 'Contains the supreme melting point among metals, forming rocket exhausts and weld tips.'],
  [75, 'Re', 'Rhenium', 6, 7, 'transition', 'Provides super-alloys resisting metal fatigue inside airplane jet motor fans.'],
  [76, 'Os', 'Osmium', 6, 8, 'transition', 'The densest element in existence, once used inside vintage record player needles.'],
  [77, 'Ir', 'Iridium', 6, 9, 'transition', 'Extremely resilient precious metal associated with meteorite dust layer.'],
  [78, 'Pt', 'Platinum', 6, 10, 'transition', 'Precious, non-corrosive industrial catalyst crucial in emissions control and jewelry.'],
  [79, 'Au', 'Gold', 6, 11, 'transition', 'Malleable, gorgeous, indestructible alchemical element revered as timeless treasure.'],
  [80, 'Hg', 'Mercury', 6, 12, 'transition', 'Silvery heavy metal that surprisingly remains liquid under standard room environments.'],
  [81, 'Tl', 'Thallium', 6, 13, 'transition', 'Soft blue-gray metal historic for toxic hazard, once known as the "poisoner\'s poison."'],
  [82, 'Pb', 'Lead', 6, 14, 'transition', 'Dense gray metal historically used in plumber lines, battery cells, and radiation seals.'],
  [83, 'Bi', 'Bismuth', 6, 15, 'transition', 'Forms dazzling iridescent stair-step crystals, and treats stomach burns.'],
  [84, 'Po', 'Polonium', 6, 16, 'metalloid', 'Highly radioactive and lethal heat emitter, famously discovered by Marie Curie.'],
  [85, 'At', 'Astatine', 6, 17, 'halogen', 'The scarcest naturally formed solid halogen on Earth, intensely radioactive.'],
  [86, 'Rn', 'Radon', 6, 18, 'noble', 'Dense radioactive noble gas, which can seep from underground bedrock foundations.'],
  
  // Period 7 Alkaline & Alkali
  [87, 'Fr', 'Francium', 7, 1, 'alkali', 'Intensely unstable alkali metal, second rarest element found in Earth\'s crust.'],
  [88, 'Ra', 'Radium', 7, 2, 'alkaline', 'Glow-in-the-dark radioactive element historic in aviation dials and medical treatments.'],
  
  // Actinides Group (Mapped to custom Period 9, groups 4 to 18 for beautiful layout)
  [89, 'Ac', 'Actinium', 9, 4, 'transition', 'Glows with an eerie blue radioactive light/energy, launching the actinide series.'],
  [90, 'Th', 'Thorium', 9, 5, 'transition', 'Promising safe nuclear fuel candidate that is much harder to weaponize than Uranium.'],
  [91, 'Pa', 'Protactinium', 9, 6, 'transition', 'Super radioactive, dense element that forms as a decay phase of uranium.'],
  [92, 'U', 'Uranium', 9, 7, 'transition', 'Extreme weight core element utilized as the primary fuel source in nuclear reactors.'],
  [93, 'Np', 'Neptunium', 9, 8, 'transition', 'Highly radioactive synthetic metal used in advanced physics research neutron detectors.'],
  [94, 'Pu', 'Plutonium', 9, 9, 'transition', 'Fissile artificial heavy element crucial in space-probe batteries and early atomic tech.'],
  [95, 'Am', 'Americium', 9, 10, 'transition', 'Synthetic trace emitter inside home fire smoke alarms that guides safety sensors.'],
  [96, 'Cm', 'Curium', 9, 11, 'transition', 'Alpha particle bombarding metal used inside interplanetary Mars rover roentgen cameras.'],
  [97, 'Bk', 'Berkelium', 9, 12, 'transition', 'Radioactive custom element synthesized in Berkeley, California labs.'],
  [98, 'Cf', 'Californium', 9, 13, 'transition', 'Powerful nuclear-grade neutron launcher used to verify structural layers and discover oil.'],
  [99, 'Es', 'Einsteinium', 9, 14, 'transition', 'Formed during the world\'s first hydrogen bomb blast, honoring Albert Einstein.'],
  [100, 'Fm', 'Fermium', 9, 15, 'transition', 'Synthetic radioactive heavy element birthed in nuclear blasts, honoring Enrico Fermi.'],
  [101, 'Md', 'Mendelevium', 9, 16, 'transition', 'Synthesized metal element named in permanent homage to creator Dmitry Mendeleev.'],
  [102, 'No', 'Nobelium', 9, 17, 'transition', 'Super heavy synthetic transition metal honoring dynamic inventor Alfred Nobel.'],
  [103, 'Lr', 'Lawrencium', 9, 18, 'transition', 'Highly radioactive artificial metal honoring cyclotron inventor Ernest Lawrence.'],
  
  // Period 7 Main Group continued after Actinium series
  [104, 'Rf', 'Rutherfordium', 7, 4, 'transition', 'Fast-decaying synthetic heavy metal element named in honor of Ernest Rutherford.'],
  [105, 'Db', 'Dubnium', 7, 5, 'transition', 'Synthetic heavy element named in permanent honor of Dubna Research Facility in Russia.'],
  [106, 'Sg', 'Seaborgium', 7, 6, 'transition', 'Synthetic element named for Glenn Seaborg while he was still alive to celebrate it.'],
  [107, 'Bh', 'Bohrium', 7, 7, 'transition', 'Synthetic element named in permanent tribute to quantum father Niels Bohr.'],
  [108, 'Hs', 'Hassium', 7, 8, 'transition', 'Synthetic heavy element named for Hesse (Germany) where it was first produced.'],
  [109, 'Mt', 'Meitnerium', 7, 9, 'transition', 'Heavy artificial metal element named to honor nuclear fission pioneer Lise Meitner.'],
  [110, 'Ds', 'Darmstadtium', 7, 10, 'transition', 'Heavy radioactive synthetic metal element first made in Darmstadt, Germany.'],
  [111, 'Rg', 'Roentgenium', 7, 11, 'transition', 'Superheavy synthetic element named in honor of X-ray father Wilhelm Röntgen.'],
  [112, 'Cn', 'Copernicium', 7, 12, 'transition', 'Artificial radioactive metal named in honor of revolutionary astronomer Nicolaus Copernicus.'],
  [113, 'Nh', 'Nihonium', 7, 13, 'transition', 'Highly unstable synthetic radioactive chemical compound, named in honor of Japan ("Nihon").'],
  [114, 'Fl', 'Flerovium', 7, 14, 'transition', 'Fissile heavy element named in permanent memory of radioactive pioneer Georgy Flerov.'],
  [115, 'Mc', 'Moscovium', 7, 15, 'transition', 'Highly radioactive artificial heavy element named in honor of Moscow state.'],
  [116, 'Lv', 'Livermorium', 7, 16, 'transition', 'Synthetic heavy metal element named to appreciate Lawrence Livermore National Lab.'],
  [117, 'Ts', 'Tennessine', 7, 17, 'halogen', 'Superheavy halogen first recognized through collaborations in Oak Ridge, Tennessee.'],
  [118, 'Og', 'Oganesson', 7, 18, 'noble', 'The superheavy noble gas concluding Row 7, honoring Russian expert Yuri Oganessian.']
];

// Helper to generate dynamic compatible powerups
const getPowerupForCategory = (symbol: string, category: string, number: number) => {
  const value = 20 + (number % 5) * 10;
  switch (category) {
    case 'noble':
      return { name: `${symbol}-Gas Shield`, desc: `Creates an unreactive ${value} HP atmospheric shield`, effect: 'shield' as const, value };
    case 'halogen':
      return { name: `${symbol}-Acid Burn`, desc: `Splashes toxic gas deals ${value + 20} corrosive damage`, effect: 'damage' as const, value: value + 20 };
    case 'alkali':
      return { name: `${symbol}-Ionics Blast`, desc: `Ignites with water dealing ${value + 30} burst damage`, effect: 'damage' as const, value: value + 30 };
    case 'alkaline':
      return { name: `${symbol}-Cellular Fortify`, desc: `Absorbs energy with a ${value + 15} HP shield`, effect: 'shield' as const, value: value + 15 };
    case 'transition':
      if (number % 3 === 0) {
        return { name: `${symbol}-Alloy Wall`, desc: `Absorbs incoming energy with ${value + 10} Shield`, effect: 'shield' as const, value: value + 10 };
      } else if (number % 3 === 1) {
        return { name: `${symbol}-Metallic Impact`, desc: `Strikes dealing ${value + 15} impact damage`, effect: 'damage' as const, value: value + 15 };
      } else {
        return { name: `${symbol}-Catalytic Restor`, desc: `Restores cell structures healing ${value + 20} HP`, effect: 'heal' as const, value: value + 20 };
      }
    case 'metalloid':
      return { name: `${symbol}-Quantum Conduct`, desc: `Manipulates semiconductors to heal ${value + 10} HP`, effect: 'heal' as const, value: value + 10 };
    case 'nonmetal':
    default:
      if (number === 7) {
         return { name: 'Cryo-Freeze', desc: 'Stuns the target for 1 turn', effect: 'stun' as const, value: 1 };
      }
      return { name: `${symbol}-Organic Vitalize`, desc: `Synthesizes nutrients to heal ${value + 15} HP`, effect: 'heal' as const, value: value + 15 };
  }
};

// Map raw array of 118 items into full ElementCard specifications!
const ELEMENTS_DB: ElementCard[] = RAW_ELEMENTS.map(([num, sym, nam, p, g, cat, clue]) => ({
  number: num,
  symbol: sym,
  name: nam,
  period: p,
  group: g,
  category: cat,
  powerup: getPowerupForCategory(sym, cat, num),
  clue: clue
}));

const COMPOUND_RECIPES: CompoundRecipe[] = generateAllCompounds(ELEMENTS_DB as any) as any;

const GAME_THEMED_NAMES = [
  "Alkali Alchemist", "Proton Prime", "Oxide Overlord", "Quantum Quirk", 
  "Electron Emperor", "Kinetic Kid", "Radical Reactor", "Cobalt Commander", 
  "Halogen Hydroid", "Neon Knight", "Helium Hero", "Bismuth Baron", 
  "Titanium Titan", "Carbon Catalyst", "Sodium Striker", "Aurora Atom", 
  "Fermi Force", "Spectral Alchemist", "Ion Intruder", "Valence Vanguard",
  "Isotope Invader", "Planck Paladin", "Tesla Tracker", "Dalton Defender"
];

const generateRandomThemedName = () => {
  const prefixes = [
    "Quantum", "Alkali", "Atomic", "Valence", "Kinetic", "Isotopic", 
    "Neutron", "Molecular", "Catalytic", "Gaseous", "Ionic", "Halogen", 
    "Thermal", "Covalent", "Subatomic", "Spectral", "Reactive", "Magnetic", 
    "Periodic", "Organic", "Luminescent", "Aerobic", "Synthesized", "Metallic", "Anhydrous"
  ];
  const suffixes = [
    "Alchemist", "Catalyst", "Reactor", "Proton", "Electron", "Isotope", 
    "Molecule", "Polymer", "Titanium", "Silicon", "Radical", "Spectra", 
    "Vanguard", "Pioneer", "Crucible", "Fission", "Fusion", "Entropy", 
    "Synthesizer", "Anion", "Cation", "Chamber", "Element", "Noble"
  ];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${p} ${s}`;
};

<button
  onClick={async () => {
    await supabase.auth.signOut();
  }}
  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
>
  Logout
</button>

const GAME_AVATARS = [
  { emoji: '🧪', name: 'Alchemist', color: 'from-cyan-500 to-blue-500 bg-cyan-100 hover:bg-cyan-200 text-cyan-600' },
  { emoji: '⚡', name: 'Plasma', color: 'from-amber-400 to-orange-500 bg-amber-100 hover:bg-amber-200 text-amber-600' },
  { emoji: '⚛️', name: 'Nucleus', color: 'from-purple-500 to-indigo-600 bg-purple-100 hover:bg-purple-200 text-purple-600' },
  { emoji: '🧬', name: 'Helix', color: 'from-emerald-400 to-teal-600 bg-emerald-100 hover:bg-emerald-200 text-emerald-600' },
  { emoji: '🔥', name: 'Catalyst', color: 'from-red-500 to-pink-500 bg-red-100 hover:bg-red-200 text-red-600' },
  { emoji: '🪐', name: 'Cosmos', color: 'from-slate-700 to-slate-900 bg-slate-150 hover:bg-slate-200 text-slate-700' },
  { emoji: '🔮', name: 'Ether', color: 'from-violet-500 to-fuchsia-600 bg-violet-100 hover:bg-violet-200 text-violet-600' },
  { emoji: '🛡️', name: 'Isotope', color: 'from-sky-400 to-cyan-600 bg-sky-100 hover:bg-sky-200 text-sky-600' }
];

const SKINS_INFO: Record<string, { label: string; bgClass: string; borderClass: string; textClass: string; levelReq: number; desc: string; rarity: 'Common' | 'Rare' | 'Legendary' }> = {
  spectral_cyan: { label: 'Spectral Cyan', bgClass: 'bg-gradient-to-br from-cyan-500 to-blue-600', borderClass: 'border-cyan-400', textClass: 'text-cyan-100', levelReq: 1, desc: 'Your standard neon lab suit equipped with high-energy quantum filters.', rarity: 'Common' },
  solid_slate: { label: 'Solid Slate', bgClass: 'bg-gradient-to-br from-slate-600 to-zinc-800', borderClass: 'border-slate-500', textClass: 'text-slate-200', levelReq: 1, desc: 'Polished industrial carbon-fiber safety armor.', rarity: 'Common' },
  radiant_radium: { label: 'Radiant Radium', bgClass: 'bg-gradient-to-br from-lime-500 to-emerald-700', borderClass: 'border-lime-400 shadow-md shadow-lime-200/50', textClass: 'text-lime-100', levelReq: 2, desc: 'Infused with luminescent Radium salt fields. Glows in high radiation zones.', rarity: 'Rare' },
  neon_cyber: { label: 'Neon Cyber', bgClass: 'bg-gradient-to-br from-fuchsia-500 to-purple-800', borderClass: 'border-fuchsia-400 shadow-lg shadow-fuchsia-200/50', textClass: 'text-fuchsia-100', levelReq: 3, desc: 'Cybernetic neon circuits pulse representing electrons moving at light speed.', rarity: 'Rare' },
  quantum_aurora: { label: 'Quantum Aurora', bgClass: 'bg-gradient-to-br from-teal-400 via-indigo-600 to-purple-900', borderClass: 'border-teal-300 shadow-xl shadow-teal-200/60 animate-pulse', textClass: 'text-teal-100', levelReq: 4, desc: 'Legendary dynamic auroral coating replicating solar gas spectrum fluxes.', rarity: 'Legendary' },
  gold_alchemist: { label: 'Gold Alchemist', bgClass: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600', borderClass: 'border-yellow-300 shadow-2xl shadow-yellow-200/70', textClass: 'text-yellow-105', levelReq: 5, desc: 'Legendary ultimate transmutation composite. Emits stellar atomic brilliance.', rarity: 'Legendary' }
};

// --- GAME BADGES DICTIONARY ---
interface GameBadge {
  id: string;
  name: string;
  desc: string;
  emoji: string;
  gradient: string;
  border: string;
  text: string;
  unlockDesc: string;
}

const ALL_GAME_BADGES: Record<string, GameBadge> = {
  proton_pioneer: {
    id: 'proton_pioneer',
    name: 'Proton Pioneer',
    desc: 'Explorer taking first steps in atomic molecular chambers.',
    emoji: '⚛️',
    gradient: 'from-blue-600 via-indigo-700 to-slate-900',
    border: 'border-blue-400/60 shadow-blue-500/30',
    text: 'text-blue-100',
    unlockDesc: 'Default Starting Badge'
  },
  elemental_overlord: {
    id: 'elemental_overlord',
    name: 'Elemental Overlord',
    desc: 'Mastered element acquisitions and atomic collection.',
    emoji: '🔮',
    gradient: 'from-cyan-500 via-sky-600 to-blue-800',
    border: 'border-cyan-400/60 shadow-cyan-500/35',
    text: 'text-cyan-50',
    unlockDesc: 'Unlock at 100 XP milestone'
  },
  molecular_marvel: {
    id: 'molecular_marvel',
    name: 'Molecular Marvel',
    desc: 'Successfully synthesized molecules inside the synthesis room.',
    emoji: '🧪',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-900',
    border: 'border-emerald-400/60 shadow-emerald-500/30',
    text: 'text-emerald-50',
    unlockDesc: 'Unlock at 300 XP milestone'
  },
  noble_knighthood: {
    id: 'noble_knighthood',
    name: 'Noble Knighthood',
    desc: 'Harnessed inert valencies to establish atomic shields.',
    emoji: '🎈',
    gradient: 'from-amber-500 via-orange-600 to-red-800',
    border: 'border-amber-400/60 shadow-amber-500/30',
    text: 'text-amber-50',
    unlockDesc: 'Unlock at 500 XP milestone'
  },
  valency_vanguard: {
    id: 'valency_vanguard',
    name: 'Valency Vanguard',
    desc: 'Maintained advanced electronic shells defense coverage.',
    emoji: '🛡️',
    gradient: 'from-rose-500 via-pink-600 to-rose-900',
    border: 'border-rose-400/60 shadow-rose-500/30',
    text: 'text-rose-100',
    unlockDesc: 'Unlock at 800 XP milestone'
  },
  halogen_hero: {
    id: 'halogen_hero',
    name: 'Halogen Hero',
    desc: 'Unleased high electronegativity salt-forming attacks.',
    emoji: '🔥',
    gradient: 'from-red-500 via-orange-600 to-amber-800',
    border: 'border-orange-400/60 shadow-orange-500/35',
    text: 'text-orange-100',
    unlockDesc: 'Unlock at 1100 XP milestone'
  },
  doc_conqueror: {
    id: 'doc_conqueror',
    name: 'Doctor Conqueror',
    desc: 'Defeated AI Doc Proton on expert high-hazard difficulties.',
    emoji: '👑',
    gradient: 'from-yellow-400 via-amber-500 to-yellow-800',
    border: 'border-yellow-400/70 shadow-yellow-500/40',
    text: 'text-yellow-50',
    unlockDesc: 'Unlock at 1500 XP'
  },
  monthly_slayer: {
    id: 'monthly_slayer',
    name: 'Monthly Slayer',
    desc: 'Eradicated the Chrono-Fusion Monthly Boss Challenger.',
    emoji: '👾',
    gradient: 'from-fuchsia-600 via-fuchsia-800 to-slate-900',
    border: 'border-fuchsia-400/60 shadow-fuchsia-500/30',
    text: 'text-fuchsia-50',
    unlockDesc: 'Defeat the Monthly Bot'
  }
};

// --- PRESETS FOR RENDERER ---
const WARDROBE_CLOTHING = [
  { id: 'lab_coat', name: 'Chemist Lab Coat', emoji: '🥼', fill: '#F1F5F9' },
  { id: 'cyber_suit', name: 'Cosmic Jumpsuit', emoji: '🧑‍🚀', fill: '#6366F1' },
  { id: 'mystic_robe', name: 'Alchemist Cloak', emoji: '🥋', fill: '#312E81' },
  { id: 'hazmat', name: 'Radioactive Hazmat', emoji: '☢️', fill: '#EAB308' },
  { id: 'battle_armor', name: 'Titanium Battle Armor', emoji: '🛡️', fill: '#475569' },
  { id: 'plasma_suit', name: 'Plasma Exosuit', emoji: '⚡', fill: '#06B6D4' },
  { id: 'fire_fighter', name: 'Furnace Fireproof', emoji: '🔥', fill: '#DC2626' },
  { id: 'solar_robe', name: 'Solar Photon Cloak', emoji: '☀️', fill: '#F59E0B' },
];

const WARDROBE_ACCESSORIES = [
  { id: 'safety_goggles', name: 'Safety Goggles', emoji: '🥽' },
  { id: 'cyberspace_visor', name: 'Cyber Laser Visor', emoji: '🕶️' },
  { id: 'alchemist_crown', name: 'Elemental Crown', emoji: '👑' },
  { id: 'reactor_core', name: 'Reactor Core Necklace', emoji: '💎' },
  { id: 'quantum_band', name: 'Quantum Headband', emoji: '🌀' },
  { id: 'none', name: 'No Accessory', emoji: '❌' }
];

const WARDROBE_HAIR = [
  { id: 'wild_scientist', name: 'Crazy Dev Hair', emoji: '🦁' },
  { id: 'neon_spikes', name: 'Cyber Spikes', emoji: '⚡' },
  { id: 'slick_bob', name: 'Smooth Helmet', emoji: '💇' },
  { id: 'plasma_mohawk', name: 'Plasma Mohawk', emoji: '🔥' },
  { id: 'frost_tips', name: 'Cryo Frost Tips', emoji: '❄️' },
  { id: 'golden_wave', name: 'Golden Wave', emoji: '✨' },
  { id: 'none', name: 'Sleek/Bald', emoji: '🥚' }
];

const WARDROBE_FACIAL = [
  { id: 'none', name: 'Clean Shaven', emoji: '😊' },
  { id: 'goatee', name: 'Quantum Goatee', emoji: '🧔' },
  { id: 'mask', name: 'Half Respirator', emoji: '😷' },
  { id: 'scar', name: 'Battle Scar', emoji: '⚔️' },
  { id: 'war_paint', name: 'Tribal War Paint', emoji: '🎨' },
];

const WARDROBE_SKIN_COLORS = [
  { id: 'peach', name: 'Biosphere Peach', value: '#FFD1A9' },
  { id: 'bronze', name: 'Quantum Bronze', value: '#E29C68' },
  { id: 'deep_brown', name: 'Organic Umber', value: '#8A5229' },
  { id: 'neon_glow', name: 'Bioluminescent Neon', value: '#87EE2A' },
  { id: 'spectral_blue', name: 'Plasma Blue', value: '#2AE7EE' },
  { id: 'crimson_haze', name: 'Crimson Haze', value: '#FF6B6B' },
  { id: 'violet_shift', name: 'Violet Phase Shift', value: '#C084FC' },
  { id: 'gold_fusion', name: 'Gold Fusion', value: '#FBBF24' },
];

// --- RETRO 8-BIT CHARACTER VECTOR RENDERER ---
const PixelCharacter: React.FC<{
  skin?: string;
  clothing?: string;
  accessory?: string;
  hair?: string;
  facial?: string;
  skinColor?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ skin = 'spectral_cyan', clothing = 'lab_coat', accessory = 'safety_goggles', hair = 'wild_scientist', facial = 'none', skinColor = '#FFD1A9', size = 'md' }) => {
  const pxSize = size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-24 h-24' : 'w-36 h-36';

  let bodyFill = 'url(#grad-spectral)';
  let glowColor = 'rgba(6, 182, 212, 0.3)';
  if (skin === 'solid_slate') { bodyFill = 'url(#grad-slate)'; glowColor = 'rgba(100, 116, 139, 0.2)'; }
  else if (skin === 'radiant_radium') { bodyFill = 'url(#grad-radium)'; glowColor = 'rgba(132, 204, 22, 0.5)'; }
  else if (skin === 'neon_cyber') { bodyFill = 'url(#grad-cyber)'; glowColor = 'rgba(217, 70, 239, 0.5)'; }
  else if (skin === 'quantum_aurora') { bodyFill = 'url(#grad-aurora)'; glowColor = 'rgba(20, 184, 166, 0.6)'; }
  else if (skin === 'gold_alchemist') { bodyFill = 'url(#grad-gold)'; glowColor = 'rgba(234, 179, 8, 0.7)'; }

  let clothFill = '#F1F5F9';
  if (clothing === 'cyber_suit') clothFill = '#6366F1';
  else if (clothing === 'mystic_robe') clothFill = '#312E81';
  else if (clothing === 'hazmat') clothFill = '#EAB308';
  else if (clothing === 'battle_armor') clothFill = '#475569';
  else if (clothing === 'plasma_suit') clothFill = '#06B6D4';
  else if (clothing === 'fire_fighter') clothFill = '#DC2626';
  else if (clothing === 'solar_robe') clothFill = '#F59E0B';

  let hairFill = '#334155';
  if (hair === 'neon_spikes') hairFill = '#0ea5e9';
  else if (hair === 'slick_bob') hairFill = '#ec4899';
  else if (hair === 'wild_scientist') hairFill = '#94a3b8';
  else if (hair === 'plasma_mohawk') hairFill = '#f97316';
  else if (hair === 'frost_tips') hairFill = '#a5f3fc';
  else if (hair === 'golden_wave') hairFill = '#fbbf24';

  let accFill = '#ef4444';
  if (accessory === 'cyberspace_visor') accFill = '#ec4899';
  else if (accessory === 'alchemist_crown') accFill = '#fbbf24';
  else if (accessory === 'reactor_core') accFill = '#22d3ee';
  else if (accessory === 'quantum_band') accFill = '#a855f7';

  return (
    <svg
      viewBox="0 0 16 16"
      className={`${pxSize} cubic-bezier rounded-xl select-none`}
      style={{
        imageRendering: 'pixelated',
        filter: `drop-shadow(0 4px 10px ${glowColor})`
      }}
    >
      <defs>
        <linearGradient id="grad-spectral" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="grad-slate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="grad-radium" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="grad-cyber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#581c87" />
        </linearGradient>
        <linearGradient id="grad-aurora" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="grad-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Feet / Shadow */}
      <rect x="5" y="14" width="2" height="1" fill="#0f172a" />
      <rect x="9" y="14" width="2" height="1" fill="#0f172a" />

      {/* Legs */}
      <rect x="5" y="12" width="2" height="2" fill={bodyFill} />
      <rect x="9" y="12" width="2" height="2" fill={bodyFill} />

      {/* Torso Clothes */}
      <rect x="4" y="7" width="8" height="5" fill={clothFill} />
      {clothing === 'lab_coat' && (
        <>
          <rect x="7" y="7" width="2" height="5" fill="#94a3b8" />
          <rect x="6" y="9" width="1" height="1" fill="#475569" />
        </>
      )}
      {clothing === 'hazmat' && (
        <>
          <rect x="7" y="8" width="2" height="2" fill="#1e293b" />
        </>
      )}
      {clothing === 'battle_armor' && (
        <>
          <rect x="6" y="7" width="4" height="1" fill="#64748b" />
          <rect x="7" y="8" width="2" height="1" fill="#94a3b8" />
          <rect x="4" y="10" width="1" height="2" fill="#64748b" />
          <rect x="11" y="10" width="1" height="2" fill="#64748b" />
        </>
      )}
      {clothing === 'plasma_suit' && (
        <>
          <rect x="7" y="7" width="2" height="5" fill="#0891b2" />
          <rect x="5" y="8" width="1" height="1" fill="#67e8f9" />
          <rect x="10" y="8" width="1" height="1" fill="#67e8f9" />
        </>
      )}
      {clothing === 'fire_fighter' && (
        <>
          <rect x="7" y="7" width="2" height="5" fill="#991b1b" />
          <rect x="5" y="9" width="1" height="1" fill="#fbbf24" />
          <rect x="10" y="9" width="1" height="1" fill="#fbbf24" />
        </>
      )}
      {clothing === 'solar_robe' && (
        <>
          <rect x="3" y="11" width="10" height="1" fill="#d97706" />
          <rect x="7" y="7" width="2" height="5" fill="#fcd34d" />
        </>
      )}

      {/* Arms & Hands */}
      <rect x="2" y="8" width="2" height="3" fill={clothFill} />
      <rect x="12" y="8" width="2" height="3" fill={clothFill} />
      <rect x="2" y="11" width="2" height="1" fill={skinColor} />
      <rect x="12" y="11" width="2" height="1" fill={skinColor} />

      {/* Face/Head */}
      <rect x="7" y="6" width="2" height="1" fill={skinColor} />
      <rect x="5" y="2" width="6" height="4" fill={skinColor} />

      {/* Eyes */}
      <rect x="6" y="3" width="1" height="1" fill="#0f172a" />
      <rect x="9" y="3" width="1" height="1" fill="#0f172a" />

      {/* Facial Features */}
      {facial === 'goatee' && (
        <rect x="7" y="5" width="2" height="1" fill="#475569" />
      )}
      {facial === 'mask' && (
        <>
          <rect x="5" y="4" width="6" height="2" fill="#64748b" opacity="0.7" />
          <rect x="6" y="3" width="1" height="1" fill="#a5f3fc" />
          <rect x="9" y="3" width="1" height="1" fill="#a5f3fc" />
        </>
      )}
      {facial === 'scar' && (
        <>
          <rect x="9" y="2" width="1" height="3" fill="#dc2626" opacity="0.6" />
        </>
      )}
      {facial === 'war_paint' && (
        <>
          <rect x="5" y="3" width="1" height="2" fill="#f97316" opacity="0.7" />
          <rect x="10" y="3" width="1" height="2" fill="#f97316" opacity="0.7" />
          <rect x="7" y="5" width="2" height="0.5" fill="#f97316" opacity="0.5" />
        </>
      )}

      {/* Hairstyles */}
      {hair !== 'none' && (
        <>
          {hair === 'wild_scientist' && (
            <>
              <rect x="4" y="1" width="8" height="1" fill={hairFill} />
              <rect x="3" y="2" width="2" height="3" fill={hairFill} />
              <rect x="11" y="2" width="2" height="3" fill={hairFill} />
            </>
          )}
          {hair === 'neon_spikes' && (
            <>
              <rect x="5" y="0" width="1" height="2" fill={hairFill} />
              <rect x="7" y="0" width="1" height="2" fill={hairFill} />
              <rect x="9" y="0" width="1" height="2" fill={hairFill} />
              <rect x="5" y="1" width="6" height="1" fill={hairFill} />
            </>
          )}
          {hair === 'slick_bob' && (
            <>
              <rect x="4" y="1" width="8" height="2" fill={hairFill} />
              <rect x="4" y="3" width="1" height="2" fill={hairFill} />
              <rect x="11" y="3" width="1" height="2" fill={hairFill} />
            </>
          )}
          {hair === 'plasma_mohawk' && (
            <>
              <rect x="7" y="0" width="2" height="2" fill={hairFill} />
              <rect x="6" y="0" width="4" height="1" fill={hairFill} />
              <rect x="5" y="1" width="6" height="1" fill={hairFill} />
            </>
          )}
          {hair === 'frost_tips' && (
            <>
              <rect x="4" y="1" width="8" height="1" fill={hairFill} />
              <rect x="3" y="2" width="2" height="3" fill={hairFill} />
              <rect x="11" y="2" width="2" height="3" fill={hairFill} />
              <rect x="4" y="1" width="1" height="1" fill="#ffffff" opacity="0.5" />
              <rect x="6" y="1" width="1" height="1" fill="#ffffff" opacity="0.5" />
              <rect x="8" y="1" width="1" height="1" fill="#ffffff" opacity="0.5" />
              <rect x="10" y="1" width="1" height="1" fill="#ffffff" opacity="0.5" />
            </>
          )}
          {hair === 'golden_wave' && (
            <>
              <rect x="4" y="1" width="8" height="2" fill={hairFill} />
              <rect x="3" y="2" width="2" height="3" fill={hairFill} />
              <rect x="11" y="2" width="2" height="3" fill={hairFill} />
              <rect x="5" y="1" width="2" height="1" fill="#fef08a" opacity="0.5" />
              <rect x="9" y="1" width="2" height="1" fill="#fef08a" opacity="0.5" />
            </>
          )}
        </>
      )}

      {/* Accessories */}
      {accessory !== 'none' && (
        <>
          {accessory === 'safety_goggles' && (
            <>
              <rect x="4" y="2" width="8" height="2" fill="#475569" opacity="0.9" />
              <rect x="5.5" y="2.5" width="2" height="1" fill="#a5f3fc" />
              <rect x="8.5" y="2.5" width="2" height="1" fill="#a5f3fc" />
            </>
          )}
          {accessory === 'cyberspace_visor' && (
            <>
              <rect x="4" y="2.5" width="8" height="1.2" fill={accFill} />
              <rect x="6" y="2.8" width="4" height="0.4" fill="#ffffff" />
            </>
          )}
          {accessory === 'alchemist_crown' && (
            <>
              <rect x="5" y="1" width="6" height="1" fill={accFill} />
              <rect x="5" y="0" width="1" height="1" fill={accFill} />
              <rect x="7" y="0" width="1" height="1" fill={accFill} />
              <rect x="9" y="0" width="1" height="1" fill={accFill} />
              <rect x="10" y="0" width="1" height="1" fill={accFill} />
            </>
          )}
          {accessory === 'reactor_core' && (
            <>
              <rect x="7" y="7" width="2" height="2" fill={accFill} />
              <rect x="7.5" y="7.5" width="1" height="1" fill="#ffffff" opacity="0.7" />
            </>
          )}
          {accessory === 'quantum_band' && (
            <>
              <rect x="4" y="1.5" width="8" height="0.8" fill={accFill} />
              <rect x="7" y="1.2" width="2" height="0.4" fill="#e9d5ff" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

interface WinningLineup {
  id: string;
  playerName: string;
  date: string;
  skin: string;
  avatar: string;
  elements: ElementCard[];
  compounds: string[];
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  skin: string;
  level: number;
  badges: string[];
  activeSkin?: string;
  pixelChar?: {
    clothing: string;
    accessory: string;
    hair: string;
    skinColor: string;
  };
}

export const TurnedTables: React.FC<TurnedTablesProps> = ({ onBack, onAddStars, stars, userId }) => {
  // Profile, Quests, Badges & Skins States (Local Storage Persistent)
  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem('tt_user_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [userSkins, setUserSkins] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_user_skins');
    return saved ? JSON.parse(saved) : ['spectral_cyan', 'solid_slate'];
  });
  const [activeSkin, setActiveSkin] = useState<string>(() => {
    const saved = localStorage.getItem('tt_active_skin');
    return saved || 'spectral_cyan';
  });
  const [userBadges, setUserBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_user_badges');
    return saved ? JSON.parse(saved) : ['proton_pioneer'];
  });

  // --- CUSTOM WARDROBE & CLOSET PERSISTENT STATE ---
  const [charClothing, setCharClothing] = useState<string>(() => {
    const saved = localStorage.getItem('tt_char_clothing');
    return saved || 'lab_coat';
  });
  const [charAccessory, setCharAccessory] = useState<string>(() => {
    const saved = localStorage.getItem('tt_char_accessory');
    return saved || 'safety_goggles';
  });
  const [charHair, setCharHair] = useState<string>(() => {
    const saved = localStorage.getItem('tt_char_hair');
    return saved || 'wild_scientist';
  });
  const [charSkinColor, setCharSkinColor] = useState<string>(() => {
    const saved = localStorage.getItem('tt_char_skin_color');
    return saved || 'peach';
  });
  const [charFacial, setCharFacial] = useState<string>(() => {
    const saved = localStorage.getItem('tt_char_facial');
    return saved || 'none';
  });

  const [customDisplayedBadges, setCustomDisplayedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_custom_displayed_badges');
    return saved ? JSON.parse(saved) : [];
  });

  // --- SOCIAL FRIENDS DATABASE STATE ---
  const [friendsList, setFriendsList] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('tt_friends_list');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'f-1', name: 'ValenceVixen 🧪', avatar: '👩‍🔬', skin: 'neon_cyber', level: 12, badges: ['valency_vanguard', 'molecular_marvel', 'proton_pioneer'] },
      { id: 'f-2', name: 'HeliumHype ⚡', avatar: '🏃', skin: 'radiant_radium', level: 8, badges: ['molecular_marvel', 'proton_pioneer'] },
      { id: 'f-3', name: 'AlchemistPro 🏆', avatar: '🧙', skin: 'gold_alchemist', level: 25, badges: ['doc_conqueror', 'valency_vanguard', 'molecular_marvel', 'proton_pioneer'] }
    ];
  });

  const [sentRequests, setSentRequests] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_sent_requests');
    return saved ? JSON.parse(saved) : ['NobleNeutron 🎈', 'IsotopeIzzy 📡'];
  });

  const [newFriendInput, setNewFriendInput] = useState<string>('');
  const [activeInspectedFriend, setActiveInspectedFriend] = useState<Friend | null>(null);

  // --- SYNTHESIZED COMPOUNDS LETIME LOG STATE ---
  const [createdCompounds, setCreatedCompounds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_created_compounds');
    return saved ? JSON.parse(saved) : ['CO2', 'NaCl', 'H2O'];
  });

  // --- CHAMPION LINEUPS REGISTRY STATE ---
  const [winningGallery, setWinningGallery] = useState<WinningLineup[]>(() => {
    const saved = localStorage.getItem('tt_winning_gallery');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'g-1',
        playerName: 'ValenceVixen 🧪',
        date: 'Jun 12, 2026',
        skin: 'neon_cyber',
        avatar: '👩‍🔬',
        elements: [
          { number: 3, symbol: 'Li', name: 'Lithium', period: 2, group: 1, category: 'alkali', powerup: { name: 'battery charge', desc: 'deals 40 damage', effect: 'damage', value: 40 }, clue: 'battery metal' },
          { number: 9, symbol: 'F', name: 'Fluorine', period: 2, group: 17, category: 'halogen', powerup: { name: 'superacid', desc: 'deals 50 damage', effect: 'damage', value: 50 }, clue: 'reactive gas' },
          { number: 10, symbol: 'Ne', name: 'Neon', period: 2, group: 18, category: 'noble', powerup: { name: 'shield', desc: 'gains 40 shield', effect: 'shield', value: 40 }, clue: 'neon signs' }
        ] as any,
        compounds: ['H2O', 'CO2']
      },
      {
        id: 'g-2',
        playerName: 'AlchemistPro 🏆',
        date: 'Jun 14, 2026',
        skin: 'gold_alchemist',
        avatar: '🧙',
        elements: [
          { number: 1, symbol: 'H', name: 'Hydrogen', period: 1, group: 1, category: 'nonmetal', powerup: { name: 'fusion spark', desc: 'deals 30 damage', effect: 'damage', value: 30 }, clue: 'star fuel' },
          { number: 8, symbol: 'O', name: 'Oxygen', period: 2, group: 16, category: 'nonmetal', powerup: { name: 'vital oxygen', desc: 'heals 30 HP', effect: 'heal', value: 30 }, clue: 'respiratory life' }
        ] as any,
        compounds: ['H2O']
      }
    ];
  });

  // --- MONTHLY CHALLENGE BOT STATES ---
  const [isMonthlyChallenge, setIsMonthlyChallenge] = useState<boolean>(false);
  const [monthlyChallengeDefeated, setMonthlyChallengeDefeated] = useState<boolean>(() => {
    return localStorage.getItem('tt_monthly_defeated') === 'true';
  });

  // --- SIDE MENU / DIALOG DRAWERS STATES ---
  const [showBadgesMenu, setShowBadgesMenu] = useState<boolean>(false);
  const [showCompoundsMenu, setShowCompoundsMenu] = useState<boolean>(false);
  const [showGalleryMenu, setShowGalleryMenu] = useState<boolean>(false);
  const [showPracticeParamsModal, setShowPracticeParamsModal] = useState<boolean>(false);
  const [showFriendInspectModal, setShowFriendInspectModal] = useState<boolean>(false);

  // Setup Player Names & Avatars Configuration
  const [p1ConfigName, setP1ConfigName] = useState<string>('Cyan Force');
  const [p1ConfigAvatar, setP1ConfigAvatar] = useState<string>('🧪');
  const [p2ConfigName, setP2ConfigName] = useState<string>('Amber Glow');
  const [p2ConfigAvatar, setP2ConfigAvatar] = useState<string>('⚡');

  // Multi-player simulated matchmaking arrays & logs
  const [matchmakingMode, setMatchmakingMode] = useState<'none' | '1v1' | '3v3'>('none');
  const [matchmakingStep, setMatchmakingStep] = useState<'none' | 'connecting' | 'finding_players' | 'ready'>('none');
  const [lobbyPlayers, setLobbyPlayers] = useState<Array<{ name: string; avatar: string; team: 'cyan' | 'amber'; isUser?: boolean; isReady?: boolean }>>([]);
  const [lobbyChat, setLobbyChat] = useState<Array<{ sender: string; avatar: string; text: string; time: string; isUser?: boolean }>>([]);
  const [chatMessageInput, setChatMessageInput] = useState<string>('');
  const [matchmakingTimer, setMatchmakingTimer] = useState<number>(8);

  // Real multiplayer lobby
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false);
  const [multiplayerRoomId, setMultiplayerRoomId] = useState<string | null>(null);
  const [multiplayerMode, setMultiplayerMode] = useState<RoomMode>('1v1');

  const [quests, setQuests] = useState<Array<{ id: string; title: string; current: number; target: number; xpReward: number; isWeekly: boolean; completed: boolean }>>([
    { id: 'q_draft_noble', title: 'Collect a Noble Gas element card', current: 0, target: 1, xpReward: 100, isWeekly: false, completed: false },
    { id: 'q_synthesize_two', title: 'Synthesize 2 molecules in any game mode', current: 0, target: 2, xpReward: 150, isWeekly: false, completed: false },
    { id: 'q_play_online', title: 'Engage in 1 Online PVP Server Battle', current: 0, target: 1, xpReward: 120, isWeekly: false, completed: false },
    { id: 'q_melt_shields_weekly', title: 'Weekly: Deal 500 combat shield damage', current: 0, target: 500, xpReward: 350, isWeekly: true, completed: false },
    { id: 'q_win_team_weekly', title: 'Weekly: Secure a victory in 3v3 Team Co-op mode', current: 0, target: 1, xpReward: 400, isWeekly: true, completed: false }
  ]);

  // Game Setup States
  const [playMode, setPlayMode] = useState<'setup' | 'draft' | 'battle' | 'synthesis' | 'ended'>('setup');
  const [vsBot, setVsBot] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<'alpha' | 'beta' | 'gamma'>('beta');

  // Spent cards in combat so we know which ones to discard at end-of-round (used cards don't carry over)
  const [p1UsedIds, setP1UsedIds] = useState<string[]>([]);
  const [p2UsedIds, setP2UsedIds] = useState<string[]>([]);

  // Scoreboard or Rounds state
  const [p1RoundWins, setP1RoundWins] = useState<number>(0);
  const [p2RoundWins, setP2RoundWins] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [p1SynthesizedThisRound, setP1SynthesizedThisRound] = useState<boolean>(false);
  const [p2SynthesizedThisRound, setP2SynthesizedThisRound] = useState<boolean>(false);

  // Under the new round mechanics, elements used in previous rounds turn grey and are unclickable
  const [usedElementNumbers, setUsedElementNumbers] = useState<number[]>([]);

  // Snapshots of the players entering battle context so cards replenish
  const [p1InitialLineup, setP1InitialLineup] = useState<{ elements: ElementCard[]; compounds: string[] }>({ elements: [], compounds: [] });
  const [p2InitialLineup, setP2InitialLineup] = useState<{ elements: ElementCard[]; compounds: string[] }>({ elements: [], compounds: [] });

  // Accessing previous winner's lineup in a side menu
  const [lastWinnerLineup, setLastWinnerLineup] = useState<{ playerName: string; elements: ElementCard[]; compounds: string[] } | null>(null);
  const [showWinnerLineupMenu, setShowWinnerLineupMenu] = useState<boolean>(false);

  // Attack Cooldowns: el-NUMBER or comp-RECIPEID mapped to turns remaining
  const [p1Cooldowns, setP1Cooldowns] = useState<Record<string, number>>({});
  const [p2Cooldowns, setP2Cooldowns] = useState<Record<string, number>>({});

  // Player States
  const [player1, setPlayer1] = useState<Player>({
    id: 1, name: 'Cyan Force (P1)', hp: 500, shield: 0, deck: [], compounds: [], score: 0
  });
  const [player2, setPlayer2] = useState<Player>({
    id: 2, name: 'Amber Glow (P2)', hp: 500, shield: 0, deck: [], compounds: [], score: 0, isBot: false
  });
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);

  // Turn-based prompt inside Synthesis Room
  const [synthStage, setSynthStage] = useState<1 | 2>(1);

  // Deck states for periodic table drafting phase
  const [unclaimedElements, setUnclaimedElements] = useState<ElementCard[]>(ELEMENTS_DB);
  const [sideDeck, setSideDeck] = useState<ElementCard[]>([]); // element cards failed 3 times
  const [claimedBy, setClaimedBy] = useState<Record<number, 1 | 2 | 'side'>>({}); // mapping atomic number -> owner

  // Quiz Modal States during drafting
  const [activeQuizCard, setActiveQuizCard] = useState<ElementCard | null>(null);
  const [quizInput, setQuizInput] = useState<string>('');
  const [quizAttempts, setQuizAttempts] = useState<number>(0);
  const [quizTurns, setQuizTurns] = useState<1 | 2>(1); // who is currently being prompted for the quiz
  const [quizStatus, setQuizStatus] = useState<'prompt' | 'success' | 'failed' | 'reveal'>('prompt');
  const [correctGuesser, setCorrectGuesser] = useState<1 | 2 | null>(null);

  // Battle Arena States
  const [battleLog, setBattleLog] = useState<string[]>(['Atomic Arena Initiated! Draw energy to prepare.']);
  const [selectedSpell, setSelectedSpell] = useState<{ type: 'element' | 'compound'; id: string | number } | null>(null);
  const [battleWinner, setBattleWinner] = useState<1 | 2 | null>(null);
  const [p1IsStunned, setP1IsStunned] = useState<boolean>(false);
  const [p2IsStunned, setP2IsStunned] = useState<boolean>(false);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);

  const isBotThinkingRef = useRef<boolean>(false);
  const isBotTypingRef = useRef<boolean>(false);
  const isRoundTransitioningRef = useRef<boolean>(false);
  isBotThinkingRef.current = isBotThinking;
  isBotTypingRef.current = isBotTyping;

  // Sound and Visual Help
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRecipeBook, setShowRecipeBook] = useState<boolean>(false);

  // Element Tray & Combination Attack States
  const [showTray, setShowTray] = useState<boolean>(false);
  const [trayActivePlayer, setTrayActivePlayer] = useState<1 | 2>(1);
  const [selectedTrayElement, setSelectedTrayElement] = useState<ElementCard | null>(null);
  const [comboElement, setComboElement] = useState<ElementCard | null>(null);
  const [showSynthesisStation, setShowSynthesisStation] = useState<boolean>(false);
  const [synthesisSearchQuery, setSynthesisSearchQuery] = useState<string>('');

  // High-performance combat animation state
  const [activeStrikeEffect, setActiveStrikeEffect] = useState<{
    cardName: string;
    powerupName: string;
    effectType: 'damage' | 'shield' | 'heal' | 'stun' | 'evade' | 'clear';
    value: number;
    symbol: string;
    sourceName: string;
    targetName: string;
    isCompound: boolean;
  } | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Courtside challenge states
  const [activeCourtsideCard, setActiveCourtsideCard] = useState<ElementCard | null>(null);
  const [courtsideRecipes, setCourtsideRecipes] = useState<CompoundRecipe[]>([]);
  const [selectedCourtsideRecipe, setSelectedCourtsideRecipe] = useState<CompoundRecipe | null>(null);
  const [courtsideInput, setCourtsideInput] = useState<string>('');
  const [courtsideAttempts, setCourtsideAttempts] = useState<number>(0);
  const [courtsideStatus, setCourtsideStatus] = useState<'prompt' | 'success' | 'failed'>('prompt');

  const isAttackCard = (card: { powerup?: { effect: string } }) => {
    const effect = card?.powerup?.effect;
    return effect === 'damage' || effect === 'stun';
  };

  const getAttackCountForList = (deckElements: ElementCard[], compoundIds: string[]) => {
    let attackCount = 0;
    deckElements.forEach(el => {
      if (isAttackCard(el)) attackCount++;
    });
    compoundIds.forEach(id => {
      const recipe = COMPOUND_RECIPES.find(r => r.id === id);
      if (recipe && isAttackCard(recipe)) {
        attackCount++;
      }
    });
    return attackCount;
  };

  const leadsToAtLeastThreeAttacks = (player: Player, recipe: CompoundRecipe) => {
    let updatedDeck = [...player.deck];
    let success = true;
    recipe.required.forEach(req => {
      for (let i = 0; i < req.qty; i++) {
        const removeIdx = updatedDeck.findIndex(card => card.symbol === req.symbol);
        if (removeIdx !== -1) {
          updatedDeck.splice(removeIdx, 1);
        } else {
          success = false;
        }
      }
    });
    if (!success) return false;
    const potentialCompounds = [...player.compounds, recipe.id];
    return getAttackCountForList(updatedDeck, potentialCompounds) >= 3;
  };

  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quest state progression calculator
  const progressQuest = (questId: string, amount: number) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && !q.completed) {
        const nextVal = Math.min(q.target, q.current + amount);
        const resolved = nextVal >= q.target;
        if (resolved) {
          setUserXP(xp => {
            const nextXp = xp + q.xpReward;
            triggerToast(`Completed quest: "${q.title}"! +${q.xpReward} XP awarded!`);
            return nextXp;
          });
        }
        return { ...q, current: nextVal, completed: resolved };
      }
      return q;
    }));
  };

  // Sync profile badges & storage on XP shifts
  useEffect(() => {
    localStorage.setItem('tt_user_xp', userXP.toString());
    const currentLvl = Math.floor(userXP / 350) + 1;
    
    // Auto unlock badges on milestones
    setUserBadges(prev => {
      const tempBadges = [...prev];
      let changed = false;

      if (!tempBadges.includes('proton_pioneer')) {
        tempBadges.push('proton_pioneer');
        changed = true;
      }
      if (userXP >= 100 && !tempBadges.includes('elemental_overlord')) {
        tempBadges.push('elemental_overlord');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Elemental Overlord!");
      }
      if (userXP >= 300 && !tempBadges.includes('molecular_marvel')) {
        tempBadges.push('molecular_marvel');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Molecular Marvel!");
      }
      if (userXP >= 500 && !tempBadges.includes('noble_knighthood')) {
        tempBadges.push('noble_knighthood');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Noble Knighthood!");
      }
      if (userXP >= 800 && !tempBadges.includes('valency_vanguard')) {
        tempBadges.push('valency_vanguard');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Valency Vanguard!");
      }
      if (userXP >= 1100 && !tempBadges.includes('halogen_hero')) {
        tempBadges.push('halogen_hero');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Halogen Hero!");
      }
      if (userXP >= 1500 && !tempBadges.includes('doc_conqueror')) {
        tempBadges.push('doc_conqueror');
        changed = true;
        triggerToast("🏅 Milestone Badge Unlocked: Doctor Conqueror!");
      }

      if (changed) {
        localStorage.setItem('tt_user_badges', JSON.stringify(tempBadges));
        return tempBadges;
      }
      return prev;
    });

    // Check skin unlocks based on level requirements
    setUserSkins(prev => {
      const tempSkins = [...prev];
      let changed = false;
      Object.keys(SKINS_INFO).forEach(skinKey => {
        const info = SKINS_INFO[skinKey];
        if (currentLvl >= info.levelReq && !tempSkins.includes(skinKey)) {
          tempSkins.push(skinKey);
          changed = true;
          triggerToast(`✨ Skin Unlocked! "${info.label}" (${info.rarity}) is now in your Wardrobe.`);
        }
      });
      if (changed) {
        localStorage.setItem('tt_user_skins', JSON.stringify(tempSkins));
        return tempSkins;
      }
      return prev;
    });
  }, [userXP]);

  // Sync active skin choice and custom wardrobe options to LocalStorage
  useEffect(() => {
    localStorage.setItem('tt_active_skin', activeSkin);
  }, [activeSkin]);

  useEffect(() => {
    localStorage.setItem('tt_char_clothing', charClothing);
    localStorage.setItem('tt_char_accessory', charAccessory);
    localStorage.setItem('tt_char_hair', charHair);
    localStorage.setItem('tt_char_skin_color', charSkinColor);
    localStorage.setItem('tt_char_facial', charFacial);
  }, [charClothing, charAccessory, charHair, charSkinColor, charFacial]);

  // Handle manual badge selection toggles
  const handleToggleBadgeDisplay = (badgeId: string) => {
    if (userBadges.length <= 5) {
      triggerToast("All your badges are automatically displayed since you have 5 or less!");
      return;
    }
    
    setCustomDisplayedBadges(prev => {
      let updated = [...prev];
      if (updated.includes(badgeId)) {
        updated = updated.filter(b => b !== badgeId);
      } else {
        if (updated.length >= 5) {
          triggerToast("You can display at most 5 badges on your profile!");
          return prev;
        }
        updated.push(badgeId);
      }
      localStorage.setItem('tt_custom_displayed_badges', JSON.stringify(updated));
      return updated;
    });
  };

  const getProfileDisplayedBadges = () => {
    if (userBadges.length <= 5) {
      return userBadges;
    }
    if (customDisplayedBadges.length === 0) {
      return userBadges.slice(0, 5);
    }
    const valid = customDisplayedBadges.filter(b => userBadges.includes(b));
    if (valid.length === 0) return userBadges.slice(0, 5);
    return valid.slice(0, 5);
  };

  // Helper colors for Categories
  const getCategoryColor = (cat: ElementCard['category']) => {
    switch (cat) {
      case 'noble': return 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800 border-purple-400';
      case 'halogen': return 'bg-gradient-to-br from-rose-100 to-rose-200 text-rose-800 border-rose-400';
      case 'alkali': return 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-400';
      case 'alkaline': return 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 border-amber-400';
      case 'transition': return 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-800 border-teal-400';
      case 'metalloid': return 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-400';
      case 'nonmetal': return 'bg-gradient-to-br from-sky-100 to-sky-200 text-sky-800 border-sky-400';
      default: return 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border-slate-400';
    }
  };

  const getCategoryAccentColor = (cat: ElementCard['category']) => {
    switch (cat) {
      case 'noble': return '#a855f7';
      case 'halogen': return '#f43f5e';
      case 'alkali': return '#06b6d4';
      case 'alkaline': return '#f59e0b';
      case 'transition': return '#14b8a6';
      case 'metalloid': return '#10b981';
      case 'nonmetal': return '#0ea5e9';
      default: return '#64748b';
    }
  };

  const handleQuitPractice = () => {
    const penalty = 50;
    const newXP = Math.max(0, userXP - penalty);
    setUserXP(newXP);
    localStorage.setItem('tt_user_xp', newXP.toString());
    triggerToast(`Retreated from Lab Practice! Loss: -50 XP penalty applied.`);
    setPlayMode('setup');
    setShowQuitConfirm(false);
  };

  const getCardCooldown = (type: 'element' | 'compound', id: string | number) => {
    const key = type === 'element' ? `el-${id}` : `comp-${id}`;
    const activeCooldowns = currentTurn === 1 ? p1Cooldowns : p2Cooldowns;
    return activeCooldowns[key] || 0;
  };

  const getSanitizedClue = (card: ElementCard | null) => {
    if (!card) return '';
    let clueText = card.clue;
    
    // Create regex pattern to match the element name (e.g. "Hydrogen", "Carbon"), as well as lowercase and plural variants.
    const name = card.name;
    const namePlural = name + 's';
    
    // Replace references
    const regexPlural = new RegExp(namePlural, 'gi');
    clueText = clueText.replace(regexPlural, 'these elements');
    
    const regexSingular = new RegExp(name, 'gi');
    clueText = clueText.replace(regexSingular, 'this element');
    
    return clueText;
  };

  const randomizeP1Name = () => {
    const rNm = generateRandomThemedName();
    setP1ConfigName(rNm);
    audio.playPop();
  };

  const randomizeP2Name = () => {
    const rNm = generateRandomThemedName();
    setP2ConfigName(rNm);
    audio.playPop();
  };

  const sendChatMessage = () => {
    if (!chatMessageInput.trim()) return;
    const userMsg = chatMessageInput.trim();
    setLobbyChat(prev => [...prev, {
      sender: p1ConfigName,
      avatar: p1ConfigAvatar,
      text: userMsg,
      time: 'Now',
      isUser: true
    }]);
    setChatMessageInput('');
    audio.playPop();

    setTimeout(() => {
      const chemQuotes = [
        "Are you reading my valence shell or something? ⚛️",
        "Let's combine carbon and oxygen to form instant shielding!",
        "Double bond carbon strings are highly reactive. Let's draft them first!",
        "Watch out for their transition metal catalysts, we need inert defenses!",
        "Understood. Let's form diatomic gases on turn 1!",
        "Agreed! I will draft Group 17 Fluorine to maximize ionization energy!"
      ];
      setLobbyChat(prev => [...prev, {
        sender: "Carbon Carla",
        avatar: "🧬",
        text: chemQuotes[Math.floor(Math.random() * chemQuotes.length)],
        time: 'Now'
      }]);
      audio.playSuccess();
    }, 1250);
  };

  const startNewGame = (typeVsBot: boolean) => {
    audio.playSuccess();
    setVsBot(typeVsBot);
    
    // Reset round wins and gameplay records
    isRoundTransitioningRef.current = false;
    setP1RoundWins(0);
    setP2RoundWins(0);
    setCurrentRound(1);
    setP1SynthesizedThisRound(false);
    setP2SynthesizedThisRound(false);
    setUsedElementNumbers([]);
    setSynthStage(1);
    setP1Cooldowns({});
    setP2Cooldowns({});
    setLastWinnerLineup(null);
    setShowWinnerLineupMenu(false);

    setPlayer1({ id: 1, name: p1ConfigName || 'Cyan Force', hp: 500, shield: 0, deck: [], compounds: [], score: 0 });
    setPlayer2({ 
      id: 2, 
      name: typeVsBot ? 'Doc Proton' : (p2ConfigName || 'Amber Glow'), 
      hp: 500, 
      shield: 0, 
      deck: [], 
      compounds: [], 
      score: 0,
      isBot: typeVsBot 
    });
    setUnclaimedElements(ELEMENTS_DB);
    setSideDeck([]);
    setClaimedBy({});
    setCurrentTurn(1);
    setPlayMode('draft');
    setBattleWinner(null);
    setP1IsStunned(false);
    setP2IsStunned(false);
    setBattleLog(['Periodic Table open. Choose an element card to claim!']);
  };

  // Handle starting a multiplayer game from the lobby
  const handleMultiplayerStart = (roomId: string, mode: RoomMode, roomPlayers: RoomPlayer[]) => {
    audio.playGrandCheer();
    setMultiplayerRoomId(roomId);
    setMultiplayerMode(mode);
    setShowMultiplayerLobby(false);
    setVsBot(false);

    const userPlayer = roomPlayers.find(p => p.user_id === userId);
    const opponent = roomPlayers.find(p => p.user_id !== userId);
    const userTeam = userPlayer?.team || 'cyan';
    const oppTeam = userTeam === 'cyan' ? 'amber' : 'cyan';

    setPlayer1({
      id: 1,
      name: userPlayer ? `Explorer ${userPlayer.user_id.slice(0, 4)}` : 'Cyan Force',
      hp: 500,
      shield: 0,
      deck: [],
      compounds: [],
      score: 0,
    });
    setPlayer2({
      id: 2,
      name: opponent ? `Explorer ${opponent.user_id.slice(0, 4)}` : 'Amber Glow',
      hp: 500,
      shield: 0,
      deck: [],
      compounds: [],
      score: 0,
    });

    isRoundTransitioningRef.current = false;
    setP1RoundWins(0);
    setP2RoundWins(0);
    setCurrentRound(1);
    setP1SynthesizedThisRound(false);
    setP2SynthesizedThisRound(false);
    setUsedElementNumbers([]);
    setSynthStage(1);
    setP1Cooldowns({});
    setP2Cooldowns({});
    setLastWinnerLineup(null);
    setShowWinnerLineupMenu(false);
    setUnclaimedElements(ELEMENTS_DB);
    setSideDeck([]);
    setClaimedBy({});
    setCurrentTurn(1);
    setPlayMode('draft');
    setBattleWinner(null);
    setP1IsStunned(false);
    setP2IsStunned(false);
    setBattleLog([`Multiplayer ${mode} battle! Periodic Table open. Choose an element card to claim!`]);
    progressQuest('q_play_online', 1);
  };

  // Handle Element Slot Clicks during Draft Stage
  const handleElementClick = (card: ElementCard, isSystemAction = false) => {
    if (activeQuizCard !== null || activeCourtsideCard !== null) {
      return; // Ignore clicks if a challenge is already active
    }
    if (usedElementNumbers.includes(card.number)) return;
    if (playMode === 'draft' && vsBot && currentTurn === 2 && !isSystemAction) {
      // Ignore user clicks on bot's turn
      return;
    }
    const owner = claimedBy[card.number];
    if (owner === 1 || owner === 2) return; // Card already claimed by player

    // Block drafting defensive elements if 2 non-attack elements already exist
    const pDeck = currentTurn === 1 ? player1.deck : player2.deck;
    const nonAttackCount = pDeck.filter(c => !isAttackCard(c)).length;
    if (nonAttackCount >= 2 && !isAttackCard(card)) {
      triggerToast("Table Restricted: You already have 2 defensive elements! Select an Attack element to ensure a balanced hand.");
      return;
    }

    if (owner === 'side') {
      audio.playPop();
      const eligible = getEligibleCourtsideRecipes(card, currentTurn);
      setActiveCourtsideCard(card);
      setCourtsideRecipes(eligible);
      if (eligible.length > 0) {
        setSelectedCourtsideRecipe(eligible[0]);
        setCourtsideStatus('prompt');
      } else {
        setSelectedCourtsideRecipe(null);
        setCourtsideStatus('failed');
      }
      setCourtsideInput('');
      setCourtsideAttempts(0);
      return;
    }

    audio.playPop();

    // Open quizzes modal
    setActiveQuizCard(card);
    setQuizInput('');
    setQuizAttempts(0);
    setQuizTurns(currentTurn); // current active player gets first attempt!
    setQuizStatus('prompt');
    setCorrectGuesser(null);
  };

  const getEligibleCourtsideRecipes = (card: ElementCard, playerId: 1 | 2) => {
    const p = playerId === 1 ? player1 : player2;
    return COMPOUND_RECIPES.filter(recipe => {
      const containsSymbol = recipe.required.some(req => req.symbol === card.symbol);
      if (!containsSymbol) return false;

      // Check if player has the OTHER required elements with correct quantities in their hand.
      let hasPartners = true;
      recipe.required.forEach(req => {
        if (req.symbol === card.symbol) {
          const neededFromDeck = req.qty - 1;
          const inDeck = p.deck.filter(el => el.symbol === req.symbol).length;
          if (inDeck < neededFromDeck) {
            hasPartners = false;
          }
        } else {
          const inDeck = p.deck.filter(el => el.symbol === req.symbol).length;
          if (inDeck < req.qty) {
            hasPartners = false;
          }
        }
      });
      return hasPartners;
    });
  };

  const handleCourtsideAnswer = () => {
    if (!selectedCourtsideRecipe || !activeCourtsideCard) return;

    const guessStr = courtsideInput.trim().toLowerCase();
    const correctNormal = selectedCourtsideRecipe.name.trim().toLowerCase();
    const correctFormula = selectedCourtsideRecipe.formula.trim().toLowerCase();
    const correctId = selectedCourtsideRecipe.id.trim().toLowerCase();

    const isMatch = guessStr === correctNormal || 
                    guessStr === correctFormula || 
                    guessStr === correctId ||
                    (selectedCourtsideRecipe.id === 'H2O' && guessStr === 'water') ||
                    (selectedCourtsideRecipe.id === 'NaCl' && (guessStr === 'salt' || guessStr === 'table salt')) ||
                    (selectedCourtsideRecipe.id === 'CO2' && guessStr === 'carbon dioxide') ||
                    (selectedCourtsideRecipe.id === 'CH4' && guessStr === 'methane') ||
                    (selectedCourtsideRecipe.id === 'HCl' && (guessStr === 'acid' || guessStr === 'hydrochloric acid')) ||
                    (selectedCourtsideRecipe.id === 'NaOH' && (guessStr === 'lye' || guessStr === 'sodium hydroxide'));

    if (isMatch) {
      audio.playSuccess();
      setCourtsideStatus('success');

      const activePlayerId = currentTurn;
      const p = activePlayerId === 1 ? player1 : player2;
      let updatedDeck = [...p.deck];

      selectedCourtsideRecipe.required.forEach(req => {
        const qtyToConsume = req.symbol === activeCourtsideCard.symbol ? req.qty - 1 : req.qty;
        for (let i = 0; i < qtyToConsume; i++) {
          const removeIdx = updatedDeck.findIndex(c => c.symbol === req.symbol);
          if (removeIdx !== -1) {
            updatedDeck.splice(removeIdx, 1);
          }
        }
      });

      if (activePlayerId === 1) {
        setPlayer1(prev => ({
          ...prev,
          deck: updatedDeck,
          compounds: [...prev.compounds, selectedCourtsideRecipe.id],
          score: prev.score + 150
        }));
      } else {
        setPlayer2(prev => ({
          ...prev,
          deck: updatedDeck,
          compounds: [...prev.compounds, selectedCourtsideRecipe.id],
          score: prev.score + 150
        }));
      }

      setClaimedBy(prev => ({ ...prev, [activeCourtsideCard.number]: activePlayerId }));
      setSideDeck(prev => prev.filter(c => c.number !== activeCourtsideCard.number));

      onAddStars(8);
      triggerToast(`Spectacular! Synthesized ${selectedCourtsideRecipe.name} (${selectedCourtsideRecipe.formula}) from Courtside! +150 score points.`);
    } else {
      audio.playPop();
      const nextAttempts = courtsideAttempts + 1;
      setCourtsideAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setCourtsideStatus('failed');
        triggerToast(`Out of attempts! Try checking your compound spelling or drafting other elements.`);
      } else {
        triggerToast(`Incorrect! Attempt ${nextAttempts} of 3. Try again!`);
      }
    }
  };

  const closeCourtsideModal = () => {
    setActiveCourtsideCard(null);
    setSelectedCourtsideRecipe(null);
    setCourtsideInput('');
    setCourtsideStatus('prompt');
    setCurrentTurn(prev => (prev === 1 ? 2 : 1));
  };

  // Skip Quiz directly for drafting (useful to bypass or simulate)
  const autoSolveQuiz = () => {
    if (!activeQuizCard) return;
    handleQuizAnswer(activeQuizCard.name.toUpperCase());
  };

  // Validate spelling of the Chemical Element
  const handleQuizAnswer = (customAns?: string) => {
    if (!activeQuizCard) return;
    const cleanAnswer = (customAns || quizInput).trim().toLowerCase();
    const correctNormalStr = activeQuizCard.name.trim().toLowerCase();

    const isMatch = cleanAnswer === correctNormalStr;
    const guesser = quizTurns;

    if (isMatch) {
      audio.playSuccess();
      setCorrectGuesser(guesser);
      setQuizStatus('success');

      // Update claiming player state
      const pointsScored = activeQuizCard.number * (difficulty === 'gamma' ? 12 : difficulty === 'beta' ? 8 : 5) + 50;
      
      setClaimedBy(prev => ({ ...prev, [activeQuizCard.number]: guesser }));

      if (guesser === 1) {
        setPlayer1(prev => ({
          ...prev,
          score: prev.score + pointsScored,
          deck: [...prev.deck, activeQuizCard]
        }));
        triggerToast(`Correct! ${activeQuizCard.name} joins ${p1ConfigName}'s hand. +${pointsScored} pts!`);
        if (activeQuizCard.category === 'noble') {
          progressQuest('q_draft_noble', 1);
        }
      } else {
        setPlayer2(prev => ({
          ...prev,
          score: prev.score + pointsScored,
          deck: [...prev.deck, activeQuizCard]
        }));
        triggerToast(`Correct! ${activeQuizCard.name} joins ${player2.name}'s hand. +${pointsScored} pts!`);
      }

      // Add tokens to overall explorer achievement!
      onAddStars(2);
    } else {
      audio.playPop(); // error buzz

      // If a player makes an incorrect guess, but the other player already has five cards, the card will automatically become unavailable.
      const otherPlayerId = guesser === 1 ? 2 : 1;
      const otherCardCount = otherPlayerId === 1 ? player1.deck.length : player2.deck.length;

      if (otherCardCount >= 5) {
        setQuizStatus('failed');
        setClaimedBy(prev => ({ ...prev, [activeQuizCard.number]: 'side' }));
        setSideDeck(prev => [...prev, activeQuizCard]);
        triggerToast(`Oops! Answer was incorrect. Since the other player already has 5 cards, this element automatically becomes unavailable and moves to courtside (unclaimed).`);
        return;
      }

      const nextAttemptCount = quizAttempts + 1;
      setQuizAttempts(nextAttemptCount);

      if (nextAttemptCount >= 3) {
        // Failed after 3 tries! Card goes to Side Deck (burnt)
        setQuizStatus('failed');
        setClaimedBy(prev => ({ ...prev, [activeQuizCard.number]: 'side' }));
        setSideDeck(prev => [...prev, activeQuizCard]);
        triggerToast(`Oops! Answer is ${activeQuizCard.name}. Card moves to courtside (unclaimed).`);
      } else {
        // Toggle turn to the other player
        const nextGuesser = guesser === 1 ? 2 : 1;
        setQuizTurns(nextGuesser);
        setQuizInput('');
        triggerToast(`Incorrect guess! Turn switches to ${nextGuesser === 1 ? 'Player 1' : 'Player 2'}!`);

        // If next guesser is bot, automatically generate a guess in Junior difficulty or simulated probability
        if (vsBot && nextGuesser === 2) {
          triggerBotDraftGuess();
        }
      }
    }
  };

  // Simulate computer bot guessing elements with typing simulation
  const triggerBotDraftGuess = () => {
    if (!activeQuizCard) return () => {};
    setIsBotThinking(true);
    setQuizInput('');
    setIsBotTyping(false);

    // Dynamic parameters based on Alpha, Beta, or Gamma difficulty settings
    const botDelay = difficulty === 'gamma' ? 450 : difficulty === 'beta' ? 850 : 1350;
    const isCorrectProb = difficulty === 'gamma' ? 0.94 : difficulty === 'beta' ? 0.82 : 0.70;

    // 1. Thinking phase where Doc Proton calculates
    const thinkTimer = setTimeout(() => {
      setIsBotThinking(false);
      setIsBotTyping(true);

      // Determine the word Doc Proton will type
      const isCorrect = Math.random() < isCorrectProb;
      const targetText = isCorrect 
        ? activeQuizCard.name 
        : (Math.random() < 0.5 ? "Neutronium" : "Unobtainium");

      let currentTyped = '';
      let charIndex = 0;

      // 2. Typing phase where keys are typed sequentially
      const typeInterval = setInterval(() => {
        if (charIndex < targetText.length) {
          currentTyped += targetText[charIndex];
          setQuizInput(currentTyped);
          charIndex++;
          audio.playPop(); // play small interface pop sound representing keystroke
        } else {
          clearInterval(typeInterval);
          
          // 3. Post-typing verification step
          const submitTimer = setTimeout(() => {
            setIsBotTyping(false);
            handleQuizAnswer(targetText);
          }, 150);
        }
      }, difficulty === 'gamma' ? 25 : difficulty === 'beta' ? 55 : 85);

    }, botDelay);

    return () => {
      clearTimeout(thinkTimer);
    };
  };

  const claimElementForBot = (card: ElementCard) => {
    const pointsScored = card.number * 8 + 50;
    
    setClaimedBy(prev => ({ ...prev, [card.number]: 2 }));
    
    setPlayer2(prev => ({
      ...prev,
      score: prev.score + pointsScored,
      deck: [...prev.deck, card]
    }));

    triggerToast(`Doc Proton drafted ${card.name} [${card.symbol}]!`);

    const p1Count = player1.deck.length;
    const p2Count = player2.deck.length + 1; // including the new one
    
    if (p1Count >= 5 && p2Count >= 5) {
      triggerToast("Superb! Both competitors have drafted 5 elements! Welcome to the Synthesis Lab.");
      setPlayMode('synthesis');
      return;
    }

    if (p1Count >= 5) {
      setCurrentTurn(2);
    } else {
      setCurrentTurn(1);
    }
  };

  const claimCourtsideForBot = (card: ElementCard) => {
    const eligible = getEligibleCourtsideRecipes(card, 2);
    if (eligible.length > 0) {
      const recipe = eligible[0];
      let updatedDeck = [...player2.deck];
      recipe.required.forEach(req => {
        const qtyToConsume = req.symbol === card.symbol ? req.qty - 1 : req.qty;
        for (let i = 0; i < qtyToConsume; i++) {
          const removeIdx = updatedDeck.findIndex(c => c.symbol === req.symbol);
          if (removeIdx !== -1) {
            updatedDeck.splice(removeIdx, 1);
          }
        }
      });

      setClaimedBy(prev => ({ ...prev, [card.number]: 2 }));
      setPlayer2(prev => ({
        ...prev,
        deck: updatedDeck,
        compounds: [...prev.compounds, recipe.id],
        score: prev.score + 150
      }));

      setSideDeck(prev => prev.filter(c => c.number !== card.number));
      triggerToast(`Doc Proton reclaimed side-deck element ${card.name}, synthesizing ${recipe.name}!`);
    } else {
      setClaimedBy(prev => ({ ...prev, [card.number]: 'burnt' }));
      setSideDeck(prev => prev.filter(c => c.number !== card.number));
      triggerToast(`Doc Proton tried to reclaim ${card.name} but lacked chemistry parameters.`);
    }

    const p1Count = player1.deck.length;
    const p2Count = player2.deck.length;
    if (p1Count >= 5 && p2Count >= 5) {
      setPlayMode('synthesis');
    } else if (p1Count >= 5) {
      setCurrentTurn(2);
    } else {
      setCurrentTurn(1);
    }
  };

  const closeQuizModal = () => {
    setActiveQuizCard(null);
    setQuizInput('');

    const p1Count = player1.deck.length;
    const p2Count = player2.deck.length;
    if (p1Count >= 5 && p2Count >= 5) {
      triggerToast("Superb! Both competitors have drafted 5 elements! Welcome to the Synthesis Lab.");
      setPlayMode('synthesis');
      return;
    }

    if (p1Count >= 5) {
      setCurrentTurn(2);
    } else if (p2Count >= 5) {
      setCurrentTurn(1);
    } else {
      setCurrentTurn(quizTurns === 1 ? 2 : 1);
    }

    const claimedCount = Object.keys(claimedBy).length;
    if (claimedCount >= 10 || claimedCount >= unclaimedElements.length) {
      triggerToast("Amazing! Chemical drafting is complete. Welcome to the Battle Arena!");
      setPlayMode('synthesis');
    }
  };

  // Formula Synthesis Crafting room
  const synthesizeCompound = (recipe: CompoundRecipe, playerId: 1 | 2) => {
    // 1 compound per player per round limit check
    if (playerId === 1 && p1SynthesizedThisRound) {
      triggerToast("You can only synthesize one compound per round in our laboratory!");
      return;
    }
    if (playerId === 2 && p2SynthesizedThisRound) {
      triggerToast(`${player2.name} can only synthesize one compound per round!`);
      return;
    }

    const p = playerId === 1 ? player1 : player2;
    
    // Check if player has all materials (elements) required
    let materialsOk = true;
    const deckCopy = [...p.deck];
    const cardsToRemoveIds: string[] = [];

    recipe.required.forEach(req => {
      const matchInDeck = deckCopy.filter(card => card.symbol === req.symbol);
      if (matchInDeck.length < req.qty) {
        materialsOk = false;
      }
    });

    if (!materialsOk) {
      triggerToast(`Missing required elements for ${recipe.name}! Check chemical formulas requested.`);
      return;
    }

    if (!leadsToAtLeastThreeAttacks(p, recipe)) {
      triggerToast(`Synthesis Blocked: Synthesizing ${recipe.name} would leave you with less than 3 attack cards (elements + compounds), stalling the duel!`);
      return;
    }

    // Material consumption (remove atomic cards)
    let updatedDeck = [...p.deck];
    recipe.required.forEach(req => {
      for (let i = 0; i < req.qty; i++) {
        const removeIdx = updatedDeck.findIndex(card => card.symbol === req.symbol);
        if (removeIdx !== -1) {
          updatedDeck.splice(removeIdx, 1);
        }
      }
    });

    audio.playSuccess();
    let isP1Ready = playerId === 1 ? true : p1SynthesizedThisRound;
    let isP2Ready = playerId === 2 ? true : p2SynthesizedThisRound;

    if (playerId === 1) {
      setP1SynthesizedThisRound(true);
      setPlayer1(prev => ({
        ...prev,
        deck: updatedDeck,
        compounds: [...prev.compounds, recipe.id],
        score: prev.score + 100
      }));
      setCreatedCompounds(prev => {
        const formula = recipe.id;
        const next = prev.includes(formula) ? prev : [...prev, formula];
        localStorage.setItem('tt_created_compounds', JSON.stringify(next));
        return next;
      });
      progressQuest('q_synthesize_two', 1);
    } else {
      setP2SynthesizedThisRound(true);
      setPlayer2(prev => ({
        ...prev,
        deck: updatedDeck,
        compounds: [...prev.compounds, recipe.id],
        score: prev.score + 100
      }));
    }

    onAddStars(5);
    triggerToast(`Synthesis Succesful! ${recipe.name} (${recipe.formula}) spell created! +100 score points.`);

    if (isP1Ready && isP2Ready) {
      setTimeout(() => {
        setPlayMode('battle');
        setBattleLog(["Both players have synthesized 1 compound! Proceeding to the Atomic Arena!", "Use cards in hand to cast elemental reactions."]);
        setPlayer1(p1 => {
          setPlayer2(p2 => {
            setP1InitialLineup({ elements: [...p1.deck], compounds: [...p1.compounds] });
            setP2InitialLineup({ elements: [...p2.deck], compounds: [...p2.compounds] });
            return p2;
          });
          return p1;
        });
      }, 1500);
    }
  };

  // Helper to handle round endings under turn-based rules
  const handleRoundEnd = (winnerId: 1 | 2) => {
    if (isRoundTransitioningRef.current) return;
    isRoundTransitioningRef.current = true;

    const winPlayerName = winnerId === 1 ? player1.name : player2.name;
    const initialLineup = winnerId === 1 ? p1InitialLineup : p2InitialLineup;

    setLastWinnerLineup({
      playerName: winPlayerName,
      elements: [...initialLineup.elements],
      compounds: [...initialLineup.compounds]
    });

    let nextP1Wins = p1RoundWins;
    let nextP2Wins = p2RoundWins;
    if (winnerId === 1) {
      nextP1Wins += 1;
      setP1RoundWins(nextP1Wins);
    } else {
      nextP2Wins += 1;
      setP2RoundWins(nextP2Wins);
    }

    audio.playSuccess();

    // Carry over elements and compounds that WERE NOT used in combat!
    const p1CarriedElements = player1.deck.filter(el => !p1UsedIds.includes(`el-${el.number}`));
    const p1CarriedCompounds = player1.compounds.filter(cId => !p1UsedIds.includes(`comp-${cId}`));

    const p2CarriedElements = player2.deck.filter(el => !p2UsedIds.includes(`el-${el.number}`));
    const p2CarriedCompounds = player2.compounds.filter(cId => !p2UsedIds.includes(`comp-${cId}`));

    if (currentRound >= 5) {
      // Game officially ends! Report final overall winner
      setPlayMode('ended');
      const finalWinner = nextP1Wins > nextP2Wins ? 1 : nextP1Wins < nextP2Wins ? 2 : winnerId;
      setBattleWinner(finalWinner);

      // Award XP & quest ticks
      if (isMonthlyChallenge) {
        if (finalWinner === 1) {
          setMonthlyChallengeDefeated(true);
          localStorage.setItem('tt_monthly_defeated', 'true');
          setUserXP(prev => prev + 300);
          triggerToast("🏆 MONTHLY BOT DEFEATED! You successfully outperformed Dr. Quark and capitalized on 300 XP!");
        } else {
          triggerToast("Dr. Quark won this battle. Combine elements smartly and challenge him again!");
        }
        setIsMonthlyChallenge(false);
      } else if (finalWinner === 1) {
        const isLobbyDuel = player2.name.includes('PVP') || player2.name.includes('Team');
        if (isLobbyDuel) {
          const isTeam = player2.name.includes('Team');
          const xpGain = isTeam ? 250 : 150;
          setUserXP(prev => prev + xpGain);
          triggerToast(`👑 PvP VICTORY! Earned +${xpGain} XP!`);
          if (isTeam) {
            progressQuest('q_win_team_weekly', 1);
          }
        } else {
          // Standard offline practice against Doc Proton
          setUserXP(prev => prev + 30);
          triggerToast(`🧪 Practice Completed! Earned +30 XP.`);
        }
      } else {
        const isLobbyDuel = player2.name.includes('PVP') || player2.name.includes('Team');
        if (isLobbyDuel) {
          const xpGain = player2.name.includes('Team') ? 100 : 50;
          setUserXP(prev => prev + xpGain);
          triggerToast(`🛡️ Defeat. Valiant effort! Earned +${xpGain} XP.`);
        } else {
          setUserXP(prev => prev + 10);
          triggerToast(`🧪 Practice Completed! Earned +10 XP.`);
        }
      }
    } else {
      // Start another round!
      triggerToast(`Round ${currentRound} complete! ${winPlayerName} won the round! Unused atomic cards successfully carried over.`);
      
      // Reset players lists, HP (regenerates) and shield
      setPlayer1(prev => ({
        ...prev,
        deck: p1CarriedElements,
        compounds: p1CarriedCompounds,
        hp: 500,
        shield: 0
      }));
      setPlayer2(prev => ({
        ...prev,
        deck: p2CarriedElements,
        compounds: p2CarriedCompounds,
        hp: 500,
        shield: 0
      }));

      // Reset selection boards
      setClaimedBy({});
      setUsedElementNumbers([]); // Clear this array so the entire periodic table completely refreshes each round with all elements available
      setCurrentTurn(1);
      setSynthStage(1);
      setP1SynthesizedThisRound(false);
      setP2SynthesizedThisRound(false);

      // Reset stuns/cooldowns
      setP1IsStunned(false);
      setP2IsStunned(false);
      setP1Cooldowns({});
      setP2Cooldowns({});

      // Reset track use arrays
      setP1UsedIds([]);
      setP2UsedIds([]);
      
      setCurrentRound(prev => prev + 1);
      setPlayMode('draft'); // Back to periodic table drafting
      isRoundTransitioningRef.current = false;
    }
  };

  // Clash Arena Action Execution
  const executeCombatMove = (itemType: 'element' | 'compound', itemId: string | number) => {
    if (playMode !== 'battle') return;
    const activePlayerId = currentTurn;
    const opponentPlayerId = activePlayerId === 1 ? 2 : 1;

    // Check stun states
    if (activePlayerId === 1 && p1IsStunned) {
      setP1IsStunned(false);
      setBattleLog(prev => [`Player 1 was frozen this turn! Shaking ice off...`, ...prev]);
      setCurrentTurn(2);
      triggerBotBattleTurnShortcut();
      return;
    }
    if (activePlayerId === 2 && p2IsStunned) {
      setP2IsStunned(false);
      setBattleLog(prev => [`Player 2 was frozen this turn! Shaking ice off...`, ...prev]);
      setCurrentTurn(1);
      return;
    }

    // Cooldown gatekeeping
    const isCD = activePlayerId === 1 
      ? (p1Cooldowns[itemType === 'element' ? `el-${itemId}` : `comp-${itemId}`] || 0) > 0
      : (p2Cooldowns[itemType === 'element' ? `el-${itemId}` : `comp-${itemId}`] || 0) > 0;
    if (isCD) {
      triggerToast("This attack is currently on Cooldown!");
      return;
    }

    // Set item on cooldown (Elements = 2 turns, Compounds = 3 turns)
    if (activePlayerId === 1) {
      setP1Cooldowns(prev => ({
        ...prev,
        [itemType === 'element' ? `el-${itemId}` : `comp-${itemId}`]: itemType === 'element' ? 2 : 3
      }));
    } else {
      setP2Cooldowns(prev => ({
        ...prev,
        [itemType === 'element' ? `el-${itemId}` : `comp-${itemId}`]: itemType === 'element' ? 2 : 3
      }));
    }

    audio.playPop();

    let effectLabel = "";
    let actionLog = "";
    let effectType: 'damage' | 'shield' | 'heal' | 'stun' | 'evade' | 'clear' = 'damage';
    let powerValue = 0;

    if (itemType === 'element') {
      const card = ELEMENTS_DB.find(el => el.number === itemId);
      if (!card) return;
      effectLabel = card.powerup.name;
      effectType = card.powerup.effect;
      powerValue = card.powerup.value;
      actionLog = `${currentTurn === 1 ? player1.name : player2.name} plays element ${card.name} [${card.symbol}] and casts "${effectLabel}"!`;

      // Record item usage instead of removing from hand
      if (activePlayerId === 1) {
        setP1UsedIds(prev => [...prev, `el-${itemId}`]);
      } else {
        setP2UsedIds(prev => [...prev, `el-${itemId}`]);
      }
    } else {
      const comp = COMPOUND_RECIPES.find(c => c.id === itemId);
      if (!comp) return;
      effectLabel = comp.powerup.name;
      effectType = comp.powerup.effect;
      powerValue = comp.powerup.value;
      actionLog = `${currentTurn === 1 ? player1.name : player2.name} detonates synthesized compound ${comp.name} (${comp.formula}) casting "${effectLabel}"!`;

      // Record item usage instead of removing from compounds list
      if (activePlayerId === 1) {
        setP1UsedIds(prev => [...prev, `comp-${itemId}`]);
      } else {
        setP2UsedIds(prev => [...prev, `comp-${itemId}`]);
      }
    }

    // Set kinetic visual effect
    const actP = activePlayerId === 1 ? player1 : player2;
    const oppP = opponentPlayerId === 1 ? player1 : player2;
    let cardTitle = "";
    let cardSym = "";
    let isC = false;

    if (itemType === 'element') {
      const card = ELEMENTS_DB.find(el => el.number === itemId);
      if (card) {
        cardTitle = card.name;
        cardSym = card.symbol;
      }
    } else {
      const comp = COMPOUND_RECIPES.find(c => c.id === itemId);
      if (comp) {
        cardTitle = comp.name;
        cardSym = comp.formula;
        isC = true;
      }
    }

    setActiveStrikeEffect({
      cardName: cardTitle,
      powerupName: effectLabel,
      effectType,
      value: powerValue,
      symbol: cardSym,
      sourceName: actP.name,
      targetName: oppP.name,
      isCompound: isC
    });

    if (effectType === 'damage') {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 550);
    }

    setTimeout(() => {
      setActiveStrikeEffect(null);
    }, 1700);

    // Process Science combat modifiers
    let finalLog = actionLog;
    let damageDealt = 0;
    let hHeals = 0;
    let sShields = 0;

    if (effectType === 'damage') {
      const activeOppo = opponentPlayerId === 1 ? player1 : player2;
      let rawDamage = powerValue;

      // Track shield damage for Player 1
      if (activePlayerId === 1 && activeOppo.shield > 0) {
        const shieldDamage = Math.min(activeOppo.shield, rawDamage);
        progressQuest('q_melt_shields_weekly', shieldDamage);
      }

      // Deduct from shield first
      if (activeOppo.shield > 0) {
        if (activeOppo.shield >= rawDamage) {
          if (opponentPlayerId === 1) {
            setPlayer1(prev => ({ ...prev, shield: prev.shield - rawDamage }));
          } else {
            setPlayer2(prev => ({ ...prev, shield: prev.shield - rawDamage }));
          }
          finalLog += ` Shield absorbed all ${rawDamage} damage!`;
        } else {
          const bleedDamage = rawDamage - activeOppo.shield;
          if (opponentPlayerId === 1) {
            setPlayer1(prev => ({ ...prev, shield: 0, hp: Math.max(0, prev.hp - bleedDamage) }));
          } else {
            setPlayer2(prev => ({ ...prev, shield: 0, hp: Math.max(0, prev.hp - bleedDamage) }));
          }
          finalLog += ` Shatters shield! Dealt ${bleedDamage} raw damage to health.`;
        }
      } else {
        if (opponentPlayerId === 1) {
          setPlayer1(prev => ({ ...prev, hp: Math.max(0, prev.hp - rawDamage) }));
        } else {
          setPlayer2(prev => ({ ...prev, hp: Math.max(0, prev.hp - rawDamage) }));
        }
        finalLog += ` Dealt ${rawDamage} direct fire damage!`;
      }
    } else if (effectType === 'shield') {
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, shield: prev.shield + powerValue }));
      } else {
        setPlayer2(prev => ({ ...prev, shield: prev.shield + powerValue }));
      }
      finalLog += ` Hardened cellular barriers! +${powerValue} Shield points.`;
    } else if (effectType === 'heal') {
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, hp: Math.min(500, prev.hp + powerValue) }));
      } else {
        setPlayer2(prev => ({ ...prev, hp: Math.min(500, prev.hp + powerValue) }));
      }
      finalLog += ` Alchemical restoration complete! Healed +${powerValue} HP.`;
    } else if (effectType === 'stun') {
      if (opponentPlayerId === 1) {
        setP1IsStunned(true);
      } else {
        setP2IsStunned(true);
      }
      finalLog += ` Opponent is frozen in solid high-density molecular crystal space! Stunned for 1 turn.`;
    } else if (effectType === 'evade') {
      // Evasion behaves as a quick 40 HP defense cell on the spot
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, shield: prev.shield + 40 }));
      } else {
        setPlayer2(prev => ({ ...prev, shield: prev.shield + 40 }));
      }
      finalLog += ` Vaporized particles! Evaded damage and got +40 HP protective cover.`;
    }

    setBattleLog(prev => [finalLog, ...prev]);
    setSelectedSpell(null);

    // Turn Check & Death state evaluation
    setTimeout(() => {
      setPlayer1(p1 => {
        setPlayer2(p2 => {
          if (p1.hp <= 0) {
            if (!isRoundTransitioningRef.current) {
              handleRoundEnd(2);
            }
            return p2;
          }
          if (p2.hp <= 0) {
            if (!isRoundTransitioningRef.current) {
              handleRoundEnd(1);
            }
            return p2;
          }

          // Check if hand elements or compounds are exhausted for replenishment
          const p1Replenished = p1.deck.length === 0 && p1.compounds.length === 0;
          const p2Replenished = p2.deck.length === 0 && p2.compounds.length === 0;

          if (p1Replenished) {
            triggerToast("Player 1 has exhausted all cards! Hand cards are Replenished!");
            setTimeout(() => {
              setPlayer1(prev => ({ ...prev, deck: [...p1InitialLineup.elements], compounds: [...p1InitialLineup.compounds] }));
            }, 0);
          }
          if (p2Replenished) {
            triggerToast(`${player2.name} has exhausted all cards! Hand cards are Replenished!`);
            setTimeout(() => {
              setPlayer2(prev => ({ ...prev, deck: [...p2InitialLineup.elements], compounds: [...p2InitialLineup.compounds] }));
            }, 0);
          }

          // Move turn forward
          setCurrentTurn(opponentPlayerId as 1 | 2);
          return p2;
        });
        return p1;
      });
    }, 450);
  };

  // Direct skip turn / recharge energy move
  const triggerRecharge = () => {
    const activeId = currentTurn;
    audio.playPop();
    if (activeId === 1) {
      setPlayer1(prev => ({ ...prev, shield: prev.shield + 30, hp: Math.min(500, prev.hp + 10) }));
      setBattleLog(prev => ["Player 1 recharged ionic capacitors! Recalculated +30 Shield, +10 HP.", ...prev]);
    } else {
      setPlayer2(prev => ({ ...prev, shield: prev.shield + 30, hp: Math.min(500, prev.hp + 10) }));
      setBattleLog(prev => ["Player 2 recharged ionic capacitors! Recalculated +30 Shield, +10 HP.", ...prev]);
    }
    setCurrentTurn(activeId === 1 ? 2 : 1);
  };

  const skipTurn = () => {
    const activeId = currentTurn;
    audio.playPop();
    const activeName = activeId === 1 ? player1.name : player2.name;
    setBattleLog(prev => [`${activeName} skipped their turn, letting the opponent make the next move!`, ...prev]);
    setCurrentTurn(activeId === 1 ? 2 : 1);
  };

  // Execute live fused compound attack during combat
  const executeCombinationAttackDirectly = (recipe: CompoundRecipe, activePlayerId: 1 | 2) => {
    const opponentPlayerId = activePlayerId === 1 ? 2 : 1;

    // Check stun states
    if (activePlayerId === 1 && p1IsStunned) {
      setP1IsStunned(false);
      setBattleLog(prev => [`Player 1 was frozen this turn! Shaking ice off...`, ...prev]);
      setCurrentTurn(2);
      triggerBotBattleTurnShortcut();
      return;
    }
    if (activePlayerId === 2 && p2IsStunned) {
      setP2IsStunned(false);
      setBattleLog(prev => [`Player 2 was frozen this turn! Shaking ice off...`, ...prev]);
      setCurrentTurn(1);
      return;
    }

    // 1. Remove the constituent elements from the active player's deck
    const p = activePlayerId === 1 ? player1 : player2;
    let updatedDeck = [...p.deck];
    
    recipe.required.forEach(req => {
      for (let i = 0; i < req.qty; i++) {
        const removeIdx = updatedDeck.findIndex(card => card.symbol === req.symbol);
        if (removeIdx !== -1) {
          updatedDeck.splice(removeIdx, 1);
        }
      }
    });

    if (activePlayerId === 1) {
      setPlayer1(prev => ({ ...prev, deck: updatedDeck }));
    } else {
      setPlayer2(prev => ({ ...prev, deck: updatedDeck }));
    }

    audio.playSuccess();

    // 2. Apply compound casting effect
    const effectLabel = recipe.powerup.name;
    const effectType = recipe.powerup.effect;
    const powerValue = recipe.powerup.value;
    let actionLog = `${activePlayerId === 1 ? player1.name : player2.name} fuses elements live to synthesize and detonate ${recipe.name} (${recipe.formula})! Casting "${effectLabel}"!`;

    // Process combat modifiers
    let finalLog = actionLog;

    if (effectType === 'damage') {
      const activeOppo = opponentPlayerId === 1 ? player1 : player2;
      let rawDamage = powerValue;

      if (activeOppo.shield > 0) {
        if (activeOppo.shield >= rawDamage) {
          if (opponentPlayerId === 1) {
            setPlayer1(prev => ({ ...prev, shield: prev.shield - rawDamage }));
          } else {
            setPlayer2(prev => ({ ...prev, shield: prev.shield - rawDamage }));
          }
          finalLog += ` Shield absorbed all ${rawDamage} damage!`;
        } else {
          const bleedDamage = rawDamage - activeOppo.shield;
          if (opponentPlayerId === 1) {
            setPlayer1(prev => ({ ...prev, shield: 0, hp: Math.max(0, prev.hp - bleedDamage) }));
          } else {
            setPlayer2(prev => ({ ...prev, shield: 0, hp: Math.max(0, prev.hp - bleedDamage) }));
          }
          finalLog += ` Shatters shield! Dealt ${bleedDamage} raw damage to health.`;
        }
      } else {
        if (opponentPlayerId === 1) {
          setPlayer1(prev => ({ ...prev, hp: Math.max(0, prev.hp - rawDamage) }));
        } else {
          setPlayer2(prev => ({ ...prev, hp: Math.max(0, prev.hp - rawDamage) }));
        }
        finalLog += ` Dealt ${rawDamage} direct fire damage!`;
      }
    } else if (effectType === 'shield') {
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, shield: prev.shield + powerValue }));
      } else {
        setPlayer2(prev => ({ ...prev, shield: prev.shield + powerValue }));
      }
      finalLog += ` Hardened cellular barriers! +${powerValue} Shield points.`;
    } else if (effectType === 'heal') {
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, hp: Math.min(500, prev.hp + powerValue) }));
      } else {
        setPlayer2(prev => ({ ...prev, hp: Math.min(500, prev.hp + powerValue) }));
      }
      finalLog += ` Alchemical restoration complete! Healed +${powerValue} HP.`;
    } else if (effectType === 'stun') {
      if (opponentPlayerId === 1) {
        setP1IsStunned(true);
      } else {
        setP2IsStunned(true);
      }
      finalLog += ` Opponent is frozen in solid high-density molecular crystal space! Stunned for 1 turn.`;
    } else if (effectType === 'clear') {
      if (activePlayerId === 1) {
        setPlayer1(prev => ({ ...prev, shield: prev.shield + 40 }));
      } else {
        setPlayer2(prev => ({ ...prev, shield: prev.shield + 40 }));
      }
      finalLog += ` Vaporized particles! Evaded damage and got +40 HP protective cover.`;
    }

    setBattleLog(prev => [finalLog, ...prev]);

     // Check Death state evaluation
     setTimeout(() => {
       setPlayer1(p1 => {
         setPlayer2(p2 => {
           if (p1.hp <= 0) {
             if (!isRoundTransitioningRef.current) {
               handleRoundEnd(2);
             }
             return p2;
           }
           if (p2.hp <= 0) {
             if (!isRoundTransitioningRef.current) {
               handleRoundEnd(1);
             }
             return p2;
           }
           
           // Check if hand elements or compounds are exhausted for replenishment
           const p1Replenished = p1.deck.length === 0 && p1.compounds.length === 0;
           const p2Replenished = p2.deck.length === 0 && p2.compounds.length === 0;

           if (p1Replenished) {
             triggerToast("Player 1 has exhausted all cards! Hand cards are Replenished!");
             setTimeout(() => {
               setPlayer1(prev => ({ ...prev, deck: [...p1InitialLineup.elements], compounds: [...p1InitialLineup.compounds] }));
             }, 0);
           }
           if (p2Replenished) {
             triggerToast(`${player2.name} has exhausted all cards! Hand cards are Replenished!`);
             setTimeout(() => {
               setPlayer2(prev => ({ ...prev, deck: [...p2InitialLineup.elements], compounds: [...p2InitialLineup.compounds] }));
             }, 0);
           }

           const nextTurnId = opponentPlayerId as 1 | 2;
           setCurrentTurn(nextTurnId);
           return p2;
         });
         return p1;
       });
     }, 450);
  };

  // Bot combat turn AI
  const triggerBotBattleTurnShortcut = () => {
    if (!vsBot || currentTurn !== 2 || playMode !== 'battle' || isBotThinking) return;

    setIsBotThinking(true);
    const timer = setTimeout(() => {
      setIsBotThinking(false);
      
      const bDeck = player2.deck;
      const bComps = player2.compounds;

      // Filter out elements and compounds that are currently on cooldown for player 2
      const playableCards = bDeck.filter(card => !(p2Cooldowns[`el-${card.number}`] > 0));
      const playableComps = bComps.filter(cId => !(p2Cooldowns[`comp-${cId}`] > 0));

      // 1. Check if the bot has pre-synthesized compounds in inventory (70% chance to play)
      if (playableComps.length > 0 && Math.random() < 0.7) {
        const randomCompId = playableComps[Math.floor(Math.random() * playableComps.length)];
        executeCombatMove('compound', randomCompId);
        return;
      }

      // 2. Check if the bot can craft & play a live combo using elements in its current hand (Priority)
      if (playableCards.length > 0) {
        let formedCombo = false;
        for (const recipe of COMPOUND_RECIPES) {
          let canAfford = true;
          recipe.required.forEach(req => {
            const qtyOwned = playableCards.filter(el => el.symbol === req.symbol).length;
            if (qtyOwned < req.qty) {
              canAfford = false;
            }
          });

          if (canAfford) {
            executeCombinationAttackDirectly(recipe, 2);
            formedCombo = true;
            break;
          }
        }

        if (formedCombo) return;

        // 3. Otherwise, play the strongest single element card
        const sortedDeck = [...playableCards].sort((a, b) => b.powerup.value - a.powerup.value);
        const bestCard = sortedDeck[0];
        if (bestCard) {
          executeCombatMove('element', bestCard.number);
        } else {
          triggerRecharge();
        }
      } else {
        // 4. If no cards in hand, perform ionic recharge!
        triggerRecharge();
      }
    }, 1200);

    return () => clearTimeout(timer);
  };

  // 1. Battle Stage bot turn
  useEffect(() => {
    if (playMode === 'battle' && vsBot && currentTurn === 2 && !isBotThinkingRef.current) {
      const cleanup = triggerBotBattleTurnShortcut();
      if (cleanup) return cleanup;
    }
  }, [currentTurn, playMode, vsBot]);

  // 1b. Automated bot synthesis of compounds during Synthesis Lab stage
  useEffect(() => {
    if (playMode === 'synthesis' && vsBot && !isBotThinkingRef.current && !p2SynthesizedThisRound) {
      // Find any compound recipe that the bot has materials for in its hand (deck)
      const botDeck = player2.deck;
      let craftableRecipe = COMPOUND_RECIPES.find(recipe => {
        const hasMaterials = recipe.required.every(req => {
          const ownedCount = botDeck.filter(el => el.symbol === req.symbol).length;
          return ownedCount >= req.qty;
        });
        return hasMaterials && leadsToAtLeastThreeAttacks(player2, recipe);
      });

      // Fallback: if no recipe matches, choose a recipe that maintains attack cards, or first index
      if (!craftableRecipe && COMPOUND_RECIPES.length > 0) {
        craftableRecipe = COMPOUND_RECIPES.find(recipe => leadsToAtLeastThreeAttacks(player2, recipe)) || COMPOUND_RECIPES[0];
      }

      if (craftableRecipe) {
        setIsBotThinking(true);
        const timer = setTimeout(() => {
          setIsBotThinking(false);
          synthesizeCompound(craftableRecipe!, 2);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [playMode, vsBot, player2.deck, p2SynthesizedThisRound]);

  // 2. Draft Stage bot auto-selection & deck limit checking to advance to Battle Arena
  useEffect(() => {
    // A. Keep verifying if both players reached 5 elements and auto-transition to Synthesis
    if (playMode === 'draft') {
      const p1Count = player1.deck.length;
      const p2Count = player2.deck.length;
      if (p1Count >= 5 && p2Count >= 5) {
        setActiveQuizCard(null);
        setActiveCourtsideCard(null);
        triggerToast("Superb! Both competitors have drafted 5 elements! Welcome to the Synthesis Lab.");
        setPlayMode('synthesis');
        return;
      }
    }

    // B. Automated element card selection on Bot's or Simulated opponent's draft turn
    if (playMode === 'draft' && currentTurn === 2 && !activeQuizCard && !activeCourtsideCard && !isBotThinkingRef.current && !isBotTypingRef.current) {
      // Prioritize reclaiming Side Deck elements if eligible
      const reclaimable = sideDeck.filter(card => getEligibleCourtsideRecipes(card, 2).length > 0);
      if (reclaimable.length > 0 && Math.random() < 0.9) {
        setIsBotThinking(true);
        const timer = setTimeout(() => {
          setIsBotThinking(false);
          const chosenCard = reclaimable[0];
          claimCourtsideForBot(chosenCard);
        }, 600);
        return () => clearTimeout(timer);
      }

      // Otherwise, draft a standard unclaimed card
      const botNonAttackCount = player2.deck.filter(c => !isAttackCard(c)).length;
      const unclaimed = unclaimedElements.filter(el => {
        if (claimedBy[el.number]) return false;
        if (botNonAttackCount >= 2 && !isAttackCard(el)) return false;
        return true;
      });
      if (unclaimed.length > 0) {
        setIsBotThinking(true);
        const timer = setTimeout(() => {
          setIsBotThinking(false);
          const randomCard = unclaimed[Math.floor(Math.random() * unclaimed.length)];
          
          // Fast-progress quest q_draft_noble if they draft one (simulation helper)
          if (randomCard.category === 'noble') {
            // Checked noble gas
          }
          
          claimElementForBot(randomCard);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [playMode, vsBot, currentTurn, activeQuizCard, activeCourtsideCard, claimedBy, player1.deck.length, player2.deck.length, sideDeck, unclaimedElements]);

  // 3. Automated bot guessing in quiz modal
  useEffect(() => {
    if (playMode === 'draft' && vsBot && activeQuizCard && quizTurns === 2 && quizStatus === 'prompt' && !isBotThinkingRef.current && !isBotTypingRef.current) {
      const cleanUp = triggerBotDraftGuess();
      return () => {
        if (cleanUp) cleanUp();
      };
    }
  }, [playMode, vsBot, activeQuizCard?.number, quizTurns, quizStatus]);

  // Animated courtside guessing & solving helper for Doc Proton
  useEffect(() => {
    if (playMode === 'draft' && vsBot && activeCourtsideCard && currentTurn === 2 && courtsideStatus === 'prompt' && !isBotThinkingRef.current && !isBotTypingRef.current) {
      // Auto-select first eligible recipe if not chosen yet
      if (!selectedCourtsideRecipe && courtsideRecipes.length > 0) {
        setSelectedCourtsideRecipe(courtsideRecipes[0]);
        return;
      }

      if (selectedCourtsideRecipe) {
        setIsBotThinking(true);
        const thinkTimer = setTimeout(() => {
          setIsBotThinking(false);
          setIsBotTyping(true);

          const answerText = selectedCourtsideRecipe.name;
          let currentTyped = '';
          let charIndex = 0;

          const typeInterval = setInterval(() => {
            if (charIndex < answerText.length) {
              currentTyped += answerText[charIndex];
              setCourtsideInput(currentTyped);
              charIndex++;
              audio.playPop();
            } else {
              clearInterval(typeInterval);
              const submitTimer = setTimeout(() => {
                setIsBotTyping(false);
                handleCourtsideAnswer();
              }, 200);
            }
          }, Math.max(40, Math.min(90, 800 / answerText.length)));
        }, 400);

        return () => clearTimeout(thinkTimer);
      }
    }
  }, [playMode, vsBot, activeCourtsideCard, currentTurn, courtsideStatus, selectedCourtsideRecipe, courtsideRecipes]);

  // Automated courtside modal auto-closing for Doc Proton
  useEffect(() => {
    if (playMode === 'draft' && vsBot && activeCourtsideCard && currentTurn === 2 && (courtsideStatus === 'success' || courtsideStatus === 'failed')) {
      const timer = setTimeout(() => {
        closeCourtsideModal();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [playMode, vsBot, activeCourtsideCard, currentTurn, courtsideStatus]);

  // 4. Automated modal closing for Bot's correct guessing or overall failure
  useEffect(() => {
    if (vsBot && activeQuizCard && (quizStatus === 'success' || quizStatus === 'failed')) {
      if (correctGuesser === 2 || quizStatus === 'failed') {
        const timer = setTimeout(() => {
          closeQuizModal();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [vsBot, activeQuizCard?.number, quizStatus, correctGuesser]);

  // Decrement remaining cooldown ticks when the active player's turn starts
  useEffect(() => {
    if (playMode === 'battle') {
      if (currentTurn === 1) {
        setP1Cooldowns(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
            if (next[key] > 0) {
              next[key] = next[key] - 1;
            }
          });
          return next;
        });
      } else {
        setP2Cooldowns(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
            if (next[key] > 0) {
              next[key] = next[key] - 1;
            }
          });
          return next;
        });
      }
    }
  }, [currentTurn, playMode]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-cyan-500/20 px-4 py-6 relative">
      
      {/* Absolute click blocker layer during Doc Proton's turn */}
      {vsBot && (isBotThinking || isBotTyping) && (
        <div 
          className="fixed inset-0 z-[9999] bg-transparent cursor-wait"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      {/* Sci-Fi Ambient Glass Overlay backdrop (White/Cyan Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-200/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating high-priority science notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-8 z-50 flex items-center gap-3 bg-white border-2 border-cyan-400 p-4 rounded-2xl shadow-xl max-w-md cursor-pointer"
            onClick={() => setToastMessage(null)}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <p className="text-sm font-black text-slate-800 leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= HIGH-IMPACT COMBAT ANIMATION OVERLAY ========================================= */}
      <AnimatePresence>
        {activeStrikeEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-xs select-none"
          >
            {/* Radial Core Flare */}
            <motion.div 
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{ scale: [0.6, 1.4, 1.1], opacity: [0.5, 0.8, 0.45], rotate: [0, 90, 180] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`absolute w-[500px] h-[500px] rounded-full blur-[80px] pointer-events-none ${
                activeStrikeEffect.effectType === 'damage' 
                  ? 'bg-red-650/40' 
                  : activeStrikeEffect.effectType === 'shield'
                  ? 'bg-cyan-500/45'
                  : activeStrikeEffect.effectType === 'heal'
                  ? 'bg-emerald-500/40'
                  : 'bg-indigo-650/45'
              }`}
            />

            {/* Battle Kinetic HUD */}
            <div className="relative text-center max-w-lg px-6 z-10">
              <motion.div
                initial={{ y: 35, scale: 0.85, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -35, scale: 0.9, opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400 font-mono animate-pulse">
                  ⚡ {activeStrikeEffect.sourceName} CASTS
                </p>

                {/* Atomic circular core chamber */}
                <motion.div
                  animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.04, 0.98, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-36 h-36 mx-auto rounded-full border-4 flex flex-col justify-center items-center shadow-2xl relative ${
                    activeStrikeEffect.isCompound 
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300' 
                      : 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                  }`}
                >
                  <span className="text-5xl font-black font-semibold select-none tracking-normal drop-shadow-[0_4px_12px_rgba(34,211,238,0.5)]">
                    {activeStrikeEffect.symbol}
                  </span>
                  <span className="text-[9px] font-black uppercase font-mono tracking-wider opacity-80 mt-1 block">
                    {activeStrikeEffect.isCompound ? 'Compound' : 'Element'}
                  </span>
                </motion.div>

                {/* Spell identity labels */}
                <div>
                  <h2 className="text-3xl font-black text-white font-display tracking-tight uppercase">
                    {activeStrikeEffect.cardName}
                  </h2>
                  <p className="text-cyan-300 font-mono text-sm uppercase font-extrabold tracking-wide mt-1">
                    ⚔️ {activeStrikeEffect.powerupName} ⚔️
                  </p>
                </div>

                {/* Big numeric impact ticker */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.35, 1.1], opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className={`inline-block px-8 py-3 rounded-2xl font-black font-mono text-2xl shadow-xl border ${
                    activeStrikeEffect.effectType === 'damage'
                      ? 'bg-red-500 text-white border-red-400 shadow-red-500/20'
                      : activeStrikeEffect.effectType === 'shield'
                      ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/20'
                      : activeStrikeEffect.effectType === 'heal'
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20'
                      : 'bg-purple-600 text-white border-purple-400 shadow-purple-600/20'
                  }`}
                >
                  {activeStrikeEffect.effectType === 'damage' && `-${activeStrikeEffect.value} HP`}
                  {activeStrikeEffect.effectType === 'shield' && `+${activeStrikeEffect.value} SHIELD`}
                  {activeStrikeEffect.effectType === 'heal' && `+${activeStrikeEffect.value} HP`}
                  {activeStrikeEffect.effectType === 'stun' && `STUN OPPONENT !`}
                  {activeStrikeEffect.effectType === 'evade' && `EVADE ATTACK !`}
                </motion.div>

                <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed italic">
                  "{activeStrikeEffect.isCompound 
                    ? `Consolidated atomic binding lattices clash! Detonation produces high-energy thermal kinetic waves.` 
                    : `A single atomic burst releases active electron shell ionization modifiers.`}"
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl relative z-10">

        {/* Global Nav Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between bg-white border-2 border-cyan-150 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 font-display flex items-center gap-2">
                <span className="text-cyan-500 font-black">TURNED</span> TABLES
              </h1>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Atomic Deck Battle Laboratory</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {playMode === 'setup' ? (
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 gap-1">
                <button 
                  onClick={() => setDifficulty('alpha')} 
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${difficulty === 'alpha' ? 'bg-cyan-500 text-white shadow-xs' : 'hover:bg-slate-200'}`}
                >
                  ALPHA LAB
                </button>
                <button 
                  onClick={() => setDifficulty('beta')} 
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${difficulty === 'beta' ? 'bg-cyan-500 text-white shadow-xs' : 'hover:bg-slate-200'}`}
                >
                  BETA LAB
                </button>
                <button 
                  onClick={() => setDifficulty('gamma')} 
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${difficulty === 'gamma' ? 'bg-cyan-500 text-white shadow-xs' : 'hover:bg-slate-200'}`}
                >
                  GAMMA LAB
                </button>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs select-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>LEVEL: {difficulty === 'alpha' ? 'Alpha' : difficulty === 'beta' ? 'Beta' : 'Gamma'}</span>
              </div>
            )}

            {playMode !== 'setup' && playMode !== 'ended' && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setTrayActivePlayer(currentTurn);
                    setShowTray(true);
                    setSelectedTrayElement(null);
                  }}
                  className="px-3.5 py-2 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-extrabold text-xs uppercase rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>My Tray ({currentTurn === 1 ? player1.deck.length : player2.deck.length})</span>
                </button>

                <button
                  onClick={() => {
                    setShowSynthesisStation(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-50 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100 font-extrabold text-xs uppercase rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>🧪 Synthesis Station</span>
                </button>

                {vsBot && (
                  <button
                    onClick={() => setShowQuitConfirm(true)}
                    className="px-3.5 py-2 bg-rose-50 border-2 border-rose-200 text-rose-750 hover:bg-rose-100 font-extrabold text-xs uppercase rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    🏳️ Quit Practice
                  </button>
                )}
              </div>
            )}

            <motion.div
              className="bg-amber-50 border-2 border-amber-300 px-5 py-2 rounded-xl text-amber-700 font-black flex items-center gap-2 text-sm shadow-xs"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{stars} TOKENS</span>
            </motion.div>
          </div>
        </header>

        {/* Scoreboard and Winning Lineup Banner */}
        {playMode !== 'setup' && (
          <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 border-2 border-indigo-500 rounded-2xl p-4 mb-6 shadow-md text-white gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 border border-indigo-400 font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider text-cyan-200">
                Round {currentRound}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase text-indigo-300">Scoreboard:</span>
                <span className="text-sm font-black text-white">
                  🏆 {player1.name}: <span className="text-cyan-400 text-base">{p1RoundWins}</span> wins
                </span>
                <span className="text-xs text-indigo-450 font-black mx-1">vs</span>
                <span className="text-sm font-black text-white">
                  🏆 {player2.name}: <span className="text-amber-400 text-base">{p2RoundWins}</span> wins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lastWinnerLineup && (
                <button
                  onClick={() => setShowWinnerLineupMenu(true)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-xs uppercase rounded-xl border border-indigo-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>View Last Winning Deck</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================= SETUP PAGE ========================================= */}
        {playMode === 'setup' && showMultiplayerLobby && userId && (
          <MultiplayerLobby
            userId={userId}
            onGameStart={handleMultiplayerStart}
            onBack={() => setShowMultiplayerLobby(false)}
          />
        )}
        {playMode === 'setup' && !showMultiplayerLobby && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
            id="setup-profile-panel"
          >
            {/* 1. NEW COMPACT HIGHLIGHT PROFILE HEADER & SIDE BAR SHORTCUTS */}
            <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-md relative overflow-hidden text-white ${SKINS_INFO[activeSkin]?.bgClass || 'bg-slate-900'} ${SKINS_INFO[activeSkin]?.borderClass || 'border-slate-800'}`}>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-40 h-40" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4.5">
                  <div className="w-20 h-20 bg-slate-950/70 border-2 border-white/20 backdrop-blur-md rounded-2.5xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                    <PixelCharacter
                      skin={activeSkin}
                      clothing={charClothing}
                      accessory={charAccessory}
                      hair={charHair}
                      facial={charFacial}
                      skinColor={WARDROBE_SKIN_COLORS.find(s => s.id === charSkinColor)?.value || '#FFD1A9'}
                      size="md"
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-white tracking-tight">{p1ConfigName}</h2>
                      <span className="px-2 py-0.5 bg-cyan-400 text-cyan-950 text-[9px] font-black rounded uppercase tracking-wider">
                        {SKINS_INFO[activeSkin]?.label || 'Standard Suit'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-cyan-200 uppercase tracking-widest mt-0.5">
                      Explorer Level {Math.floor(userXP / 350) + 1} • {userXP % 350}/350 XP
                    </p>
                    
                    {/* XP Progress Bar */}
                    <div className="w-56 sm:w-68 h-2 bg-white/20 rounded-full mt-2 overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 h-full rounded-full transition-all duration-500 animate-pulse" 
                        style={{ width: `${Math.min(100, ((userXP % 350) / 350) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-widest">Active Profile Badges (max 5)</span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {getProfileDisplayedBadges().map(badgeId => {
                      const bInfo = ALL_GAME_BADGES[badgeId];
                      if (!bInfo) return null;
                      return (
                        <div
                          key={badgeId}
                          className="group relative"
                          title={bInfo.desc}
                        >
                          <div className={`relative px-3 py-2 bg-gradient-to-br ${bInfo.gradient} border ${bInfo.border} rounded-xl shadow-lg overflow-hidden cursor-help transition-transform hover:scale-105`}>
                            {/* Shine overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                            {/* Foil texture dots */}
                            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '6px 6px' }} />
                            <div className="relative flex items-center gap-1.5">
                              <span className="text-base drop-shadow-sm">{bInfo.emoji}</span>
                              <span className={`text-[9px] font-black uppercase tracking-wide ${bInfo.text}`}>{bInfo.name}</span>
                            </div>
                            {/* Bottom edge accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20" />
                          </div>
                        </div>
                      );
                    })}
                    {getProfileDisplayedBadges().length === 0 && (
                      <span className="text-xs text-slate-400 font-bold italic">No badges selected to display</span>
                    )}
                  </div>
                </div>
              </div>

              {/* NAVIGATION HUB DRAWER SHORTCUTS */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2.5 relative z-10">
                <button
                  onClick={() => { audio.playPop(); setShowBadgesMenu(true); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer"
                >
                  🏅 Profile Badges Manager
                </button>
                <button
                  onClick={() => { audio.playPop(); setShowCompoundsMenu(true); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer"
                >
                  🧪 Synthesis Journal ({createdCompounds.length})
                </button>
                <button
                  onClick={() => { audio.playPop(); setShowGalleryMenu(true); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer"
                >
                  🏆 Lineups Gallery ({winningGallery.length})
                </button>
              </div>
            </div>

            {/* 2. MATCHMAKING QUEUE SIMULATOR & CO-OP TEAM LOBBY */}
            {matchmakingMode !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-950 border-2 border-indigo-500/50 rounded-3xl p-6 text-white space-y-6 shadow-xl relative"
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button 
                    onClick={() => setMatchmakingMode('none')}
                    className="p-1 px-3 bg-red-500/20 hover:bg-red-500/45 text-red-300 text-xs font-black rounded-lg border border-red-500/40 cursor-pointer"
                  >
                    Cancel Match
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Lobby player lineup (Left) */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <span className="font-extrabold text-sm uppercase tracking-widest text-indigo-300">
                        {matchmakingMode === '3v3' ? 'Simulated Team Lobby (6-Player Server)' : 'Connecting 1v1 PvP Server...'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      {matchmakingMode === '3v3' ? (
                        <>
                          <div className="col-span-2 text-xs font-black text-cyan-400 tracking-wider">TEAM CYAN (CO-OP)</div>
                          {lobbyPlayers.filter(p => p.team === 'cyan').map((p) => (
                            <div key={`cyan-${p.name}`} className="flex items-center gap-3 p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-2xl">
                              <span className="text-2xl">{p.avatar}</span>
                              <div>
                                <span className="text-xs font-bold text-cyan-200 block truncate">{p.name} {p.isUser && '(You)'}</span>
                                <span className="text-[9px] text-green-400 font-extrabold uppercase">✓ READY</span>
                              </div>
                            </div>
                          ))}
                          {Array.from({ length: 3 - lobbyPlayers.filter(p => p.team === 'cyan').length }).map((_, i) => (
                            <div key={`cyan-empty-${i}`} className="flex items-center justify-center p-3 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500 font-bold animate-pulse">
                              Searching partner...
                            </div>
                          ))}

                          <div className="col-span-2 text-xs font-black text-amber-400 tracking-wider mt-2">TEAM AMBER (OPPONENTS)</div>
                          {lobbyPlayers.filter(p => p.team === 'amber').map((p) => (
                            <div key={`amber-${p.name}`} className="flex items-center gap-3 p-3 bg-amber-950/40 border border-amber-800/40 rounded-2xl">
                              <span className="text-2xl">{p.avatar}</span>
                              <div>
                                <span className="text-xs font-bold text-amber-200 block truncate">{p.name}</span>
                                <span className="text-[9px] text-green-400 font-extrabold uppercase">✓ READY</span>
                              </div>
                            </div>
                          ))}
                          {Array.from({ length: 3 - lobbyPlayers.filter(p => p.team === 'amber').length }).map((_, i) => (
                            <div key={`amber-empty-${i}`} className="flex items-center justify-center p-3 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500 font-bold animate-pulse">
                              Searching opponent...
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 gap-3">
                          <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                          <p className="text-xs text-slate-400 font-semibold">Pinging atomic websocket server. Searching for chemistry challenger...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chat Box Panel (Right - 3v3 only) */}
                  {matchmakingMode === '3v3' && (
                    <div className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[280px]">
                      <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span>TEAM CHAT ROOM</span>
                        </div>
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 p-3 overflow-y-auto space-y-2 max-h-[190px] text-left">
                        {lobbyChat.map((msg, idx) => (
                          <div key={idx} className="text-xs text-slate-300">
                            <span className="font-extrabold text-cyan-400">{msg.avatar} {msg.sender}:</span>{' '}
                            <span className="font-medium text-slate-200">{msg.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Input panel */}
                      <div className="p-2 border-t border-slate-800 flex gap-1.5">
                        <input 
                          type="text" 
                          value={chatMessageInput}
                          onChange={e => setChatMessageInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              sendChatMessage();
                            }
                          }}
                          placeholder="Type team tactics..."
                          className="flex-1 bg-slate-950 border border-slate-800 text-xs px-2.5 py-1.5 rounded-xl text-white font-medium focus:outline-hidden focus:border-indigo-500"
                        />
                        <button 
                          onClick={sendChatMessage}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 p-4 border border-slate-800/60 rounded-2xl flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs text-slate-400 font-bold block">Match status:</span>
                    <span className="text-sm font-black text-indigo-400 uppercase tracking-wide">
                      {matchmakingStep === 'connecting' && 'Establishing network handshake...'}
                      {matchmakingStep === 'finding_players' && 'Matchmaking queue matching atomic elements...'}
                      {matchmakingStep === 'ready' && '🚀 SERVER READY! MATCH WILL LAUNCH IN SECONDS.'}
                    </span>
                  </div>
                  <span className="text-white text-2xl font-black font-mono px-3 py-1 bg-indigo-950/80 border border-indigo-800 rounded-xl animate-pulse">
                    READY
                  </span>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: VISUAL WEAR CUSTOMIZER & SOCIAL FRIENDS (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* A. PERSONAL SOCIAL FRIENDS DECK */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2.5">
                      <Users className="w-5 h-5 text-indigo-500 animate-pulse" />
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-none">CHEMISTRY SOCIAL CLUB</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Challenge friends, inspect wardrobes, or accept requests</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-lg text-[10px] font-black">
                      {friendsList.length} Active Friends
                    </span>
                  </div>

                  {/* Add Friend Row */}
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add scientist friend by raw name..."
                      value={newFriendInput}
                      onChange={e => setNewFriendInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newFriendInput.trim()) {
                          // Trigger add
                          const name = newFriendInput.trim();
                          if (friendsList.some(f => f.name.toLowerCase() === name.toLowerCase())) {
                            triggerToast("Scientific partner already in friends directory!");
                            return;
                          }
                          const generatedFriend: Friend = {
                            id: Math.random().toString(),
                            name,
                            avatar: '🔬',
                            skin: 'radiant_radium',
                            level: Math.floor(Math.random() * 8) + 1,
                            activeSkin: 'radiant_radium',
                            badges: ['proton_pioneer', 'molecular_marvel'],
                            pixelChar: {
                              clothing: 'cyber_suit',
                              accessory: 'cyberspace_visor',
                              hair: 'neon_spikes',
                              skinColor: '#CFD8DC'
                            }
                          };
                          setFriendsList(prev => [...prev, generatedFriend]);
                          setNewFriendInput('');
                          triggerToast(`🤝 Added "${name}"! Click on their name inspect their digital wear & honors.`);
                        }
                      }}
                      className="flex-1 bg-slate-50 border-2 border-slate-150 px-3.5 py-2 rounded-xl text-xs font-black text-slate-850 focus:outline-hidden focus:border-cyan-400"
                    />
                    <button
                      onClick={() => {
                        if (!newFriendInput.trim()) return;
                        const name = newFriendInput.trim();
                        const generatedFriend: Friend = {
                          id: Math.random().toString(),
                          name,
                          avatar: '🔬',
                          skin: 'radiant_radium',
                          level: Math.floor(Math.random() * 8) + 1,
                          activeSkin: 'radiant_radium',
                          badges: ['proton_pioneer', 'molecular_marvel'],
                          pixelChar: {
                            clothing: 'cyber_suit',
                            accessory: 'cyberspace_visor',
                            hair: 'neon_spikes',
                            skinColor: '#CFD8DC'
                          }
                        };
                        setFriendsList(prev => [...prev, generatedFriend]);
                        setNewFriendInput('');
                        triggerToast(`🤝 Added "${name}"! Click on their name inspect their digital wear & honors.`);
                      }}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Add Partner
                    </button>
                  </div>

                  {/* Friends List Scrolldeck */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {friendsList.map(friend => (
                      <div 
                        key={friend.id} 
                        onClick={() => {
                          audio.playPop();
                          setActiveInspectedFriend(friend);
                          setShowFriendInspectModal(true);
                        }}
                        className="p-3.5 bg-slate-50 border-2 border-slate-100 hover:border-indigo-200 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:shadow-xs relative group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 border rounded-xl overflow-hidden flex items-center justify-center">
                            <PixelCharacter
                              skin={friend.activeSkin || friend.skin || 'spectral_cyan'}
                              clothing={friend.pixelChar?.clothing || 'lab_coat'}
                              accessory={friend.pixelChar?.accessory || 'safety_goggles'}
                              hair={friend.pixelChar?.hair || 'wild_scientist'}
                              facial={friend.pixelChar?.facial || 'none'}
                              skinColor={friend.pixelChar?.skinColor || '#FFD1A9'}
                              size="sm" 
                            />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-800 block leading-tight">{friend.name}</span>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase block mt-0.5">LVL {friend.level} PARTNER</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`inline-block w-2 h-2 rounded-full ${friend.status === 'In Battle' ? 'bg-amber-500 animate-ping' : 'bg-green-500'}`}></span>
                          <span className="text-[9px] font-black text-slate-500 block uppercase mt-0.5">{friend.status}</span>
                        </div>
                        
                        <div className="absolute inset-0 bg-indigo-50/10 opacity-0 group-hover:opacity-100 rounded-2xl pointer-events-none transition-all border border-indigo-200/50" />
                      </div>
                    ))}
                    {friendsList.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4 col-span-2">No scientific partners connected yet. Type a name above to search!</p>
                    )}
                  </div>
                </div>

                {/* B. CHARACTERS WARDROBE & 8-BIT SUITS CLOSET */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-2.5">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-none">RETRO PIXEL SUIT LAB</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Design character clothing, hair, colors, and unlock rare skins</p>
                      </div>
                    </div>
                  </div>

                  {/* Character customizing control center */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Real-time 8-bit visual rendering display box (4/12 cols) */}
                    <div className="md:col-span-4 bg-slate-950 rounded-2.5xl p-4 flex flex-col items-center justify-center border-4 border-slate-800 shadow-inner relative group min-h-[170px]">
                      <div className="absolute top-2 left-2 bg-slate-900 border border-slate-850 text-slate-300 text-[8px] font-black px-1.5 rounded uppercase tracking-widest">
                        Preview
                      </div>
                      <PixelCharacter
                        skin={activeSkin}
                        clothing={charClothing}
                        accessory={charAccessory}
                        hair={charHair}
                        facial={charFacial}
                        skinColor={WARDROBE_SKIN_COLORS.find(s => s.id === charSkinColor)?.value || '#FFD1A9'}
                        size="lg"
                      />
                      <div className="mt-3 text-center">
                        <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-wide">
                          {SKINS_INFO[activeSkin]?.label || 'Active Skin'}
                        </span>
                        <span className="text-[8px] text-slate-500 font-extrabold uppercase mt-0.5 block">
                          Level Req: {SKINS_INFO[activeSkin]?.levelReq}
                        </span>
                      </div>
                    </div>

                    {/* Clothing and item parameters grid (8/12 cols) */}
                    <div className="md:col-span-8 space-y-4">
                      
                      {/* 1. Name Editor and suit theme selector */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wide mb-1">Explorer Code Name</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={p1ConfigName}
                              onChange={e => setP1ConfigName(e.target.value)}
                              className="flex-1 bg-slate-50 border-2 border-slate-150 px-3 py-1.5 rounded-xl text-xs font-black text-slate-850 focus:outline-hidden focus:border-cyan-400 min-w-0"
                            />
                            <button
                              onClick={randomizeP1Name}
                              className="px-2.5 bg-cyan-55 hover:bg-cyan-100 border-2 border-cyan-200 hover:border-cyan-300 text-cyan-650 rounded-xl text-xs font-black uppercase transition-colors shrink-0 cursor-pointer shadow-xs flex items-center justify-center"
                              title="Generate Random Themed Name"
                            >
                              🎲
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 block uppercase tracking-wide mb-1">Suit Skin Theme</label>
                          <select 
                            value={activeSkin}
                            onChange={e => {
                              const skinVal = e.target.value;
                              if (userSkins.includes(skinVal)) {
                                setActiveSkin(skinVal);
                                audio.playSuccess();
                              } else {
                                triggerToast(`This Suit Skin is locked! Reach Lev. ${SKINS_INFO[skinVal].levelReq} to customize.`);
                              }
                            }}
                            className="w-full bg-slate-50 border-2 border-slate-150 p-1.5 rounded-xl text-xs font-black text-slate-850 focus:outline-hidden"
                          >
                            {Object.keys(SKINS_INFO).map(skinKey => {
                              const isUn = userSkins.includes(skinKey);
                              return (
                                <option key={skinKey} value={skinKey}>{!isUn ? '🔒 ' : ''}{SKINS_INFO[skinKey].label}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* 2. Wardrobe Item custom sliders */}
                      <div className="space-y-2.5">
                        {/* A. Clothing Selection */}
                        <div>
                          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Clothing Costume</span>
                          <div className="flex flex-wrap gap-1.5">
                            {WARDROBE_CLOTHING.map(c => (
                              <button
                                key={c.id}
                                onClick={() => { audio.playPop(); setCharClothing(c.id); }}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg border-2 uppercase transition-all ${
                                  charClothing === c.id ? 'bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* B. Accessory selection */}
                        <div>
                          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Face Accessory</span>
                          <div className="flex flex-wrap gap-1.5">
                            {WARDROBE_ACCESSORIES.map(acc => (
                              <button
                                key={acc.id}
                                onClick={() => { audio.playPop(); setCharAccessory(acc.id); }}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg border-2 uppercase transition-all ${
                                  charAccessory === acc.id ? 'bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {acc.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* C. Hair styling */}
                        <div>
                          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Intellect Haircut</span>
                          <div className="flex flex-wrap gap-1.5">
                            {WARDROBE_HAIR.map(h => (
                              <button
                                key={h.id}
                                onClick={() => { audio.playPop(); setCharHair(h.id); }}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg border-2 uppercase transition-all ${
                                  charHair === h.id ? 'bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {h.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* D. Skin tone coloring */}
                        <div>
                          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Sub-atomic Skin Tone</span>
                          <div className="flex flex-wrap gap-1.5">
                            {WARDROBE_SKIN_COLORS.map(tone => (
                              <button
                                key={tone.id}
                                onClick={() => { audio.playPop(); setCharSkinColor(tone.id); }}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg border-2 uppercase transition-all flex items-center gap-1.5 ${
                                  charSkinColor === tone.id ? 'bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: tone.value }} />
                                {tone.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* E. Facial Features */}
                        <div>
                          <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider mb-1">Facial Feature</span>
                          <div className="flex flex-wrap gap-1.5">
                            {WARDROBE_FACIAL.map(f => (
                              <button
                                key={f.id}
                                onClick={() => { audio.playPop(); setCharFacial(f.id); }}
                                className={`px-2.5 py-1 text-[10px] font-black rounded-lg border-2 uppercase transition-all ${
                                  charFacial === f.id ? 'bg-indigo-50 border-indigo-550 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {f.name}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: QUEUE BUTTON PANEL & QUESTS ENGINE (5 cols) */}
              <div className="lg:col-span-5 space-y-6 text-left">
                {/* Gameplay launcher board */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <Play className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-lg font-black text-slate-900">LAUNCH BATTLE STATION</h3>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                    Simulate battles on real-time physics rules. Complete quests or defeat monthly champions to claim high stakes rewards!
                  </p>

                  <div className="space-y-3 pt-2">
                    
                    {/* 1. Bot practice - Triggers Parameters Popup */}
                    <button
                      onClick={() => { audio.playPop(); setShowPracticeParamsModal(true); }}
                      id="launch-practic-ai"
                      className="w-full p-4 hover:shadow-md bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100/50 border-2 border-cyan-200 rounded-2xl cursor-pointer text-left flex items-center justify-between transition-all group"
                    >
                      <div>
                        <span className="font-extrabold text-cyan-900 text-sm block">LAB PRACTICE MODE</span>
                        <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest mt-0.5">SELECT DIFFICULTY PARAMETERS</span>
                      </div>
                      <span className="p-1 px-3 bg-cyan-600 text-white text-[10px] font-black rounded-lg uppercase group-hover:scale-105 transition-transform">
                        Setup
                      </span>
                    </button>

                    {/* 2. Monthly Quark Boss Challenge */}
                    <button
                      onClick={() => {
                        audio.playPop();
                        setIsMonthlyChallenge(true);
                        // Doctor Quark custom preset setup
                        setPlayer2({
                          id: 2,
                          name: 'Dr. Quark (Monthly Bot)',
                          hp: 500,
                          shield: 40,
                          deck: [],
                          compounds: [],
                          score: 0,
                          isBot: true
                        });
                        setDifficulty('gamma'); // Forced tough level
                        startNewGame(true); // Launch bot game directly
                        setBattleLog([
                          "🚨 DR. QUARK MONTHLY BOSS CHALLENGE INITIATED!",
                          "Difficulty forced to Gamma level. Dr. Quark gains passive +40 shielding!",
                          "Defeat Dr. Quark to secure +300 bonus XP."
                        ]);
                        triggerToast("🚨 Monthly challenge initiated against Dr. Quark!");
                      }}
                      className={`w-full p-4 hover:shadow-md border-2 rounded-2xl cursor-pointer text-left flex items-center justify-between transition-all group ${
                        monthlyChallengeDefeated 
                          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-250' 
                          : 'bg-gradient-to-r from-amber-50 to-rose-50 border-amber-250 animate-pulse'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm block">MONTHLY BOT CHALLENGE</span>
                          {monthlyChallengeDefeated && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] font-black rounded uppercase">DEFEATED</span>
                          )}
                        </div>
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest mt-0.5">VS DR. QUARK BOSS (+300 XP)</span>
                      </div>
                      <span className={`p-1 px-3 text-white text-[10px] font-black rounded-lg uppercase group-hover:scale-105 transition-transform ${
                        monthlyChallengeDefeated ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {monthlyChallengeDefeated ? 'REPLAY' : 'CHALLENGE'}
                      </span>
                    </button>

                    {/* 3. Split Screen duel */}
                    <button
                      onClick={() => { audio.playPop(); startNewGame(false); }}
                      id="launch-local-split"
                      className="w-full p-4 hover:shadow-md bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100/50 border-2 border-purple-200 rounded-2xl cursor-pointer text-left flex items-center justify-between transition-all group"
                    >
                      <div>
                        <span className="font-extrabold text-purple-900 text-sm block">SHARED SCREEN DUEL</span>
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-0.5">1V1 LOCAL DECK SPELLS</span>
                      </div>
                      <span className="p-1 px-3 bg-purple-600 text-white text-[10px] font-black rounded-lg uppercase group-hover:scale-105 transition-transform">
                        Launch
                      </span>
                    </button>

                    {/* 4. Online PvP - Real multiplayer */}
                    <button
                      onClick={() => { audio.playPop(); setShowMultiplayerLobby(true); }}
                      id="matchmake-1v1-btn"
                      className="w-full p-4 hover:shadow-md bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100/50 border-2 border-emerald-200 rounded-2xl cursor-pointer text-left flex items-center justify-between transition-all group"
                    >
                      <div>
                        <span className="font-extrabold text-emerald-950 text-sm block">ONLINE PVP DUEL</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">REAL-TIME MULTIPLAYER 1V1</span>
                      </div>
                      <span className="p-1 px-3 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase group-hover:scale-105 transition-transform">
                        Play Online
                      </span>
                    </button>

                    {/* 5. Team 3v3 mode - Real multiplayer */}
                    <button
                      onClick={() => { audio.playPop(); setShowMultiplayerLobby(true); }}
                      id="matchmake-3v3-btn"
                      className="w-full p-4 hover:shadow-md bg-gradient-to-r from-indigo-50 to-pink-50 hover:from-pink-100/50 border-2 border-pink-200 rounded-2xl cursor-pointer text-left flex items-center justify-between transition-all group"
                    >
                      <div>
                        <span className="font-extrabold text-indigo-950 text-sm block">3V3 TEAM CO-OP BATTLE</span>
                        <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest mt-0.5">REAL-TIME TEAM LOBBY WITH CHAT</span>
                      </div>
                      <span className="p-1 px-3 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase group-hover:scale-105 transition-transform">
                        Play 3V3
                      </span>
                    </button>
                  </div>
                </div>

                {/* DAILY AND WEEKLY QUESTS ENGINE */}
                <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b pb-4 justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-lg font-black text-slate-900 leading-none">DAILY / WEEKLY QUESTS</h3>
                    </div>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 border border-indigo-200 rounded-full">
                      RELOADS WEEKLY
                    </span>
                  </div>

                  <div className="space-y-4.5 pr-1 max-h-[320px] overflow-y-auto">
                    {quests.map(q => (
                      <div key={q.id} className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-150 relative overflow-hidden text-left">
                        {q.completed && (
                          <div className="absolute top-2 right-2 bg-green-100 border border-green-300 text-green-700 px-1.5 py-0.5 rounded-md text-[8px] font-black flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> DONE
                          </div>
                        )}
                        <span className="text-[9px] block font-extrabold text-slate-400 tracking-wider">
                          {q.isWeekly ? "WEEKLY CHALLENGE" : "DAILY CHALLENGE"}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 leading-tight pr-12">{q.title}</h4>
                        
                        {/* Progress status */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                          <span>Progress: {q.current}/{q.target}</span>
                          <span className="text-indigo-600 font-extrabold">+{q.xpReward} XP</span>
                        </div>
                        
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${(q.current / q.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================= DRAFT STAGE ========================================= */}
        {playMode === 'draft' && (
          <div className="flex flex-col gap-6">

            {/* Instruction board */}
            <div className="bg-white border-2 border-cyan-150 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 leading-none flex items-center gap-2">
                    DRAFT PHASE: {currentTurn === 1 ? player1.name : player2.name}'S SELECT TURN
                    {vsBot && currentTurn === 2 && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 rounded-full animate-pulse ml-2">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-500" />
                        AI RUNNING SPECTROSCOPY...
                      </span>
                    )}
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    {vsBot && currentTurn === 2 ? (
                      <span className="text-amber-600 font-medium">Doc Proton is scanning the atomic grid to select a strategic element!</span>
                    ) : (
                      "Select any question-mark element from the periodic table and type its spelling correct to claims it to your battle hand deck!"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">CLAIMED TALLY</p>
                  <p className="text-sm font-black text-slate-700">
                    P1: <span className="text-cyan-500">{player1.deck.length}</span> | P2: <span className="text-amber-500">{player2.deck.length}</span> | Burnt: <span className="text-slate-400">{sideDeck.length}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (player1.deck.length < 2 && player2.deck.length < 2) {
                      triggerToast("Synthesize at least 2 cards to open the Synthesis Laboratory!");
                      return;
                    }
                    setPlayMode('synthesis');
                  }}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  FINISH DRAFT & GO TO SYNTHESIS LAB →
                </button>
              </div>
            </div>

            {/* Responsive scrollable Periodic Table Grid of Cards */}
            <div className="bg-white border-2 border-cyan-150 rounded-3xl p-6 shadow-sm overflow-x-auto">
              <div className="min-w-[850px] relative">
                
                {/* Element Cards Grid container */}
                <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                  {/* Fill empty cells properly or position absolute */}
                  {Array.from({ length: 9 }).map((_, rIdx) => {
                    const row = rIdx + 1;
                    return (
                      <React.Fragment key={`row-${row}`}>
                        {/* Beautiful separator before Rare Earth Elements row 8 and 9 */}
                        {row === 8 && (
                          <div 
                            style={{ gridColumn: 'span 18' }} 
                            className="h-10 flex items-center justify-center font-black text-[10px] tracking-widest text-cyan-700 gap-4 select-none bg-cyan-50/50 rounded-2xl border-2 border-dashed border-cyan-200 my-3 py-1.5"
                            key="rare-earth-separator"
                          >
                            <span>🔬 LANTHANIDE & ACTINIDE RARE-EARTH ACADEMY REGIONS 🔬</span>
                          </div>
                        )}
                        {Array.from({ length: 18 }).map((_, cIdx) => {
                          const col = cIdx + 1;
                          
                          const matchedElement = unclaimedElements.find(
                            el => el.period === row && el.group === col
                          );

                          if (!matchedElement) {
                            if (row === 8 && col === 3) {
                              return (
                                <div key="lanthanide-label" className="aspect-square flex flex-col items-center justify-center text-center p-1 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 text-[9px] font-bold text-teal-700 leading-tight select-none">
                                  <span className="font-extrabold uppercase text-[7px] tracking-wider">LA-LU</span>
                                  <span className="text-[10px] font-black">57-71</span>
                                </div>
                              );
                            }
                            if (row === 9 && col === 3) {
                              return (
                                <div key="actinide-label" className="aspect-square flex flex-col items-center justify-center text-center p-1 rounded-xl border border-dashed border-violet-300 bg-violet-50/50 text-[9px] font-bold text-violet-700 leading-tight select-none">
                                  <span className="font-extrabold uppercase text-[7px] tracking-wider">AC-LR</span>
                                  <span className="text-[10px] font-black">89-103</span>
                                </div>
                              );
                            }
                            return <div key={`empty-${row}-${col}`} className="aspect-square opacity-0" />;
                          }

                          const owner = claimedBy[matchedElement.number];
                          const isUnclaimed = !owner;
                          const isBotTurn = vsBot && currentTurn === 2;

                          const activePDeck = currentTurn === 1 ? player1.deck : player2.deck;
                          const currentNonAttackCount = activePDeck.filter(c => !isAttackCard(c)).length;
                          const isBlockedByHandLimit = isUnclaimed && currentNonAttackCount >= 2 && !isAttackCard(matchedElement);

                          return (
                            <motion.button
                              key={matchedElement.number}
                              onClick={() => handleElementClick(matchedElement)}
                              whileHover={((isUnclaimed || owner === 'side') && !isBotTurn && !isBlockedByHandLimit) ? { scale: 1.12, zIndex: 10 } : {}}
                              className={`aspect-square rounded-lg flex flex-col justify-between select-none transition-all origin-center relative overflow-hidden ${
                                isBlockedByHandLimit ? 'opacity-30 bg-slate-100 border border-slate-300 border-dashed cursor-not-allowed' :
                                isBotTurn ? 'cursor-not-allowed opacity-80 border-2' : 'cursor-pointer border-2'
                              } ${
                                isBlockedByHandLimit ? '' :
                                owner === 1
                                  ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-400/30'
                                  : owner === 2
                                  ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900 border-amber-400 shadow-lg shadow-amber-300/30'
                                  : owner === 'side'
                                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-dashed border-emerald-400 hover:border-emerald-500'
                                  : `${getCategoryColor(matchedElement.category)} ${!isBotTurn ? 'hover:shadow-lg' : ''}`
                              }`}
                            >
                              {/* Card inner border / frame */}
                              {(!isBlockedByHandLimit && isUnclaimed) && (
                                <div className="absolute inset-[3px] rounded-md border border-white/20 pointer-events-none" />
                              )}

                              {/* Top bar: atomic number + category */}
                              <div className="flex justify-between w-full px-1 pt-0.5 text-[8px] font-bold leading-none">
                                <span className="opacity-80">{matchedElement.number}</span>
                                <span className="uppercase text-[6px] tracking-wider opacity-60">{matchedElement.category.slice(0, 3)}</span>
                              </div>

                              {/* Center: symbol or mystery */}
                              <div className="text-center flex-1 flex flex-col items-center justify-center leading-tight">
                                {owner ? (
                                  <>
                                    <span className="text-base md:text-lg font-black block drop-shadow-sm">{matchedElement.symbol}</span>
                                    <span className="text-[7px] uppercase block tracking-widest font-mono opacity-50 mt-0.5">{matchedElement.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-lg md:text-xl font-black block opacity-70">?</span>
                                    <span className="text-[7px] uppercase block tracking-widest font-mono opacity-40">[{matchedElement.symbol}]</span>
                                  </>
                                )}
                              </div>

                              {/* Bottom: action label + powerup hint dot */}
                              <div className="flex items-center justify-center w-full pb-0.5 px-1">
                                <span className="text-[7px] font-extrabold tracking-tight leading-none truncate">
                                  {isBlockedByHandLimit ? 'LOCK' : owner === 'side' ? 'RECLAIM' : owner ? '' : 'DRAW'}
                                </span>
                                {isUnclaimed && !isBlockedByHandLimit && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full ml-1 shrink-0"
                                    style={{ backgroundColor: getCategoryAccentColor(matchedElement.category) }}
                                  />
                                )}
                              </div>

                              {/* Owned overlay shine */}
                              {owner === 1 && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none" />
                              )}
                              {owner === 2 && (
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                              )}
                            </motion.button>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Subtitle legends */}
                <div className="flex flex-wrap items-center gap-4 mt-6 text-[10px] font-bold text-slate-500 pt-5 border-t border-dashed border-slate-200">
                  <span>CARD RARITY:</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-cyan-100 to-cyan-300 border border-cyan-400" /> Alkali</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-amber-100 to-amber-300 border border-amber-400" /> Alkaline Earth</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-teal-100 to-teal-300 border border-teal-400" /> Transition Metals</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-emerald-100 to-emerald-300 border border-emerald-400" /> Metalloids</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-sky-100 to-sky-300 border border-sky-400" /> Non-metals</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-rose-100 to-rose-300 border border-rose-400" /> Halogens</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gradient-to-br from-purple-100 to-purple-300 border border-purple-400" /> Noble Gases</span>
                </div>

              </div>
            </div>

            {/* Score points widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-cyan-150 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-widest">P1 Score Summary</h3>
                  <p className="text-lg font-black text-slate-900 mt-1">{player1.score} PTS</p>
                  <p className="text-slate-400 text-xs mt-0.5">Claims: {player1.deck.map(c => c.symbol).join(', ') || 'None'}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest">P2 Score Summary</h3>
                  <p className="text-lg font-black text-slate-900 mt-1">{player2.score} PTS</p>
                  <p className="text-slate-400 text-xs mt-0.5">Claims: {player2.deck.map(c => c.symbol).join(', ') || 'None'}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================= ATOMIC QUIZ MODAL ========================================= */}
        <AnimatePresence>
          {activeQuizCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-cyan-300 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative"
              >
                {/* Close Button only if ended or resolved */}
                {quizStatus !== 'prompt' && (
                  <button
                    onClick={closeQuizModal}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                )}

                <div className="text-center mb-6">
                  <div className="inline-block bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    Atomic Synthesis Challenge
                  </div>

                  {/* Noodle card preview */}
                  <div className="w-32 h-32 mx-auto rounded-2xl border-4 border-dashed border-cyan-400 bg-slate-50 flex flex-col justify-between p-3 mb-4 shadow-sm relative">
                    <span className="text-xs font-black text-slate-400 text-left">{activeQuizCard?.number}</span>
                    <span className="text-4xl text-cyan-600 font-bold block my-auto tracking-normal font-noodle">
                      {activeQuizCard?.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-700 font-extrabold uppercase bg-cyan-100/65 py-0.5 rounded px-2">
                       Powerup Preview
                    </span>
                  </div>

                  <p className="text-slate-800 text-sm italic font-medium px-4 mb-3">
                    "{getSanitizedClue(activeQuizCard)}"
                  </p>

                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Special Move: <span className="text-cyan-600">{activeQuizCard?.powerup?.name}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{activeQuizCard?.powerup?.desc}</p>
                </div>

                {/* Question UI and turns */}
                {quizStatus === 'prompt' && (
                   <div className="space-y-4">
                     <div className="bg-slate-100 border rounded-2xl p-4 text-center">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Guesser</p>
                       <p className="text-base font-black text-slate-800 mt-0.5">
                         {quizTurns === 1 ? player1.name : player2.name}
                       </p>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Attempt: {quizAttempts + 1} of 3</p>
                     </div>
 
                     {isBotThinking ? (
                       <div className="flex flex-col items-center justify-center p-6 text-amber-700 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 gap-3 text-xs font-black animate-pulse">
                         <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                         <span>Doc Proton is calculating element formula spectrum...</span>
                       </div>
                     ) : (
                       <div className="flex gap-2">
                         <input
                           type="text"
                           value={quizInput}
                           onChange={(e) => setQuizInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleQuizAnswer()}
                           placeholder={vsBot && quizTurns === 2 ? "Doc Proton is typing answer..." : "Type element name (e.g. Helium)..."} disabled={vsBot && quizTurns === 2}
                           className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:border-cyan-400 focus:outline-none text-sm font-semibold select-all disabled:bg-amber-50/40 disabled:text-amber-900 disabled:border-amber-200"
                           autoFocus
                         />
                         <button
                           onClick={() => handleQuizAnswer()}
                           disabled={vsBot && quizTurns === 2}
                            className={`px-6 text-white font-black text-sm rounded-xl cursor-pointer shadow-xs transition-colors ${
                              vsBot && quizTurns === 2 
                                ? 'bg-amber-500 hover:bg-amber-600' 
                                : 'bg-cyan-500 hover:bg-cyan-600'
                            }`}
                         >
                           {vsBot && quizTurns === 2 ? "TYPING..." : "SUBMIT"}
                         </button>
                       </div>
                     )}
 
                     {!(vsBot && quizTurns === 2) && (
                       <div className="flex justify-between items-center pt-2">
                         <button
                           onClick={autoSolveQuiz}
                           className="text-[11px] font-bold text-cyan-600 hover:underline cursor-pointer"
                         >
                           Auto-solve (Cheat Sheet)
                         </button>
 
                         <span className="text-[10px] text-slate-400 font-bold uppercase">
                           Tip: Spelled exact case-insensitive
                         </span>
                       </div>
                     )}
                   </div>
                )}

                {quizStatus === 'success' && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-display">SUCCESSFULLY DISCOVERED!</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      <span className="font-extrabold text-[#166534]">{activeQuizCard?.name} ({activeQuizCard?.symbol})</span> is locked into {correctGuesser === 1 ? player1.name : player2.name}'s element collection!
                    </p>

                    <button
                      onClick={closeQuizModal}
                      id="close-quiz-success-modal"
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-xl cursor-pointer text-sm shadow-xs transition-colors"
                    >
                      RETURN TO PERIODIC TABLE
                    </button>
                  </div>
                )}

                {quizStatus === 'failed' && (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 font-display">LIMIT EXCEEDED</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Both players failed to recall this element. The correct scientific name was <span className="font-black text-cyan-600">{activeQuizCard?.name}</span>. The element is safely stored in the side laboratory.
                    </p>

                    <button
                      onClick={closeQuizModal}
                      id="close-quiz-failed-modal"
                      className="w-full py-3 bg-slate-400 hover:bg-slate-500 text-white font-black rounded-xl cursor-pointer text-sm shadow-xs transition-colors"
                    >
                      CONTINUE DRAFTING
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= SYNTHESIS LAB ========================================= */}
        {playMode === 'synthesis' && (
          <div className="flex flex-col gap-6">

            {/* Title description */}
            <div className="bg-white border-2 border-cyan-150 p-5 rounded-3xl shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight">🧪 THE ELEMENTAL SYNTHESIS LAB</h2>
                <p className="text-slate-500 text-xs mt-1">
                  Combine separate single atom element cards to build high-intensity compound spells before entering the Atomic Arena.
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 pb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Arena Requirements (Form 1 Compound Each)
                </span>
                <div className="flex gap-3 text-xs font-extrabold pb-1">
                  <div className={`px-2.5 py-1 rounded-full border ${p1SynthesizedThisRound ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    P1: {p1SynthesizedThisRound ? 'Formed 🧪' : 'Pending 🔬'}
                  </div>
                  <div className={`px-2.5 py-1 rounded-full border ${p2SynthesizedThisRound ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    {player2.name}: {p2SynthesizedThisRound ? 'Formed 🧪' : 'Pending 🔬'}
                  </div>
                </div>
                {p1SynthesizedThisRound && p2SynthesizedThisRound ? (
                  <button
                    onClick={() => {
                      setPlayMode('battle');
                      setBattleLog(["Let the Chemical Arena Duel begin!", "Use cards in hand to cast elemental reactions."]);
                      // Snapshot lineups for replenishment
                      setP1InitialLineup({ elements: [...player1.deck], compounds: [...player1.compounds] });
                      setP2InitialLineup({ elements: [...player2.deck], compounds: [...player2.compounds] });
                    }}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    ENTER BATTLE ARENA NOW →
                  </button>
                ) : (
                  <div className="text-[11px] font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2 max-w-[280px] text-right">
                    ⚠️ Each player must craft exactly one compound to unlock the Battle Arena!
                  </div>
                )}
              </div>
            </div>

            {/* Split page for craft materials vs recipes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Collected Chemical Inventory (Left) */}
              <div className="lg:col-span-4 bg-white border-2 border-cyan-150 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b">Chemical Hand Inventory</h3>

                {/* Player 1 Inventory */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-cyan-700 uppercase">Cyan Force (P1)</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {player1.deck.length === 0 ? (
                      <span className="text-slate-400 text-xs italic">No raw elements yet.</span>
                    ) : (
                      player1.deck.map((card, i) => (
                        <span key={i} className="px-2 py-1 bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-black rounded-lg">
                          {card.symbol}
                        </span>
                      ))
                    )}
                  </div>

                  {player1.compounds.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1.5">
                      {player1.compounds.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-lg">
                          🧪 {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Player 2 Inventory */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-amber-700 uppercase">{player2.name}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {player2.deck.length === 0 ? (
                      <span className="text-slate-400 text-xs italic">No raw elements yet.</span>
                    ) : (
                      player2.deck.map((card, i) => (
                        <span key={i} className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-lg">
                          {card.symbol}
                        </span>
                      ))
                    )}
                  </div>

                  {player2.compounds.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1.5">
                      {player2.compounds.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-lg">
                          🧪 {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Formula Recipe Book (Right) */}
              <div className="lg:col-span-8 bg-white border-2 border-cyan-150 rounded-3xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b">Chemical Synthesis Formulas</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const sortedRecipes = [...COMPOUND_RECIPES].sort((a, b) => {
                      const canP1CraftA = a.required.every(req => {
                        const owned = player1.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });
                      const canP2CraftA = a.required.every(req => {
                        const owned = player2.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });
                      const craftableA = canP1CraftA || (canP2CraftA && !player2.isBot);

                      const canP1CraftB = b.required.every(req => {
                        const owned = player1.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });
                      const canP2CraftB = b.required.every(req => {
                        const owned = player2.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });
                      const craftableB = canP1CraftB || (canP2CraftB && !player2.isBot);

                      if (craftableA && !craftableB) return -1;
                      if (!craftableA && craftableB) return 1;
                      return 0;
                    });

                    return sortedRecipes.map(recipe => {
                      // Check if P1 or P2 can craft
                      const canP1Craft = recipe.required.every(req => {
                        const owned = player1.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });

                      const canP2Craft = recipe.required.every(req => {
                        const owned = player2.deck.filter(el => el.symbol === req.symbol).length;
                        return owned >= req.qty;
                      });

                      const isAnyCraftable = canP1Craft || (canP2Craft && !player2.isBot);

                      return (
                        <div key={recipe.id} className={`border rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-300 transition-all ${
                          isAnyCraftable 
                            ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' 
                            : 'border-slate-200 bg-slate-50/50'
                        }`}>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-black text-slate-800">{recipe.name}</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded font-mono">
                              {recipe.formula}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1 mt-2 text-xs font-medium text-slate-400">
                            <span>Requires:</span>
                            {recipe.required.map((req, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-black rounded-sm font-mono text-[10px]">
                                {req.symbol} ×{req.qty}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-slate-500 mt-3 italic">
                            "{recipe.powerup.desc}"
                          </p>
                        </div>

                        {/* Synthesis triggers */}
                        <div className="flex gap-2 mt-4 border-t border-slate-100 pt-3">
                          <button
                            disabled={!canP1Craft}
                            onClick={() => synthesizeCompound(recipe, 1)}
                            className={`flex-1 py-1.5 px-3 text-[10px] font-black rounded-lg transition-colors cursor-pointer ${
                              canP1Craft 
                                ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            P1 SYNTHESIZE
                          </button>

                          <button
                            disabled={!canP2Craft || player2.isBot}
                            onClick={() => synthesizeCompound(recipe, 2)}
                            className={`flex-1 py-1.5 px-3 text-[10px] font-black rounded-lg transition-colors cursor-pointer ${
                              canP2Craft && !player2.isBot
                                ? 'bg-amber-400 text-slate-900 hover:bg-amber-500' 
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            {player2.isBot ? 'BOT AUTO' : 'P2 SYNTHESIZE'}
                          </button>
                        </div>

                      </div>
                    );
                  })
                })() as any}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================= BATTLE ARENA ========================================= */}
        {playMode === 'battle' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Stage (Left / 8 grid cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Visual Health panel of fighters */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Player 1 Card HUD */}
                <div className={`bg-white border-2 p-5 rounded-3xl shadow-sm transition-all ${currentTurn === 1 ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-250'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-950 rounded-2xl flex items-center justify-center overflow-hidden border border-cyan-800">
                      <PixelCharacter
                        skin={activeSkin}
                        clothing={charClothing}
                        accessory={charAccessory}
                        hair={charHair}
                        facial={charFacial}
                        skinColor={WARDROBE_SKIN_COLORS.find(s => s.id === charSkinColor)?.value || '#FFD1A9'}
                        size="sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800">{player1.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase">{p1IsStunned ? '❄️ Frozen' : '🔋 Active'}</p>
                    </div>
                  </div>

                  {/* Health meter */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Atom Health (HP)</span>
                      <span>{player1.hp} / 500</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border">
                      <div 
                        className="bg-cyan-500 h-full transition-all duration-300"
                        style={{ width: `${(player1.hp / 500) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Shield meter */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-600" />
                    <span className="text-xs font-black text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                      Shield: {player1.shield}
                    </span>
                  </div>
                </div>

                {/* Player 2 Card HUD */}
                <div className={`bg-white border-2 p-5 rounded-3xl shadow-sm transition-all ${currentTurn === 2 ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-250'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-800">
                      <PixelCharacter
                        skin="solid_slate"
                        clothing="hazmat"
                        accessory="safety_goggles"
                        hair="wild_scientist"
                        facial="none"
                        skinColor="#CFD8DC"
                        size="sm"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800">{player2.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase">{p2IsStunned ? '❄️ Frozen' : '🔋 Active'}</p>
                    </div>
                  </div>

                  {/* Health meter */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Atom Health (HP)</span>
                      <span>{player2.hp} / 500</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${(player2.hp / 500) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Shield meter */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Shield: {player2.shield}
                    </span>
                  </div>
                </div>

              </div>

              {/* Hand Casting Panel (Active Player Deck options) */}
              <div className="bg-white border-2 border-cyan-150 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <h3 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-600" />
                    <span>
                      {vsBot && currentTurn === 2 ? "Opponent Hand Status" : `Your Combat Hand : ${currentTurn === 1 ? player1.name : player2.name}`}
                    </span>
                  </h3>

                  {!(vsBot && currentTurn === 2) && (
                    <div className="flex gap-2">
                      <button
                        onClick={skipTurn}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[10px] border border-rose-200 rounded-lg shadow-xs cursor-pointer transition-all"
                      >
                        ↩ Skip Turn
                      </button>
                      <button
                        onClick={triggerRecharge}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[10px] rounded-lg shadow-xs cursor-pointer transition-all"
                      >
                        ⚡ Ionic Recharge (+30 Shield)
                      </button>
                    </div>
                  )}
                </div>

                {(vsBot && currentTurn === 2) ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-sm text-amber-700 bg-amber-50/20 rounded-2xl border border-dashed border-amber-200 font-black animate-pulse">
                    <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                    <span>Doc Proton is formulating a strategic biochemical reaction...</span>
                  </div>
                ) : isBotThinking ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-sm text-slate-500 font-black">
                    <RefreshCw className="w-8 h-8 animate-spin text-cyan-500" />
                    <span>Doc Proton is examining atomic kinetics...</span>
                  </div>
                ) : (
                  <div>
                    {/* Combine Elements & Compounds cards into a hand display */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      {/* Element cards */}
                      {(currentTurn === 1 ? player1.deck : player2.deck).map(card => {
                        const cd = getCardCooldown('element', card.number);
                        return (
                          <div
                            key={`b-el-${card.number}`}
                            onClick={() => {
                              if (vsBot && currentTurn === 2) return;
                              if (cd > 0) {
                                triggerToast(`This element is cooling down! Wait ${cd} more turn${cd > 1 ? 's' : ''}.`);
                                return;
                              }
                              executeCombatMove('element', card.number);
                            }}
                            className={`border-2 rounded-xl p-3 flex flex-col justify-between relative cursor-pointer transition-all active:scale-95 text-center overflow-hidden ${
                              cd > 0 ? 'bg-slate-800 text-slate-400 border-slate-600 opacity-50 grayscale' : `${getCategoryColor(card.category)} hover:shadow-lg hover:-translate-y-1`
                            }`}
                          >
                            {/* Cooldown overlay banner */}
                            {cd > 0 && (
                              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-20 text-white font-black text-xs select-none">
                                <span className="text-lg animate-bounce">⏳</span>
                                <span className="mt-1 font-mono tracking-widest">{cd} TURN{cd > 1 ? 'S' : ''}</span>
                              </div>
                            )}

                            {/* Card frame inner border */}
                            <div className="absolute inset-[3px] rounded-lg border border-white/10 pointer-events-none" />

                            <div className="flex justify-between items-start text-[9px] font-bold">
                              <span className="bg-black/10 px-1 rounded text-[8px]">#{card.number}</span>
                              <span className="uppercase text-[6px] tracking-wider opacity-50">{card.category.slice(0, 3)}</span>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center my-1">
                              <span className="text-2xl font-black drop-shadow-sm">{card.symbol}</span>
                              <span className="text-[8px] font-bold opacity-60 truncate max-w-full">{card.name}</span>
                            </div>

                            <div className="border-t border-white/15 pt-1.5 text-[7px] leading-tight font-semibold opacity-70">
                              {card.powerup.name}
                            </div>

                            {/* Rarity accent dot */}
                            <span
                              className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getCategoryAccentColor(card.category) }}
                            />
                          </div>
                        );
                      })}

                      {/* Compound cards */}
                      {(currentTurn === 1 ? player1.compounds : player2.compounds).map(cId => {
                        const compound = COMPOUND_RECIPES.find(r => r.id === cId);
                        if (!compound) return null;
                        const cd = getCardCooldown('compound', compound.id);
                        return (
                          <div 
                            key={`b-cp-${compound.id}`}
                            onClick={() => {
                              if (vsBot && currentTurn === 2) return;
                              if (cd > 0) {
                                triggerToast(`This compound is cooling down! Wait ${cd} more turn${cd > 1 ? 's' : ''}.`);
                                return;
                              }
                              executeCombatMove('compound', compound.id);
                            }}
                            className={`border-2 rounded-2xl p-3 flex flex-col justify-between relative hover:border-emerald-400 cursor-pointer hover:shadow-md transition-all active:scale-95 text-center ${
                              cd > 0 ? 'bg-slate-800 text-slate-550 border-slate-600 opacity-60 grayscale' : 'bg-emerald-5 border-emerald-300'
                            }`}
                          >
                            {/* Cooldown overlay banner */}
                            {cd > 0 && (
                              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xxs flex flex-col items-center justify-center rounded-2xl z-20 text-white font-black text-xs select-none">
                                <span className="text-lg animate-bounce">⏳</span>
                                <span className="mt-1 font-mono tracking-widest">{cd} TURN{cd > 1 ? 'S' : ''}</span>
                              </div>
                            )}
                            <div className="text-right text-[9px] font-extrabold text-emerald-700">COMPOUND</div>
                            <div className="text-2xl font-bold font-mono tracking-tight text-emerald-800 my-1">{compound.formula}</div>
                            <p className="text-[10px] font-black text-slate-800 truncate">{compound.name}</p>

                            <div className="border-t border-dashed border-emerald-200 mt-2 pt-2 text-[8px] leading-tight font-semibold text-emerald-700">
                              <strong>{compound.powerup.name}:</strong> {compound.powerup.desc}
                            </div>
                          </div>
                        );
                      })}

                    </div>

                    {((currentTurn === 1 ? player1.deck.length : player2.deck.length) === 0 && 
                      (currentTurn === 1 ? player1.compounds.length : player2.compounds.length) === 0) && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        <p className="italic font-bold">No atomic cards remaining in hand!</p>
                        <p className="text-xs text-slate-400 mt-1">Please use "Ionic Recharge" to recharge shields or return to Synthesis Room.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Reaction Battle log & Side panels (Right / 4 grid cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Battle logger */}
              <div className="bg-slate-900 text-cyan-300 border-2 border-cyan-400 rounded-3xl p-5 shadow-lg h-[340px] flex flex-col">
                <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest pb-2 border-b border-cyan-800 mb-3 flex items-center justify-between">
                  <span>Chemical Reaction Log</span>
                  <Flame className="w-4 h-4 animate-pulse text-rose-450" />
                </h3>

                <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono leading-relaxed">
                  {battleLog.map((log, i) => (
                    <div key={i} className={`p-1.5 rounded ${i === 0 ? 'bg-cyan-950 text-white font-bold border-l-2 border-cyan-400' : 'text-slate-400 opacity-80'}`}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Back to Synthesis or Periodic shortcut buttons */}
              <div className="bg-white border-2 border-cyan-150 p-4 rounded-2xl shadow-xs text-center">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Want to synthesize more molecular cards?</p>
                <button
                  onClick={() => setPlayMode('synthesis')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 border text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  🧪 OPEN SYNTHESIS PROTOCOL
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================= ENDED PAGE ========================================= */}
        {playMode === 'ended' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-cyan-150 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-cyan-150 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-cyan-600 animate-bounce" />
            </div>

            <h2 className="text-3xl font-black font-display text-slate-900 uppercase">CHEMICAL DUEL CONCLUDED</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              The molecular structure has stabilized. We have a glorious victorious chemist on the board!
            </p>

            <div className="bg-slate-50 border rounded-2xl p-6 my-6 text-center">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Victor of the Arena</p>
              <h3 className="text-2xl font-black text-cyan-600 mt-1 uppercase">
                {battleWinner === 1 ? player1.name : player2.name}
              </h3>
              <p className="text-slate-500 text-xs mt-1">Conquered with legendary scientific precision!</p>

              <div className="grid grid-cols-2 gap-4 mt-6 border-t pt-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">P1 Score</p>
                  <p className="text-base font-black text-slate-800">{player1.score} PTS</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">P2 Score</p>
                  <p className="text-base font-black text-slate-800">{player2.score} PTS</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { audio.playSuccess(); startNewGame(vsBot); }}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm rounded-xl cursor-pointer shadow-xs transition-colors"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => { audio.playPop(); setPlayMode('setup'); }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl cursor-pointer border transition-colors"
              >
                MAIN MENU
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================= CHEMICAL COLLECTION TRAY OVERLAY ========================================= */}
        <AnimatePresence>
          {showTray && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white border-l-4 border-indigo-400 w-full max-w-xl h-full shadow-2xl flex flex-col relative"
              >
                {/* Header of Tray */}
                <div className="p-6 border-b bg-indigo-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-indigo-600 animate-pulse" />
                    <div>
                      <h2 className="text-lg font-black text-slate-900 font-display">ELEMENT COLLECTION TRAY</h2>
                      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Active Chemistry Reference Shelf</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTray(false)}
                    className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Player Selection Tabs */}
                <div className="grid grid-cols-2 border-b bg-slate-50 text-xs font-black">
                  <button
                    onClick={() => { setTrayActivePlayer(1); setSelectedTrayElement(null); }}
                    className={`py-3.5 border-r hover:bg-slate-100 transition-all ${trayActivePlayer === 1 ? 'bg-white text-cyan-600 border-b-2 border-b-cyan-500 font-black' : 'text-slate-400 font-bold'}`}
                  >
                    CYAN FORCE (P1) [{player1.deck.length}]
                  </button>
                  <button
                    onClick={() => { setTrayActivePlayer(2); setSelectedTrayElement(null); }}
                    className={`py-3.5 hover:bg-slate-100 transition-all ${trayActivePlayer === 2 ? 'bg-white text-amber-600 border-b-2 border-b-amber-500 font-black' : 'text-slate-400 font-bold'}`}
                  >
                    {player2.name} [{player2.deck.length}]
                  </button>
                </div>

                {/* Main Body of Tray */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Grid of collected element mini-cards */}
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Collected Elements</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                      {(trayActivePlayer === 1 ? player1.deck : player2.deck).map(card => {
                        const isSelected = selectedTrayElement?.number === card.number;
                        return (
                          <div
                            key={`tray-mini-${card.number}`}
                            onClick={() => setSelectedTrayElement(card)}
                            className={`aspect-square p-2 border-2 rounded-lg text-center cursor-pointer transition-all hover:scale-105 flex flex-col justify-between relative overflow-hidden ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-200 scale-105 shadow-lg' : 'border-slate-200 hover:border-slate-400'} ${getCategoryColor(card.category)}`}
                          >
                            <div className="absolute inset-[2px] rounded border border-white/10 pointer-events-none" />
                            <span className="text-[7px] font-bold text-left leading-none opacity-70">#{card.number}</span>
                            <span className="text-base font-black leading-tight drop-shadow-sm">{card.symbol}</span>
                            <span className="text-[6px] font-bold truncate block uppercase max-w-full opacity-60">{card.name}</span>
                            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 rounded-full" style={{ backgroundColor: getCategoryAccentColor(card.category) }} />
                          </div>
                        );
                      })}

                      {(trayActivePlayer === 1 ? player1.deck : player2.deck).length === 0 && (
                        <div className="col-span-full py-10 text-center text-xs italic text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed">
                          No raw chemical elements collected yet. Draft elements first!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Element Scientific Properties & combinations details */}
                  {selectedTrayElement ? (
                    <div className="border-t pt-5 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-black shadow-lg relative overflow-hidden ${getCategoryColor(selectedTrayElement.category)}`}>
                          <div className="absolute inset-[2px] rounded-lg border border-white/15 pointer-events-none" />
                          <span className="text-xl font-black drop-shadow-sm">{selectedTrayElement.symbol}</span>
                          <span className="text-[7px] opacity-50 font-bold">#{selectedTrayElement.number}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 leading-none">{selectedTrayElement.name}</h4>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 border text-[9px] font-black uppercase text-slate-600 rounded">
                            Category: {selectedTrayElement.category}
                          </span>
                        </div>
                      </div>

                      {/* Scientific properties */}
                      <div className="bg-slate-50 border rounded-2xl p-4 text-xs space-y-2">
                        <p className="text-slate-600 leading-relaxed font-semibold italic">
                          "{selectedTrayElement.clue}"
                        </p>
                        <div className="grid grid-cols-2 gap-2 border-t pt-2.5 font-bold text-slate-500 text-[10px]">
                          <div>Atomic Group: <span className="text-slate-800 font-extrabold">{selectedTrayElement.group}</span></div>
                          <div>Atomic Period: <span className="text-slate-800 font-extrabold">{selectedTrayElement.period}</span></div>
                        </div>
                        <div className="border-t pt-2 text-[10px] text-slate-500 font-bold">
                          Combat Move: <span className="text-cyan-700 font-black">{selectedTrayElement.powerup.name}</span>
                          <p className="font-semibold text-slate-600 mt-0.5 leading-tight">{selectedTrayElement.powerup.desc}</p>
                        </div>
                      </div>

                      {/* Combinations info */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          🧪 Possible Synthesis Combinations
                        </h4>
                        
                        <div className="space-y-2">
                          {COMPOUND_RECIPES.filter(recipe => 
                            recipe.required.some(req => req.symbol === selectedTrayElement.symbol)
                          ).map(recipe => {
                            // Check missing items
                            const activeCollection = trayActivePlayer === 1 ? player1.deck : player2.deck;
                            let hasPartners = true;
                            const ingredientsList = recipe.required.map(req => {
                              const inCollectCount = activeCollection.filter(el => el.symbol === req.symbol).length;
                              const requiredQty = req.qty;
                              const meet = inCollectCount >= requiredQty;
                              if (!meet) hasPartners = false;
                              return (
                                <span 
                                  key={req.symbol} 
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${meet ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
                                >
                                  {req.symbol} ({inCollectCount}/{requiredQty})
                                </span>
                              );
                            });

                             return (
                               <div key={recipe.id} className="border-2 border-indigo-150 rounded-2xl p-3.5 space-y-2.5 bg-indigo-50/10 hover:border-indigo-300 transition-colors">
                                 <div className="flex items-center justify-between">
                                   <div>
                                     <span className="text-sm font-black text-slate-800">{recipe.name}</span>
                                     <span className="text-xs font-black text-indigo-700 font-mono ml-2">({recipe.formula})</span>
                                   </div>
                                   <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${hasPartners ? 'bg-emerald-50 text-emerald-700 border border-emerald-350 animate-pulse' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                     {hasPartners ? 'Affordable ✅' : 'Missing Parts'}
                                   </span>
                                 </div>
                                 <div className="flex flex-wrap items-center gap-2">
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">Ingredients in Tray:</span>
                                   {ingredientsList}
                                 </div>
                                 <div className="text-[10px] font-semibold text-slate-500 leading-tight">
                                   <strong>Effect:</strong> {recipe.powerup.desc}
                                 </div>
                                 {hasPartners && (
                                   <button
                                     onClick={() => {
                                       synthesizeCompound(recipe, trayActivePlayer);
                                     }}
                                     className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-xl transition-all shadow-xs cursor-pointer text-center"
                                   >
                                     🧪 SYNTHESIZE THIS COMPOUND!
                                   </button>
                                 )}
                               </div>
                             );
                          })}

                          {COMPOUND_RECIPES.filter(recipe => 
                            recipe.required.some(req => req.symbol === selectedTrayElement.symbol)
                          ).length === 0 && (
                            <p className="text-xs italic text-slate-400 bg-slate-50 py-3 text-center border-2 border-dashed rounded-xl">
                              This element is highly stable and does not form common compounds in our list.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 text-center">
                      <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold uppercase tracking-wider">Select any element card from your collection above to view properties & synthesis partners.</p>
                    </div>
                  )}

                </div>

                {/* Bottom banner */}
                <div className="p-4 border-t bg-slate-50 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Academic Chemistry Reference Manual
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= LAST WINNING LINEUP SIDE DRAWER ========================================= */}
        <AnimatePresence>
          {showWinnerLineupMenu && lastWinnerLineup && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white border-l-4 border-amber-400 w-full max-w-sm h-full shadow-2xl flex flex-col relative"
              >
                {/* Header */}
                <div className="p-6 border-b bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <div>
                      <h2 className="text-xs font-black text-slate-900 font-display uppercase tracking-wider">CHAMPION'S WAVE LINEUP</h2>
                      <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Winning Cards of the Last Round</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWinnerLineupMenu(false)}
                    className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">ROUND CHAMPION</span>
                    <h3 className="text-lg font-black text-slate-800 mt-0.5">{lastWinnerLineup.playerName}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      These atomic element cards and compound spells formed the winning hand in the preceding round!
                    </p>
                  </div>

                  {/* Elements */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-1.5 border-b">CONQUERING ELEMENTS ({lastWinnerLineup.elements.length})</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {lastWinnerLineup.elements.map(card => (
                        <div key={card.number} className="border border-slate-200 rounded-xl p-2.5 bg-slate-50/50 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black bg-cyan-100/50 text-cyan-600 text-xs font-mono">
                            {card.symbol}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-black text-slate-800 leading-tight truncate">{card.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 font-mono">#{card.number}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compounds */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-1.5 border-b">CONQUERING COMPOUNDS ({lastWinnerLineup.compounds.length})</h4>
                    {lastWinnerLineup.compounds.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No compounds were crafted by the winner in the last round.</p>
                    ) : (
                      <div className="space-y-2">
                        {lastWinnerLineup.compounds.map((cId, idx) => {
                          const compound = COMPOUND_RECIPES.find(r => r.id === cId);
                          if (!compound) return null;
                          return (
                            <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-emerald-50/15 flex justify-between items-center text-xs">
                              <div className="min-w-0 pr-2">
                                <p className="font-extrabold text-slate-800 truncate">{compound.name}</p>
                                <p className="text-[10px] text-slate-500 italic mt-0.5 truncate">"{compound.powerup.desc}"</p>
                              </div>
                              <span className="shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-black rounded-md">
                                {compound.formula}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-amber-50/30 text-center text-[9px] font-black text-amber-600 uppercase tracking-widest">
                  🏆 Turned Tables Arena Champion Records
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= COURTSIDE RECLAIM MODAL ========================================= */}
        <AnimatePresence>
          {activeCourtsideCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-indigo-450 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative"
              >
                {/* Close Button only if ended or resolved */}
                <button
                  onClick={() => {
                    setActiveCourtsideCard(null);
                    setSelectedCourtsideRecipe(null);
                    setCourtsideInput('');
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto border-2 border-indigo-300">
                    <Shield className="w-6 h-6 text-indigo-700" />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">🏛️ COURTSIDE RECLAIM CHALLENGE</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mt-0.5">
                      FUSE PRE-OWNED ATOMS WITH STRAY: {activeCourtsideCard?.symbol}
                    </p>
                  </div>
                </div>

                {courtsideStatus === 'prompt' && (
                  <div className="mt-6 space-y-5">
                    {courtsideRecipes.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-500 leading-relaxed text-center">
                          Your chemical hand inventory has the requisite atoms to synthesize compounds leveraging <strong className="text-slate-800">{activeCourtsideCard?.name} ({activeCourtsideCard?.symbol})</strong>. Pick a compound recipe to fuse:
                        </p>

                        <div className="grid grid-cols-1 gap-2">
                          {courtsideRecipes.map(recipe => (
                            <button
                              key={recipe.id}
                              onClick={() => {
                                audio.playPop();
                                setSelectedCourtsideRecipe(recipe);
                              }}
                              className={`p-3 rounded-2xl text-left border-2 flex items-center justify-between cursor-pointer transition-all ${selectedCourtsideRecipe?.id === recipe.id ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-50' : 'border-slate-200 bg-white hover:border-slate-350'}`}
                            >
                              <div>
                                <span className="text-sm font-black text-slate-800 block">{recipe.name}</span>
                                <span className="text-xs font-black text-indigo-700 block font-mono">{recipe.formula}</span>
                              </div>
                              <span className="text-[10px] font-black text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                                Apply Recipe
                              </span>
                            </button>
                          ))}
                        </div>

                        {selectedCourtsideRecipe && (
                          <div className="bg-slate-50 border rounded-2xl p-4 space-y-4 shadow-inner">
                            <div className="text-center">
                              <p className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest leading-none">Spelling Examination</p>
                              <p className="text-sm font-mono font-black text-indigo-800 mt-2.5">
                                Fused Formula: {selectedCourtsideRecipe.formula}
                              </p>
                              <p className="text-xs text-slate-500 font-semibold mt-1">
                                Spell exactly the scientific or clean name of this alchemical compound.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-[10px] font-black text-slate-400 uppercase">
                                Enter Complete Compound Name:
                              </label>
                              <input
                                type="text"
                                value={courtsideInput}
                                onChange={e => setCourtsideInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCourtsideAnswer()}
                                placeholder={vsBot && currentTurn === 2 ? "Doc Proton is typing answer..." : "e.g. Water, Carbon Dioxide, Sodium Chloride..."} disabled={vsBot && currentTurn === 2}
                                className="w-full px-4 py-3 bg-white border-2 border-indigo-250 text-slate-800 font-semibold text-sm rounded-xl focus:border-indigo-500 focus:outline-none transition-all disabled:bg-amber-50/40 disabled:text-amber-900 disabled:border-amber-202"
                              />
                            </div>

                            <button
                              onClick={handleCourtsideAnswer}
                              disabled={vsBot && currentTurn === 2}
                              className={`w-full py-3.5 text-white font-black text-sm rounded-xl cursor-pointer transition-colors shadow-xs ${
                                vsBot && currentTurn === 2
                                  ? 'bg-amber-500 hover:bg-amber-600'
                                  : 'bg-indigo-600 hover:bg-indigo-750'
                              }`}
                            >
                              {vsBot && currentTurn === 2 ? "TYPING SPELLING RECLAIM EXAM..." : "LAUNCH CHEMICAL SPELLING VERIFICATION"}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-4">
                        <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-sm mx-auto">
                          Reclaim Blocked! You are missing companion chemical elements inside your tray matching <strong className="text-indigo-800">{activeCourtsideCard?.name} ({activeCourtsideCard?.symbol})</strong> recipes.
                        </p>

                        <div className="bg-slate-50 border rounded-2xl p-4 text-left text-xs space-y-1 max-w-md mx-auto">
                          <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[9px] mb-2">Compounding recipes supporting {activeCourtsideCard?.symbol}:</p>
                          {COMPOUND_RECIPES.filter(recipe => 
                            recipe.required.some(req => req.symbol === activeCourtsideCard?.symbol)
                          ).map(recipe => (
                            <div key={recipe.id} className="pb-1 text-[11px] font-semibold text-slate-600">
                              🧬 <span className="font-black text-indigo-700">{recipe.name} ({recipe.formula})</span> — needs: {recipe.required.map(req => `${req.qty}x ${req.symbol}`).join(' + ')}
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setActiveCourtsideCard(null);
                            setSelectedCourtsideRecipe(null);
                          }}
                          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer border"
                        >
                          RETURN TO LAB
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {courtsideStatus === 'success' && selectedCourtsideRecipe && (
                  <div className="mt-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-black leading-none animate-bounce">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 uppercase">COURTSIDE SYNTHESIS COMPLETED</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-xs mx-auto">
                        Amazing spelling accuracy! Fused <strong className="text-slate-800">{selectedCourtsideRecipe.name} ({selectedCourtsideRecipe.formula})</strong> successfully. The courtside element joins your collection.
                      </p>
                    </div>

                    <button
                      onClick={closeCourtsideModal}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl cursor-pointer transition-colors"
                    >
                      CONTINUE CHEM DRAFTING
                    </button>
                  </div>
                )}

                {courtsideStatus === 'failed' && (
                  <div className="mt-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-650 flex items-center justify-center mx-auto text-lg font-black leading-none animate-pulse">
                      ✗
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 uppercase">RECLAIM HARNESS OVERLOADED</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2 max-w-xs mx-auto">
                        Your attempts have expired or incorrect input spelling was submitted. The card remains frozen in Courtside.
                      </p>
                    </div>

                    <button
                      onClick={closeCourtsideModal}
                      className="w-full py-3 bg-slate-400 hover:bg-slate-500 text-white font-black text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      RETURN TO SELECTION GRID
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= COMBINATION ATTACK / CAST MODAL ========================================= */}
        <AnimatePresence>
          {comboElement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setComboElement(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center font-black shadow-md relative overflow-hidden ${getCategoryColor(comboElement.category)}`}>
                    <div className="absolute inset-[2px] rounded border border-white/10 pointer-events-none" />
                    <span className="text-[8px] leading-none opacity-85">#{comboElement.number}</span>
                    <span className="text-lg leading-none">{comboElement.symbol}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-none">ACTION PROPULSION FOR {comboElement.symbol}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chemical Arena Decisive Move</p>
                  </div>
                </div>

                {/* Options list */}
                <div className="py-5 space-y-5">
                  {/* Single Attack */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Option A: Single Atom Attack</h4>
                    <button
                      onClick={() => {
                        executeCombatMove('element', comboElement.number);
                        setComboElement(null);
                      }}
                      className="w-full text-left p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/10 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm font-black text-slate-800 block">Single Atom Strike ({comboElement.powerup.name})</span>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-snug">{comboElement.powerup.desc}</p>
                      </div>
                      <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-xl">
                        Strike!
                      </span>
                    </button>
                  </div>

                  {/* Combination Fused Attacks */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Option B: Synthesize & Combine Fused Attack</h4>
                    
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {COMPOUND_RECIPES.filter(recipe => 
                        recipe.required.some(req => req.symbol === comboElement.symbol)
                      ).map(recipe => {
                        const activeCollection = currentTurn === 1 ? player1.deck : player2.deck;
                        
                        let hasAfford = true;
                        const partnerDetails = recipe.required.map(req => {
                          const count = activeCollection.filter(el => el.symbol === req.symbol).length;
                          const affordable = count >= req.qty;
                          if (!affordable) hasAfford = false;
                          return (
                            <span 
                              key={req.symbol} 
                              className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${affordable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-650 border-red-200'}`}
                            >
                              {req.symbol} ({count}/{req.qty})
                            </span>
                          );
                        });

                        return (
                          <div 
                            key={`combo-cast-${recipe.id}`}
                            className="border-2 border-indigo-150 rounded-2xl p-4 space-y-3 bg-indigo-50/10 flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-center bg-transparent">
                              <div>
                                <span className="text-sm font-black text-slate-800 leading-none">{recipe.name}</span>
                                <span className="text-xs font-black text-indigo-700 font-mono ml-2">({recipe.formula})</span>
                              </div>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-lg ${hasAfford ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                {hasAfford ? 'Affordable ✅' : 'Locked'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Ingredients in Hand:</span>
                              {partnerDetails}
                            </div>

                            <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                              <strong>Attack Move:</strong> {recipe.powerup.name}: {recipe.powerup.desc}
                            </p>

                            {hasAfford ? (
                              <button
                                onClick={() => {
                                  executeCombinationAttackDirectly(recipe, currentTurn);
                                  setComboElement(null);
                                }}
                                className="w-full mt-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase rounded-xl cursor-pointer transition-colors shadow-xs"
                              >
                                FUSE ELEMENTS & CAST ATTACK!
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  audio.playPop();
                                  triggerToast(`You do not have that element yet! To synthesize ${recipe.name}, you need ${recipe.required.map(r => `${r.qty}x ${r.symbol}`).join(' + ')} in your collection.`);
                                }}
                                className="w-full mt-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border text-slate-450 font-extrabold text-xs uppercase rounded-xl cursor-not-allowed"
                              >
                                MISSING INGREDIENT CARDS
                              </button>
                            )}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Quit Confirmation Modal */}
        <AnimatePresence>
          {showQuitConfirm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border-2 border-red-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <span className="text-3xl">🏳️</span>
                </div>

                <h3 className="text-xl font-black text-slate-900">ABANDON PRACTICE DUEL?</h3>
                <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mt-1">Consequences: -50 XP penalty</p>
                
                <p className="text-sm text-slate-500 font-medium leading-relaxed my-4">
                  Surrendering now means resetting all elements drafted and compounds synthesized. Your progress this round will be lost, and a deduction of <strong className="text-slate-800">50 XP</strong> will be incurred.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => {
                      audio.playPop();
                      setShowQuitConfirm(false);
                    }}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase rounded-xl cursor-pointer transition-all"
                  >
                    Hold Position
                  </button>
                  <button
                    onClick={handleQuitPractice}
                    className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer shadow-md shadow-rose-200 transition-all border-b-4 border-rose-800 active:border-b-0"
                  >
                    Confirm Retreat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= PRACTICE PARAMETERS POPUP MODAL ========================================= */}
        <AnimatePresence>
          {showPracticeParamsModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border-2 border-cyan-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowPracticeParamsModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="text-center space-y-2 mb-6">
                  <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto border-2 border-cyan-150 text-cyan-650 font-bold text-xl leading-none">
                    🧪
                  </div>
                  <h3 className="text-xl font-black text-slate-900">PRACTICE PARAMETERS CONFIGURATOR</h3>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Configure Doc Proton AI capabilities before launch</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">Select AI Difficulty Matrix</label>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Alpha */}
                    <div 
                      onClick={() => { setDifficulty('alpha'); audio.playPop(); }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${difficulty === 'alpha' ? 'border-cyan-500 bg-cyan-50/25 shadow-xs' : 'border-slate-105 hover:border-slate-200 bg-slate-50/50'}`}
                    >
                      <div className="text-left pr-4">
                        <span className="font-extrabold text-slate-800 text-sm block">α Alpha Mode (Easy Practice)</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 leading-relaxed">Doc Proton spells slow (1.3s delay). 70% spelling accuracy. Passive shields deactivated.</span>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 text-[10px] font-black rounded-lg ${difficulty === 'alpha' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {difficulty === 'alpha' ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>

                    {/* Beta */}
                    <div 
                      onClick={() => { setDifficulty('beta'); audio.playPop(); }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${difficulty === 'beta' ? 'border-cyan-500 bg-cyan-50/25 shadow-xs' : 'border-slate-105 hover:border-slate-200 bg-slate-50/50'}`}
                    >
                      <div className="text-left pr-4">
                        <span className="font-extrabold text-slate-800 text-sm block">β Beta Mode (Standard Laboratory)</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 leading-relaxed">Balanced spells (850ms delay). 82% spelling accuracy. Doc starts with +15 shield.</span>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 text-[10px] font-black rounded-lg ${difficulty === 'beta' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {difficulty === 'beta' ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>

                    {/* Gamma */}
                    <div 
                      onClick={() => { setDifficulty('gamma'); audio.playPop(); }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${difficulty === 'gamma' ? 'border-cyan-500 bg-cyan-50/25 shadow-xs' : 'border-slate-105 hover:border-slate-200 bg-slate-50/50'}`}
                    >
                      <div className="text-left pr-4">
                        <span className="font-extrabold text-slate-800 text-sm block">γ Gamma Mode (Expert Quantum)</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 leading-relaxed">Hyper-efficient spells (450ms delay). 94% spelling accuracy. Doc starts with +40 shield!</span>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 text-[10px] font-black rounded-lg ${difficulty === 'gamma' ? 'bg-cyan-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {difficulty === 'gamma' ? 'ACTIVE' : 'SELECT'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setShowPracticeParamsModal(false);
                        // Setup Bot custom parameters based on selection
                        const botShield = difficulty === 'gamma' ? 40 : difficulty === 'beta' ? 15 : 0;
                        setPlayer2({
                          id: 2,
                          name: `Doc Proton (${difficulty === 'alpha' ? 'Alpha' : difficulty === 'beta' ? 'Beta' : 'Gamma'} Bot)`,
                          hp: 500,
                          shield: botShield,
                          deck: [],
                          compounds: [],
                          score: 0,
                          isBot: true
                        });
                        startNewGame(true);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-sm uppercase rounded-xl cursor-pointer shadow-md shadow-cyan-200 transition-all text-center flex items-center justify-center gap-2"
                    >
                      <span>🔥 LAUNCH LAB PRACTICE ROUND</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= BADGES MANAGER OVERLAY DRAWERS ========================================= */}
        <AnimatePresence>
          {showBadgesMenu && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-4 z-50">
              <motion.div 
                initial={{ x: 250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 250, opacity: 0 }}
                className="bg-white border-l border-slate-250 h-full max-w-md w-full shadow-2xl relative flex flex-col rounded-l-3xl p-6 sm:p-8 text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 shrink-0">
                  <div className="flex items-center gap-2.5 text-left">
                    <Award className="w-5 h-5 text-indigo-500 animate-bounce" />
                    <div>
                      <h3 className="text-xl font-black text-slate-800">EXPLORER HONORS & BADGES</h3>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">Customize up to 5 badges to display on your profile</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBadgesMenu(false)}
                    className="p-1 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-black uppercase text-slate-500 cursor-pointer border"
                  >
                    Close
                  </button>
                </div>

                {/* Badges Tally Info */}
                <div className="my-4 bg-indigo-50/50 p-4 border border-indigo-100 rounded-2xl shrink-0 text-left">
                  <p className="text-xs font-semibold text-slate-600 leading-normal">
                    {userBadges.length > 5 ? (
                      <span>You have unlocked <strong className="text-indigo-600">{userBadges.length} badges!</strong> Pick up to 5 to display on your profile card below. Unearned badges remain locked.</span>
                    ) : (
                      <span>You have unlocked <strong className="text-indigo-600">{userBadges.length} badges.</strong> Since you have 5 or less, they are all automatically displayed on your profile. Earn more XP to unlock more customizable choices!</span>
                    )}
                  </p>
                </div>

                {/* Scrollable Badges Grid */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
                  {Object.keys(ALL_GAME_BADGES).map(badgeId => {
                    const bInfo = ALL_GAME_BADGES[badgeId];
                    const isUnlocked = userBadges.includes(badgeId);
                    const isSelected = getProfileDisplayedBadges().includes(badgeId);

                    return (
                      <div
                        key={badgeId}
                        onClick={() => {
                          if (isUnlocked) {
                            handleToggleBadgeDisplay(badgeId);
                          } else {
                            triggerToast(`This badge is locked! Earn level rewards or gain XP to unlock.`);
                          }
                        }}
                        className={`relative p-4 border-2 rounded-2xl flex items-center justify-between gap-4 transition-all overflow-hidden ${
                          isUnlocked
                            ? (isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer')
                            : 'border-slate-100 bg-slate-50/50 opacity-50 grayscale'
                        }`}
                      >
                        {/* Card gradient background strip */}
                        {isUnlocked && (
                          <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${bInfo.gradient}`} />
                        )}

                        <div className="flex items-center gap-3 pl-2">
                          {/* Badge icon as card face */}
                          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${isUnlocked ? bInfo.gradient : 'from-slate-200 to-slate-300'} shadow-md flex items-center justify-center overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                            <span className="text-xl relative z-10 drop-shadow-sm">{bInfo.emoji}</span>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 leading-none">{bInfo.name}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">{bInfo.desc}</p>
                            {isUnlocked && (
                              <p className="text-[9px] text-indigo-500 mt-0.5 font-bold">{bInfo.unlockDesc}</p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isUnlocked ? (
                            <button className={`p-1.5 px-3 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all ${
                              isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}>
                              {isSelected ? 'DISPLAYED' : 'SELECT'}
                            </button>
                          ) : (
                            <span className="text-[9px] font-extrabold text-rose-500 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> LOCKED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= SYNTHESIS JOURNAL SIDE DRAWERS ========================================= */}
        <AnimatePresence>
          {showCompoundsMenu && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-4 z-50">
              <motion.div 
                initial={{ x: 250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 250, opacity: 0 }}
                className="bg-white border-l border-slate-250 h-full max-w-md w-full shadow-2xl relative flex flex-col rounded-l-3xl p-6 sm:p-8 text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 shrink-0">
                  <div className="flex items-center gap-2.5 text-left">
                    <BookOpen className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
                    <div>
                      <h3 className="text-xl font-black text-slate-800">MY CHEMICAL JOURNAL</h3>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">Historical logs of successfully synthesized molecules</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompoundsMenu(false)}
                    className="p-1 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-black uppercase text-slate-500 cursor-pointer border"
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 bg-cyan-50/50 border border-cyan-150 rounded-2xl my-4 text-left shrink-0 text-xs text-cyan-950 font-semibold leading-relaxed">
                  🔬 You have successfully spelling-crafted <strong className="text-cyan-700">{createdCompounds.length} molecules</strong> across active sessions! Unlocking all formulas marks you as a true Valence Master.
                </div>

                {/* Scrollable Journal List */}
                <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-left">
                  {createdCompounds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">No compounds spelling-crafted yet! Venture into Lab Practice Mode or shared battles and synthesize formulas like Water (H2O) to record your achievements here.</p>
                  ) : (
                    createdCompounds.map((compLog, idx) => {
                      const recipe = COMPOUND_RECIPES.find(r => r.id === compLog.id || r.name.toLowerCase() === compLog.name.toLowerCase());
                      return (
                        <div key={idx} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-2 text-left">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-xs font-black text-slate-800">{compLog.name}</h4>
                              <span className="text-[10px] font-mono font-black text-indigo-700">{compLog.formula}</span>
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-400">
                              {new Date(compLog.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {recipe?.powerup.desc || "A cohesive atomic structure serving robust battle properties."}
                          </p>
                          {recipe?.required && (
                            <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-dashed border-slate-200">
                              <span className="text-[8px] font-bold uppercase text-slate-400">Ingredients:</span>
                              {recipe.required.map(req => (
                                <span key={req.symbol} className="px-1.5 py-0.5 bg-white border text-[9px] font-bold rounded">
                                  {req.qty}x {req.symbol}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= CHAMPIONSHIP LINEUPS GALLERY DRAWER ========================================= */}
        <AnimatePresence>
          {showGalleryMenu && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-4 z-50">
              <motion.div 
                initial={{ x: 250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 250, opacity: 0 }}
                className="bg-white border-l border-slate-250 h-full max-w-md w-full shadow-2xl relative flex flex-col rounded-l-3xl p-6 sm:p-8 text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 shrink-0">
                  <div className="flex items-center gap-2.5 text-left">
                    <Award className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <div>
                      <h3 className="text-xl font-black text-slate-800 font-display">CHAMPIONS LINEUPS GALLERY</h3>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">Winning hand formations recorded during victorious matches</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGalleryMenu(false)}
                    className="p-1 px-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-black uppercase text-slate-500 cursor-pointer border"
                  >
                    Close
                  </button>
                </div>

                {/* Gallery scroller */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-1 mt-4 text-left">
                  {winningGallery.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <span className="text-4xl block leading-none">🏆</span>
                      <p className="text-xs text-slate-400 italic font-semibold max-w-xs mx-auto">Championship gallery is currently empty. Win active battles across 5 detailed rounds to capture your triumphant element decks here!</p>
                    </div>
                  ) : (
                    winningGallery.map((lineup, index) => (
                      <div key={index} className="border-2 border-slate-100 rounded-2.5xl p-4.5 bg-slate-50/50 space-y-3.5 relative">
                        <div className="flex items-center justify-between border-b pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🏆</span>
                            <span className="text-xs font-black text-slate-800">{lineup.playerName}</span>
                          </div>
                          <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2.5 py-0.5 border border-emerald-250 rounded-full uppercase">VICTORIOUS DECK</span>
                        </div>

                        {/* Elements deck cards */}
                        <div className="space-y-1.5 flex flex-col items-start">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Valence Hand Element Spells:</span>
                          <div className="grid grid-cols-2 gap-2 w-full text-left">
                            {lineup.elements.map(card => (
                              <div key={card.number} className="p-2 border border-slate-200 rounded-xl bg-white flex items-center gap-2 text-xs">
                                <span className="px-1.5 py-0.5 bg-cyan-50 text-cyan-700 font-bold font-mono rounded">
                                  {card.symbol}
                                </span>
                                <span className="font-extrabold text-slate-800 truncate">{card.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Compounds synthesized */}
                        {lineup.compounds.length > 0 && (
                          <div className="space-y-1.5 pt-1.5 border-t border-dashed border-slate-200 flex flex-col items-start">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block font-sans">Molecules Spelling Crafted:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {lineup.compounds.map((cId, idx) => {
                                const recipe = COMPOUND_RECIPES.find(r => r.id === cId);
                                if (!recipe) return null;
                                return (
                                  <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold rounded-lg font-mono">
                                    {recipe.name} ({recipe.formula})
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ========================================= FRIEND PROFILE INSPECT MODAL ========================================= */}
        <AnimatePresence>
          {showFriendInspectModal && activeInspectedFriend && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white border-2 border-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowFriendInspectModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-950 rounded-2.5xl flex items-center justify-center mx-auto border-4 border-slate-850 shadow-lg overflow-hidden">
                    <PixelCharacter
                      skin={activeInspectedFriend.activeSkin || activeInspectedFriend.skin || 'spectral_cyan'}
                      clothing={activeInspectedFriend.pixelChar?.clothing || 'lab_coat'}
                      accessory={activeInspectedFriend.pixelChar?.accessory || 'safety_goggles'}
                      hair={activeInspectedFriend.pixelChar?.hair || 'wild_scientist'}
                      facial={activeInspectedFriend.pixelChar?.facial || 'none'}
                      skinColor={activeInspectedFriend.pixelChar?.skinColor || '#FFD1A9'}
                      size="lg"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 font-display">{activeInspectedFriend.name}</h3>
                    <p className="text-xs text-indigo-650 font-black uppercase tracking-wider mt-0.5">🧪 LEVEL {activeInspectedFriend.level} PARTNER</p>
                  </div>

                  {/* Badges list */}
                  <div className="space-y-2 pt-3 border-t text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Displayed Profile Badges</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeInspectedFriend.badges.map(badgeId => {
                        const bInfo = ALL_GAME_BADGES[badgeId];
                        if (!bInfo) return null;
                        return (
                          <div 
                            key={badgeId} 
                            className={`px-3 py-1.5 bg-gradient-to-br ${bInfo.gradient} border ${bInfo.border} rounded-xl text-[10px] font-black flex items-center gap-1.5 ${bInfo.text} shadow-sm uppercase tracking-wide`}
                          >
                            <span>{bInfo.emoji}</span>
                            <span>{bInfo.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Character stats */}
                  <div className="space-y-2 pt-3 border-t text-left">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active Wardrobe Configuration</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
                      <div className="p-2 bg-slate-50 rounded-xl border">🧥 Coat: <strong className="text-slate-800 uppercase text-[9px]">{(activeInspectedFriend.pixelChar?.clothing || 'lab_coat').replace('_', ' ')}</strong></div>
                      <div className="p-2 bg-slate-50 rounded-xl border">👓 Visor: <strong className="text-slate-800 uppercase text-[9px]">{(activeInspectedFriend.pixelChar?.accessory || 'safety_goggles').replace('_', ' ')}</strong></div>
                      <div className="p-2 bg-slate-50 rounded-xl border">💇 Hair: <strong className="text-slate-800 uppercase text-[9px]">{(activeInspectedFriend.pixelChar?.hair || 'wild_scientist').replace('_', ' ')}</strong></div>
                      <div className="p-2 bg-slate-50 rounded-xl border">👕 Suit Theme: <strong className="text-slate-800 uppercase text-[9px]">{(activeInspectedFriend.activeSkin || activeInspectedFriend.skin || 'spectral_cyan').replace('_', ' ')}</strong></div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setShowFriendInspectModal(false)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Dismiss Inspector
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
