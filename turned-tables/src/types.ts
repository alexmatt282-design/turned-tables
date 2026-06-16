export type GameType = 'dashboard' | 'soup' | 'turned_tables' | 'mathsweeper';

export interface SoupTargetWord {
  word: string;
  category: 'Animal' | 'Nature' | 'Object' | 'Food';
  hint: string;
  svgIcon: string; // Describes what kind of cartoon SVG to draw
}

export interface TracingPath {
  id: string; // letter or number, e.g., 'A', '5'
  points: { x: number; y: number }[]; // Coordinates normalized to a 100x100 grid
  type: 'letter' | 'number';
}

export interface EarlyBirdProblem {
  num1: number;
  operation: '+' | '-';
  num2: number;
  correctAnswer: number;
  options: number[]; // usually 3 options
}

export interface UserStats {
  stars: number;
  soupWordsSpelled: string[];
  tracedItems: string[];
  birdProblemsSolved: number;
}
