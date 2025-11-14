export interface RollEntry {
  value: number;
  playerName: string | null;
  timestamp: number;
  gameMode: string;
}

const STORAGE_KEY = 'dice-game-rolls';
const MAX_ROLLS = 10;

export const saveRoll = (roll: RollEntry): void => {
  try {
    const existingRolls = getRolls();
    const newRolls = [roll, ...existingRolls].slice(0, MAX_ROLLS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRolls));
  } catch (error) {
    console.warn('Failed to save roll to localStorage:', error);
  }
};

export const getRolls = (): RollEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as RollEntry[];
  } catch (error) {
    console.warn('Failed to load rolls from localStorage:', error);
    return [];
  }
};

export const clearRolls = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear rolls from localStorage:', error);
  }
};

