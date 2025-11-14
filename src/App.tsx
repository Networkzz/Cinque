import { useState } from 'react';
import Dice from './components/Dice';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { languages, getNumberInLanguage, type Language } from './utils/languages';
import { getTranslation, type UILanguage } from './utils/translations';
import './App.css';

type GameMode = 'normal' | 'odd-even' | 'battle' | 'select-numbers';
type OddEvenChoice = 'odd' | 'even' | null;
type BattleMode = 'best-of-3' | 'best-of-5' | null;

function App() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [uiLanguage, setUiLanguage] = useState<UILanguage>('es');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [oddEvenChoice, setOddEvenChoice] = useState<OddEvenChoice>(null);
  const [battleMode, setBattleMode] = useState<BattleMode>(null);
  const [battleRolls, setBattleRolls] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const { speak } = useTextToSpeech({ language: selectedLanguage });
  const t = getTranslation(uiLanguage);

  const rollDice = () => {
    if (isRolling) return;
    if (gameMode === 'odd-even' && !oddEvenChoice) return;
    if (gameMode === 'battle' && !battleMode) return;
    if (gameMode === 'select-numbers' && selectedNumbers.length < 2) return;
    
    // Check if battle already has a winner
    if (gameMode === 'battle' && battleMode && winner) return;

    setIsRolling(true);
    setDiceValue(null);
    if (gameMode !== 'battle') {
      setWinner(null);
    }

    // Simulate rolling animation
    setTimeout(() => {
      let newValue: number;
      
      // For select-numbers mode, only roll from selected numbers
      if (gameMode === 'select-numbers' && selectedNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
        newValue = selectedNumbers[randomIndex];
      } else {
        // Normal roll (1-6)
        newValue = Math.floor(Math.random() * 6) + 1;
      }
      
      setDiceValue(newValue);
      setIsRolling(false);

      // Handle battle mode
      if (gameMode === 'battle' && battleMode) {
        const newRolls = [...battleRolls, newValue];
        setBattleRolls(newRolls);
        
        // Calculate counts for each number
        const counts: { [key: number]: number } = {};
        newRolls.forEach(roll => {
          counts[roll] = (counts[roll] || 0) + 1;
        });
        
        // Determine winning threshold: best-of-3 needs 2, best-of-5 needs 3
        const winningThreshold = battleMode === 'best-of-3' ? 2 : 3;
        
        // Check if any number has reached the winning threshold
        let winnerNumber: number | null = null;
        for (const [num, count] of Object.entries(counts)) {
          if (count >= winningThreshold) {
            winnerNumber = parseInt(num);
            break;
          }
        }
        
        if (winnerNumber !== null) {
          // We have a winner!
          setWinner(winnerNumber.toString());
          
          // Announce the winner
          setTimeout(() => {
            const winnerText = getNumberInLanguage(winnerNumber!, selectedLanguage);
            const winnerMessage = `${winnerText} ${t.winsTheBattle}`;
            speak(winnerMessage);
          }, 300);
        } else {
          // Still rolling - just speak the number
          setTimeout(() => {
            const numberText = getNumberInLanguage(newValue, selectedLanguage);
            speak(numberText);
          }, 300);
        }
      } else if (gameMode === 'odd-even' && oddEvenChoice) {
        // Check for winner in odd/even mode
        const isOdd = newValue % 2 === 1;
        const winnerText = isOdd ? t.odd : t.even;
        setWinner(winnerText);
        
        // Always announce the winner
        setTimeout(() => {
          const winnerMessage = `${winnerText} ${t.isTheWinner}`;
          speak(winnerMessage);
        }, 300);
      } else {
        // Normal mode - just speak the number
        setTimeout(() => {
          const numberText = getNumberInLanguage(newValue, selectedLanguage);
          speak(numberText);
        }, 300);
      }
    }, 1000);
  };

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    setOddEvenChoice(null);
    setBattleMode(null);
    setBattleRolls([]);
    setSelectedNumbers([]);
    setDiceValue(null);
    setWinner(null);
  };

  const toggleNumberSelection = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const resetBattle = () => {
    setBattleRolls([]);
    setDiceValue(null);
    setWinner(null);
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </header>

        <div className="ui-language-selector">
          <label htmlFor="ui-language-select">
            <span className="ui-label-text">Idioma / Language:</span>
            <select
              id="ui-language-select"
              value={uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value as UILanguage)}
              className="ui-language-select"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <div className="game-mode-selector">
          <button
            className={`mode-button ${gameMode === 'normal' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('normal')}
          >
            {t.normal}
          </button>
          <button
            className={`mode-button ${gameMode === 'odd-even' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('odd-even')}
          >
            {t.oddOrEven}
          </button>
          <button
            className={`mode-button ${gameMode === 'battle' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('battle')}
          >
            {t.battle}
          </button>
          <button
            className={`mode-button ${gameMode === 'select-numbers' ? 'active' : ''}`}
            onClick={() => handleGameModeChange('select-numbers')}
          >
            {t.selectNumbers}
          </button>
        </div>

        {gameMode === 'odd-even' && (
          <div className="odd-even-selector">
            <p className="choice-label">{t.chooseYourBet}</p>
            <div className="choice-buttons">
              <button
                className={`choice-button ${oddEvenChoice === 'odd' ? 'selected' : ''}`}
                onClick={() => setOddEvenChoice('odd')}
                disabled={isRolling}
              >
                {t.odd}
              </button>
              <button
                className={`choice-button ${oddEvenChoice === 'even' ? 'selected' : ''}`}
                onClick={() => setOddEvenChoice('even')}
                disabled={isRolling}
              >
                {t.even}
              </button>
            </div>
          </div>
        )}

        {gameMode === 'select-numbers' && (
          <div className="select-numbers-selector">
            <p className="choice-label">{t.chooseNumbers}</p>
            <div className="number-selection-grid">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  className={`number-selection-button ${selectedNumbers.includes(num) ? 'selected' : ''}`}
                  onClick={() => toggleNumberSelection(num)}
                  disabled={isRolling}
                >
                  {num}
                </button>
              ))}
            </div>
            {selectedNumbers.length < 2 && (
              <p className="selection-hint">{t.selectAtLeastTwo}</p>
            )}
          </div>
        )}

        {gameMode === 'battle' && (
          <div className="battle-selector">
            <p className="choice-label">{t.chooseBattleMode}</p>
            <div className="choice-buttons">
              <button
                className={`choice-button ${battleMode === 'best-of-3' ? 'selected' : ''}`}
                onClick={() => {
                  setBattleMode('best-of-3');
                  resetBattle();
                }}
                disabled={isRolling || battleRolls.length > 0}
              >
                {t.bestOf3}
              </button>
              <button
                className={`choice-button ${battleMode === 'best-of-5' ? 'selected' : ''}`}
                onClick={() => {
                  setBattleMode('best-of-5');
                  resetBattle();
                }}
                disabled={isRolling || battleRolls.length > 0}
              >
                {t.bestOf5}
              </button>
            </div>
            {battleMode && battleRolls.length > 0 && (
              <div className="battle-progress">
                <p className="progress-text">
                  {t.roll} {battleRolls.length} - {battleMode === 'best-of-3' ? t.bestOf3 : t.bestOf5}
                </p>
                <div className="battle-rolls">
                  {battleRolls.map((roll, index) => (
                    <span key={index} className="battle-roll-number">
                      {roll}
                    </span>
                  ))}
                </div>
                <div className="battle-stats">
                  <p className="stats-label">{t.count}</p>
                  <div className="number-stats">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const count = battleRolls.filter(roll => roll === num).length;
                      const winningThreshold = battleMode === 'best-of-3' ? 2 : 3;
                      const isWinner = count >= winningThreshold;
                      const isLeader = count > 0 && !isWinner && count === Math.max(...[1, 2, 3, 4, 5, 6].map(n => 
                        battleRolls.filter(roll => roll === n).length
                      ));
                      
                      return (
                        <div 
                          key={num} 
                          className={`number-stat ${isWinner ? 'winner' : isLeader ? 'leader' : ''} ${count === 0 ? 'zero' : ''}`}
                        >
                          <span className="number-label">{num}:</span>
                          <span className="number-count">{count}/{winningThreshold}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="game-area">
          <Dice value={diceValue} isRolling={isRolling} />
          
          {diceValue && !isRolling && (
            <div className="result">
              <span className="result-number">{diceValue}</span>
              {gameMode === 'odd-even' && winner && (
                <div className="winner-message">
                  <span className="winner-text">{winner} {t.isTheWinner}</span>
                </div>
              )}
              {gameMode === 'battle' && winner && (
                <div className="winner-message">
                  <span className="winner-text">{winner} {t.winsTheBattle}</span>
                </div>
              )}
            </div>
          )}

          {!(gameMode === 'battle' && winner) && (
            <button 
              className="roll-button" 
              onClick={rollDice}
              disabled={
                isRolling || 
                (gameMode === 'odd-even' && !oddEvenChoice) ||
                (gameMode === 'battle' && !battleMode) ||
                (gameMode === 'select-numbers' && selectedNumbers.length < 2)
              }
            >
              {isRolling 
                ? t.rolling 
                : gameMode === 'battle' && battleRolls.length > 0 && !winner
                ? t.rollAgain
                : t.rollDice}
            </button>
          )}

          {gameMode === 'battle' && winner && (
            <button 
              className="roll-button reset-button" 
              onClick={resetBattle}
            >
              {t.rollDice} {t.of} {battleMode === 'best-of-3' ? t.bestOf3 : t.bestOf5}
            </button>
          )}
        </div>

        <div className="language-selector">
          <label htmlFor="language-select">
            <span className="label-text">{t.textToSpeechLanguage}</span>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
            >
              {languages.map((lang: Language) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;


