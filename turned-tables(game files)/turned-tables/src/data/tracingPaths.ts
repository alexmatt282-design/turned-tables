import { TracingPath } from '../types';

// Let's create beautiful hand-crafted tracing coordinates on a 100x100 grid for letters A-Z and 0-9.
// Hand-designed so the stroke flows logically from start to end, ending directly at the cartoon Leaf!
export const TRACING_PATHS: Record<string, { points: { x: number; y: number }[]; type: 'letter' | 'number' }> = {
  // --- LETTERS ---
  A: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Start bottom-left
      { x: 50, y: 20 }, // Top peak
      { x: 75, y: 80 }, // Bottom-right
      { x: 60, y: 55 }, // Inside link right
      { x: 30, y: 55 }  // Inside link left (continuous flow)
    ]
  },
  B: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Bottom-left
      { x: 25, y: 20 }, // Top-left
      { x: 60, y: 20 }, // Top curve right
      { x: 60, y: 48 }, // Middle center right
      { x: 30, y: 48 }, // Middle center left
      { x: 65, y: 48 }, // Re-enter bottom bulb
      { x: 65, y: 80 }, // Bottom curve right
      { x: 25, y: 80 }  // Back to bottom-left
    ]
  },
  C: {
    type: 'letter',
    points: [
      { x: 75, y: 30 }, // Top open end
      { x: 50, y: 20 }, // Top curve
      { x: 25, y: 50 }, // Left edge
      { x: 50, y: 80 }, // Bottom curve
      { x: 75, y: 70 }  // Bottom open end
    ]
  },
  D: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Bottom-left
      { x: 25, y: 20 }, // Top-left
      { x: 55, y: 20 }, // Top-right curve
      { x: 75, y: 50 }, // Far-right point
      { x: 55, y: 80 }, // Bottom-right curve
      { x: 25, y: 80 }  // Close path
    ]
  },
  E: {
    type: 'letter',
    points: [
      { x: 75, y: 20 }, // Top right
      { x: 25, y: 20 }, // Top left
      { x: 25, y: 50 }, // Middle left
      { x: 60, y: 50 }, // Middle extension
      { x: 25, y: 50 }, // Recoil
      { x: 25, y: 80 }, // Bottom left
      { x: 75, y: 80 }  // Bottom right
    ]
  },
  F: {
    type: 'letter',
    points: [
      { x: 75, y: 20 }, // Top right
      { x: 25, y: 20 }, // Top left
      { x: 25, y: 50 }, // Middle left
      { x: 60, y: 50 }, // Middle extension
      { x: 25, y: 50 }, // Return
      { x: 25, y: 80 }  // Bottom left
    ]
  },
  G: {
    type: 'letter',
    points: [
      { x: 75, y: 30 }, // Top right start
      { x: 50, y: 20 }, // Top curve
      { x: 25, y: 50 }, // Left side
      { x: 45, y: 80 }, // Bottom curve
      { x: 70, y: 80 }, // Bottom right
      { x: 70, y: 55 }, // Bar upward
      { x: 50, y: 55 }  // Bar inside
    ]
  },
  H: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Left Top
      { x: 25, y: 80 }, // Left Bottom
      { x: 25, y: 50 }, // Left Center
      { x: 75, y: 50 }, // Right Center
      { x: 75, y: 20 }, // Right Top
      { x: 75, y: 80 }  // Right Bottom
    ]
  },
  I: {
    type: 'letter',
    points: [
      { x: 30, y: 20 }, // Top bar left
      { x: 70, y: 20 }, // Top bar right
      { x: 50, y: 20 }, // Top bar mid
      { x: 50, y: 80 }, // Bottom stem
      { x: 30, y: 80 }, // Bottom bar left
      { x: 70, y: 80 }  // Bottom bar right
    ]
  },
  J: {
    type: 'letter',
    points: [
      { x: 35, y: 20 }, // Top cap left
      { x: 75, y: 20 }, // Top cap right
      { x: 55, y: 20 }, // Stem start
      { x: 55, y: 70 }, // Stem down
      { x: 45, y: 80 }, // Curve bottom
      { x: 25, y: 70 }  // Hook up
    ]
  },
  K: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Stem top
      { x: 25, y: 80 }, // Stem bottom
      { x: 25, y: 50 }, // Stem middle
      { x: 70, y: 20 }, // Top diagonal
      { x: 25, y: 50 }, // Midpoint return
      { x: 70, y: 80 }  // Bottom diagonal
    ]
  },
  L: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Stem top
      { x: 25, y: 80 }, // Stem bottom
      { x: 75, y: 80 }  // Base right
    ]
  },
  M: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Bottom left
      { x: 25, y: 20 }, // Top left
      { x: 50, y: 55 }, // Middle dip
      { x: 75, y: 20 }, // Top right
      { x: 75, y: 80 }  // Bottom right
    ]
  },
  N: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Bottom left
      { x: 25, y: 20 }, // Top left
      { x: 75, y: 80 }, // Slant bottom right
      { x: 75, y: 20 }  // Top right
    ]
  },
  O: {
    type: 'letter',
    points: [
      { x: 50, y: 20 }, // Top center
      { x: 75, y: 35 }, // Right curve
      { x: 75, y: 65 }, // Right curve lower
      { x: 50, y: 80 }, // Bottom center
      { x: 25, y: 65 }, // Left curve lower
      { x: 25, y: 35 }, // Left curve upper
      { x: 50, y: 20 }  // Top center close
    ]
  },
  P: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Stem bottom
      { x: 25, y: 20 }, // Stem top
      { x: 65, y: 20 }, // Loop top right
      { x: 65, y: 50 }, // Loop bottom right
      { x: 25, y: 50 }  // Loop close mid
    ]
  },
  Q: {
    type: 'letter',
    points: [
      { x: 50, y: 20 }, // Top center
      { x: 75, y: 35 }, // Right upper
      { x: 75, y: 65 }, // Right lower
      { x: 50, y: 80 }, // Bottom
      { x: 25, y: 65 }, // Left lower
      { x: 25, y: 35 }, // Left upper
      { x: 50, y: 20 }, // Close loop
      { x: 55, y: 55 }, // Tail inner
      { x: 75, y: 80 }  // Tail outer
    ]
  },
  R: {
    type: 'letter',
    points: [
      { x: 25, y: 80 }, // Bottom left
      { x: 25, y: 20 }, // Top left
      { x: 65, y: 20 }, // Loop top right
      { x: 65, y: 50 }, // Loop mid right
      { x: 25, y: 50 }, // Loop close mid
      { x: 45, y: 50 }, // Branch point
      { x: 75, y: 80 }  // Slant right bottom
    ]
  },
  S: {
    type: 'letter',
    points: [
      { x: 75, y: 25 }, // Top-right start
      { x: 50, y: 20 }, // Top crest
      { x: 25, y: 35 }, // Top-left curve
      { x: 50, y: 50 }, // S-intersection mid
      { x: 75, y: 65 }, // Bottom-right bulb
      { x: 50, y: 80 }, // Bottom valley
      { x: 25, y: 70 }  // Bottom-left ending
    ]
  },
  T: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Top left
      { x: 75, y: 20 }, // Top right
      { x: 50, y: 20 }, // Top mid
      { x: 50, y: 80 }  // Bottom stem
    ]
  },
  U: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Left top
      { x: 25, y: 65 }, // Left drop
      { x: 50, y: 80 }, // Bottom curve
      { x: 75, y: 65 }, // Right rise
      { x: 75, y: 20 }  // Right top
    ]
  },
  V: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Left top
      { x: 50, y: 80 }, // Middle tip
      { x: 75, y: 20 }  // Right top
    ]
  },
  W: {
    type: 'letter',
    points: [
      { x: 20, y: 20 }, // Far-left top
      { x: 35, y: 80 }, // Left bottom dip
      { x: 50, y: 45 }, // Middle peak
      { x: 65, y: 80 }, // Right bottom dip
      { x: 80, y: 20 }  // Far-right top
    ]
  },
  X: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Top-left
      { x: 75, y: 80 }, // Bottom-right
      { x: 50, y: 50 }, // Intersect crossover
      { x: 75, y: 20 }, // Top-right
      { x: 25, y: 80 }  // Bottom-left
    ]
  },
  Y: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Top left
      { x: 50, y: 50 }, // Center node
      { x: 75, y: 20 }, // Top right
      { x: 50, y: 50 }, // Return center
      { x: 50, y: 85 }  // Bottom tail
    ]
  },
  Z: {
    type: 'letter',
    points: [
      { x: 25, y: 20 }, // Top left
      { x: 75, y: 20 }, // Top right
      { x: 25, y: 80 }, // Bottom left slant
      { x: 75, y: 80 }  // Bottom right
    ]
  },

  // --- NUMBERS ---
  '0': {
    type: 'number',
    points: [
      { x: 50, y: 20 },
      { x: 75, y: 35 },
      { x: 75, y: 65 },
      { x: 50, y: 80 },
      { x: 25, y: 65 },
      { x: 25, y: 35 },
      { x: 50, y: 20 }
    ]
  },
  '1': {
    type: 'number',
    points: [
      { x: 30, y: 35 }, // Hook start
      { x: 50, y: 20 }, // Top peak
      { x: 50, y: 80 }, // Base straight down
      { x: 30, y: 80 }, // Base left
      { x: 70, y: 80 }  // Base right
    ]
  },
  '2': {
    type: 'number',
    points: [
      { x: 25, y: 35 }, // Left lobe start
      { x: 50, y: 20 }, // Top bulb
      { x: 75, y: 35 }, // Right curve
      { x: 45, y: 60 }, // Diagonal descend
      { x: 25, y: 80 }, // Bottom-left corner
      { x: 75, y: 80 }  // Floor slide
    ]
  },
  '3': {
    type: 'number',
    points: [
      { x: 25, y: 25 }, // Top left start
      { x: 75, y: 25 }, // Top bar right
      { x: 45, y: 48 }, // Middle center zip
      { x: 75, y: 62 }, // Bottom lobe outer
      { x: 50, y: 80 }, // Bottom curve floor
      { x: 25, y: 70 }  // Hook up
    ]
  },
  '4': {
    type: 'number',
    points: [
      { x: 60, y: 20 }, // High vertical start
      { x: 25, y: 60 }, // Slanted drop left
      { x: 75, y: 60 }, // Horizontal crossbar right
      { x: 60, y: 60 }, // Midpoint return
      { x: 60, y: 80 }  // Stem drop bottom
    ]
  },
  '5': {
    type: 'number',
    points: [
      { x: 70, y: 20 }, // Top-right cap start
      { x: 30, y: 20 }, // Top-left cap
      { x: 30, y: 48 }, // Drop stem
      { x: 70, y: 48 }, // Curve belly right
      { x: 70, y: 78 }, // Bottom curve
      { x: 30, y: 78 }  // Hook left
    ]
  },
  '6': {
    type: 'number',
    points: [
      { x: 65, y: 20 }, // High swoop right
      { x: 35, y: 45 }, // Arch down left
      { x: 30, y: 65 }, // Left wall bottom
      { x: 50, y: 80 }, // Bottom basement
      { x: 70, y: 65 }, // Right wall bottom
      { x: 55, y: 50 }, // Top loop lid
      { x: 35, y: 55 }  // Nest inside left
    ]
  },
  '7': {
    type: 'number',
    points: [
      { x: 25, y: 20 }, // Top horizontal left
      { x: 75, y: 20 }, // Top horizontal right
      { x: 40, y: 80 }  // Long slanted leg
    ]
  },
  '8': {
    type: 'number',
    points: [
      { x: 50, y: 50 }, // Center cross start
      { x: 30, y: 35 }, // Top-left loop
      { x: 50, y: 20 }, // Top crest
      { x: 70, y: 35 }, // Top-right loop
      { x: 50, y: 50 }, // Recovere core
      { x: 25, y: 65 }, // Bottom-left loop
      { x: 50, y: 80 }, // Bottom valley
      { x: 75, y: 65 }, // Bottom-right loop
      { x: 50, y: 50 }  // Finish center
    ]
  },
  '9': {
    type: 'number',
    points: [
      { x: 55, y: 55 }, // Loop origin right bottom
      { x: 35, y: 50 }, // Left bottom of scoop
      { x: 35, y: 32 }, // Left top of scoop
      { x: 55, y: 20 }, // Top loop peak
      { x: 72, y: 32 }, // Right outer side
      { x: 72, y: 55 }, // Right side lower
      { x: 55, y: 55 }, // High link close
      { x: 72, y: 55 }, // Re-connect
      { x: 72, y: 80 }, // Straight down leg
      { x: 45, y: 80 }  // Bottom hook left
    ]
  }
};
