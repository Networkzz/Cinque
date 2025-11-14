export type UILanguage = 'es' | 'en';

export interface Translations {
  title: string;
  subtitle: string;
  normal: string;
  oddOrEven: string;
  battle: string;
  chooseYourBet: string;
  chooseBattleMode: string;
  bestOf3: string;
  bestOf5: string;
  odd: string;
  even: string;
  rolling: string;
  rollDice: string;
  rollAgain: string;
  isTheWinner: string;
  winsTheBattle: string;
  textToSpeechLanguage: string;
  roll: string;
  of: string;
  count: string;
  selectNumbers: string;
  chooseNumbers: string;
  selectAtLeastTwo: string;
  playerName: string;
  enterPlayerName: string;
  enterPlayerNameForBattle: string;
  betOnNumber: string;
  selectYourBet: string;
  addPlayer: string;
  removePlayer: string;
  rollHistory: string;
  noRollsYet: string;
  winsWith: string;
  betOn: string;
  players: string;
}

export const translations: Record<UILanguage, Translations> = {
  es: {
    title: '🎲 Juego de Dados',
    subtitle: '¡Tira el dado y escucha el resultado!',
    normal: 'Normal',
    oddOrEven: 'Par o Impar',
    battle: 'Batalla',
    chooseYourBet: 'Elige tu apuesta:',
    chooseBattleMode: 'Elige el modo de batalla:',
    bestOf3: 'Mejor de 3',
    bestOf5: 'Mejor de 5',
    odd: 'Impar',
    even: 'Par',
    rolling: 'Tirando...',
    rollDice: 'Tirar Dado',
    rollAgain: 'Tirar de Nuevo',
    isTheWinner: '¡es el ganador!',
    winsTheBattle: '¡gana la batalla!',
    textToSpeechLanguage: 'Idioma de Texto a Voz:',
    roll: 'Tirada',
    of: 'de',
    count: 'Conteo:',
    selectNumbers: 'Seleccionar Números',
    chooseNumbers: 'Elige los números que pueden aparecer:',
    selectAtLeastTwo: 'Selecciona al menos dos números',
    playerName: 'Nombre del Jugador',
    enterPlayerName: 'Ingresa tu nombre (opcional)',
    enterPlayerNameForBattle: 'Ingresa tu nombre para la batalla (opcional)',
    betOnNumber: 'Apostar por Número',
    selectYourBet: 'Selecciona tu apuesta:',
    addPlayer: 'Agregar Jugador',
    removePlayer: 'Eliminar',
    rollHistory: 'Historial de Tiradas',
    noRollsYet: 'Aún no hay tiradas',
    winsWith: 'gana con',
    betOn: 'apostó por',
    players: 'Jugadores',
  },
  en: {
    title: '🎲 Dice Game',
    subtitle: 'Roll the dice and hear the result!',
    normal: 'Normal',
    oddOrEven: 'Odd or Even',
    battle: 'Battle',
    chooseYourBet: 'Choose your bet:',
    chooseBattleMode: 'Choose battle mode:',
    bestOf3: 'Best of 3',
    bestOf5: 'Best of 5',
    odd: 'Odd',
    even: 'Even',
    rolling: 'Rolling...',
    rollDice: 'Roll Dice',
    rollAgain: 'Roll Again',
    isTheWinner: 'is the winner!',
    winsTheBattle: 'wins the battle!',
    textToSpeechLanguage: 'Text-to-Speech Language:',
    roll: 'Roll',
    of: 'of',
    count: 'Count:',
    selectNumbers: 'Select Numbers',
    chooseNumbers: 'Choose which numbers can appear:',
    selectAtLeastTwo: 'Select at least two numbers',
    playerName: 'Player Name',
    enterPlayerName: 'Enter your name (optional)',
    enterPlayerNameForBattle: 'Enter your name for battle (optional)',
    betOnNumber: 'Bet on Number',
    selectYourBet: 'Select your bet:',
    addPlayer: 'Add Player',
    removePlayer: 'Remove',
    rollHistory: 'Roll History',
    noRollsYet: 'No rolls yet',
    winsWith: 'wins with',
    betOn: 'bet on',
    players: 'Players',
  },
};

export const getTranslation = (lang: UILanguage): Translations => {
  return translations[lang] || translations.es;
};

