// Profanity filter for multiplayer chat
// Censors inappropriate language including slurs, swear words, and explicit content

const PROFANITY_LIST = [
  // Common slurs (racist, homophobic, ableist, etc.)
  'nigger', 'nigga', 'nig', 'chink', 'spic', 'kike', 'fag', 'faggot', 'dyke',
  'retard', 'retarded', 'tranny', 'coon', 'gook', 'wetback', 'sandnigger',
  // Strong profanity
  'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker', 'shit', 'shitting',
  'bullshit', 'dipshit', 'horseshit', 'piss', 'pissing', 'pissed',
  'cunt', 'twat', 'cock', 'dick', 'prick', 'pussy', 'bitch', 'bastard',
  'asshole', 'dumbass', 'dumbfuck', 'jackass', 'dumbshit',
  // Explicit sexual terms
  'penis', 'vagina', 'anal', 'blowjob', 'handjob', 'cum', 'semen', 'sperm',
  'orgasm', 'orgy', 'masturbat', 'ejaculat', 'porn', 'porno', 'xxx',
  // Other inappropriate
  'pedophile', 'perv', 'rape', 'raping', 'rapist', 'molester',
];

// Build a regex that matches whole words and common variations
const PROFANITY_REGEX = new RegExp(
  `\\b(${PROFANITY_LIST.join('|')})s?\\b`,
  'gi'
);

// Additional patterns for common bypass attempts
const BYPASS_PATTERNS = [
  // Leetspeak substitutions
  { pattern: /[4@]/g, replacement: 'a' },
  { pattern: /[3]/g, replacement: 'e' },
  { pattern: /[1!|]/g, replacement: 'i' },
  { pattern: /[0]/g, replacement: 'o' },
  { pattern: /[5$]/g, replacement: 's' },
];

/**
 * Normalize text to detect bypass attempts (leetspeak, etc.)
 */
function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  for (const { pattern, replacement } of BYPASS_PATTERNS) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

/**
 * Create a censored version of text with asterisks
 */
function censorWord(word: string): string {
  const len = word.length;
  if (len <= 2) return '*'.repeat(len);
  // Keep first and last char, censor middle
  return word[0] + '*'.repeat(len - 2) + word[len - 1];
}

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  const normalized = normalizeText(text);
  return PROFANITY_REGEX.test(normalized);
}

/**
 * Filter profanity from text, replacing bad words with asterisks
 */
export function filterProfanity(text: string): string {
  const normalized = normalizeText(text);
  let result = text;
  let match: RegExpExecArray | null;

  // Create a new regex to iterate through matches
  const regex = new RegExp(PROFANITY_REGEX.source, 'gi');

  while ((match = regex.exec(normalized)) !== null) {
    // Find the original word in the non-normalized text
    const originalWord = text.substring(match.index, match.index + match[0].length);
    const censored = censorWord(originalWord);
    result = result.substring(0, match.index) + censored + result.substring(match.index + match[0].length);
  }

  return result;
}

/**
 * Filter and return both the filtered text and whether profanity was found
 */
export function filterChatMessage(text: string): { filtered: string; hadProfanity: boolean } {
  const normalized = normalizeText(text);
  const hadProfanity = PROFANITY_REGEX.test(normalized);

  if (!hadProfanity) {
    return { filtered: text, hadProfanity: false };
  }

  return { filtered: filterProfanity(text), hadProfanity: true };
}
