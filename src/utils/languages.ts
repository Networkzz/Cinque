export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
];

export const getNumberInLanguage = (number: number, languageCode: string): string => {
  const numberMap: { [key: string]: { [key: number]: string } } = {
    'en-US': { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' },
    'es-ES': { 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis' },
    'fr-FR': { 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six' },
    'de-DE': { 1: 'eins', 2: 'zwei', 3: 'drei', 4: 'vier', 5: 'fünf', 6: 'sechs' },
    'it-IT': { 1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei' },
    'pt-BR': { 1: 'um', 2: 'dois', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis' },
    'nl-NL': { 1: 'één', 2: 'twee', 3: 'drie', 4: 'vier', 5: 'vijf', 6: 'zes' },
  };

  const langMap = numberMap[languageCode] || numberMap['en-US'];
  return langMap[number] || number.toString();
};

