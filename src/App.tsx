import { useState, useEffect } from "react";
import Dice from "./components/Dice";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import {
  languages,
  getNumberInLanguage,
  type Language,
} from "./utils/languages";
import { getTranslation, type UILanguage } from "./utils/translations";
import { saveRoll, getRolls, type RollEntry } from "./utils/rollHistory";
import "./App.css";

type GameMode = "normal" | "odd-even" | "battle" | "select-numbers";
type OddEvenChoice = "odd" | "even" | null;
type BattleMode = "best-of-3" | "best-of-5" | null;

function App() {
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-US");
  const [uiLanguage, setUiLanguage] = useState<UILanguage>("es");
  const [gameMode, setGameMode] = useState<GameMode>("normal");
  const [oddEvenChoice, setOddEvenChoice] = useState<OddEvenChoice>(null);
  const [battleMode, setBattleMode] = useState<BattleMode>(null);
  const [battleRolls, setBattleRolls] = useState<number[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<
    Array<{ name: string; bet: number | null }>
  >([{ name: "", bet: null }]);
  const [rollHistory, setRollHistory] = useState<RollEntry[]>([]);
  const { speak } = useTextToSpeech({ language: selectedLanguage });
  const t = getTranslation(uiLanguage);

  // Load roll history from localStorage on mount
  useEffect(() => {
    setRollHistory(getRolls());
  }, []);

  const rollDice = () => {
    if (isRolling) return;
    if (gameMode === "odd-even" && !oddEvenChoice) return;
    if (gameMode === "battle" && !battleMode) return;
    if (gameMode === "select-numbers" && selectedNumbers.length < 2) return;

    // Check if battle already has a winner
    if (gameMode === "battle" && battleMode && winner) return;

    setIsRolling(true);
    setDiceValue(null);
    if (gameMode !== "battle") {
      setWinner(null);
    }

    // Simulate rolling animation
    setTimeout(() => {
      let newValue: number;

      // For select-numbers mode, only roll from selected numbers
      if (gameMode === "select-numbers" && selectedNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * selectedNumbers.length);
        newValue = selectedNumbers[randomIndex];
      } else {
        // Normal roll (1-6)
        newValue = Math.floor(Math.random() * 6) + 1;
      }

      setDiceValue(newValue);
      setIsRolling(false);

      // Save roll to history (save every roll)
      const rollEntry: RollEntry = {
        value: newValue,
        playerName:
          players.length > 0 && players[0].name.trim()
            ? players[0].name.trim()
            : null,
        timestamp: Date.now(),
        gameMode:
          gameMode === "battle" && battleMode
            ? `battle-${battleMode}`
            : gameMode,
      };
      saveRoll(rollEntry);
      setRollHistory(getRolls());

      // Handle battle mode
      if (gameMode === "battle" && battleMode) {
        const newRolls = [...battleRolls, newValue];
        setBattleRolls(newRolls);

        // Announce the current roll
        setTimeout(() => {
          const numberText = getNumberInLanguage(newValue, selectedLanguage);
          speak(numberText);
        }, 300);

        // Calculate counts for each number
        const counts: { [key: number]: number } = {};
        newRolls.forEach((roll) => {
          counts[roll] = (counts[roll] || 0) + 1;
        });

        // Determine winning threshold: best-of-3 needs 2, best-of-5 needs 3
        const winningThreshold = battleMode === "best-of-3" ? 2 : 3;

        // Get all numbers that players bet on
        const playerBetNumbers = players
          .map((p) => p.bet)
          .filter((bet): bet is number => bet !== null);
        const hasPlayerBets = playerBetNumbers.length > 0;

        // Check if any number has reached the winning threshold
        // If players have bets, only numbers they bet on can win
        let winnerNumber: number | null = null;
        for (const [num, count] of Object.entries(counts)) {
          const numValue = parseInt(num);
          if (count >= winningThreshold) {
            // If players have bets, only allow numbers they bet on to win
            if (hasPlayerBets && !playerBetNumbers.includes(numValue)) {
              continue; // Skip this number, it can't win
            }
            winnerNumber = numValue;
            break;
          }
        }

        if (winnerNumber !== null) {
          // We have a winner!
          setWinner(winnerNumber.toString());

          // Announce the winner after a short delay to allow the roll announcement to finish
          setTimeout(() => {
            const winnerText = getNumberInLanguage(
              winnerNumber!,
              selectedLanguage
            );
            const winningPlayers = players.filter(
              (p) => p.bet === winnerNumber && p.name.trim()
            );
            let winnerMessage: string;
            if (winningPlayers.length > 0) {
              const playerNames = winningPlayers
                .map((p) => p.name.trim())
                .join(", ");
              winnerMessage = `${playerNames} ${t.winsWith} ${winnerText}!`;
            } else {
              winnerMessage = `${winnerText} ${t.winsTheBattle}`;
            }
            speak(winnerMessage);
          }, 1500);
        }
      }

      // Handle odd/even mode
      if (gameMode === "odd-even" && oddEvenChoice) {
        // Check for winner in odd/even mode
        const isOdd = newValue % 2 === 1;
        const winnerText = isOdd ? t.odd : t.even;
        setWinner(winnerText);

        // Always announce the winner
        setTimeout(() => {
          const winnerMessage = `${winnerText} ${t.isTheWinner}`;
          speak(winnerMessage);
        }, 300);
      } else if (gameMode === "normal" || gameMode === "select-numbers") {
        // Normal/Select Numbers mode - just speak the number
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
    if (mode !== "battle") {
      setPlayers([{ name: "", bet: null }]);
    }
  };

  const toggleNumberSelection = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  const resetBattle = () => {
    setBattleRolls([]);
    setDiceValue(null);
    setWinner(null);
    setPlayers([{ name: "", bet: null }]);
  };

  const addPlayer = () => {
    setPlayers([...players, { name: "", bet: null }]);
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].name = name;
    setPlayers(updatedPlayers);
  };

  const updatePlayerBet = (index: number, bet: number | null) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].bet = bet;
    setPlayers(updatedPlayers);
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

        {gameMode === "battle" && (
          <div className="battle-player-setup">
            <h3 className="players-title">{t.players}</h3>
            {players.map((player, index) => (
              <div key={index} className="player-entry">
                <div className="player-name-selector">
                  <label htmlFor={`player-name-input-${index}`}>
                    <span className="player-name-label">
                      {t.playerName} {index + 1}:
                    </span>
                    <input
                      id={`player-name-input-${index}`}
                      type="text"
                      value={player.name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      placeholder={t.enterPlayerNameForBattle}
                      className="player-name-input"
                      maxLength={20}
                      disabled={isRolling || battleRolls.length > 0}
                    />
                  </label>
                </div>
                <div className="player-bet-selector">
                  <p className="bet-label">{t.selectYourBet}</p>
                  <div className="bet-numbers-grid">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      // Check if this number is already selected by another player
                      const isTakenByOtherPlayer = players.some(
                        (p, i) => i !== index && p.bet === num
                      );
                      const isDisabled =
                        isRolling ||
                        battleRolls.length > 0 ||
                        (isTakenByOtherPlayer && player.bet !== num);

                      return (
                        <button
                          key={num}
                          className={`bet-number-button ${
                            player.bet === num ? "selected" : ""
                          } ${isTakenByOtherPlayer ? "taken" : ""}`}
                          onClick={() =>
                            updatePlayerBet(
                              index,
                              player.bet === num ? null : num
                            )
                          }
                          disabled={isDisabled}
                          title={
                            isTakenByOtherPlayer && player.bet !== num
                              ? "This number is already selected by another player"
                              : undefined
                          }
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {players.length > 1 && (
                  <button
                    className="remove-player-button"
                    onClick={() => removePlayer(index)}
                    disabled={isRolling || battleRolls.length > 0}
                  >
                    {t.removePlayer}
                  </button>
                )}
              </div>
            ))}
            <button
              className="add-player-button"
              onClick={addPlayer}
              disabled={isRolling || battleRolls.length > 0}
            >
              {t.addPlayer}
            </button>
          </div>
        )}

        <div className="game-mode-selector">
          <button
            className={`mode-button ${gameMode === "normal" ? "active" : ""}`}
            onClick={() => handleGameModeChange("normal")}
          >
            {t.normal}
          </button>
          <button
            className={`mode-button ${gameMode === "odd-even" ? "active" : ""}`}
            onClick={() => handleGameModeChange("odd-even")}
          >
            {t.oddOrEven}
          </button>
          <button
            className={`mode-button ${gameMode === "battle" ? "active" : ""}`}
            onClick={() => handleGameModeChange("battle")}
          >
            {t.battle}
          </button>
          <button
            className={`mode-button ${
              gameMode === "select-numbers" ? "active" : ""
            }`}
            onClick={() => handleGameModeChange("select-numbers")}
          >
            {t.selectNumbers}
          </button>
        </div>

        {gameMode === "odd-even" && (
          <div className="odd-even-selector">
            <p className="choice-label">{t.chooseYourBet}</p>
            <div className="choice-buttons">
              <button
                className={`choice-button ${
                  oddEvenChoice === "odd" ? "selected" : ""
                }`}
                onClick={() => setOddEvenChoice("odd")}
                disabled={isRolling}
              >
                {t.odd}
              </button>
              <button
                className={`choice-button ${
                  oddEvenChoice === "even" ? "selected" : ""
                }`}
                onClick={() => setOddEvenChoice("even")}
                disabled={isRolling}
              >
                {t.even}
              </button>
            </div>
          </div>
        )}

        {gameMode === "select-numbers" && (
          <div className="select-numbers-selector">
            <p className="choice-label">{t.chooseNumbers}</p>
            <div className="number-selection-grid">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  className={`number-selection-button ${
                    selectedNumbers.includes(num) ? "selected" : ""
                  }`}
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

        {gameMode === "battle" && (
          <div className="battle-selector">
            <p className="choice-label">{t.chooseBattleMode}</p>
            <div className="choice-buttons">
              <button
                className={`choice-button ${
                  battleMode === "best-of-3" ? "selected" : ""
                }`}
                onClick={() => {
                  setBattleMode("best-of-3");
                  resetBattle();
                }}
                disabled={isRolling || battleRolls.length > 0}
              >
                {t.bestOf3}
              </button>
              <button
                className={`choice-button ${
                  battleMode === "best-of-5" ? "selected" : ""
                }`}
                onClick={() => {
                  setBattleMode("best-of-5");
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
                  {t.roll} {battleRolls.length} -{" "}
                  {battleMode === "best-of-3" ? t.bestOf3 : t.bestOf5}
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
                      const count = battleRolls.filter(
                        (roll) => roll === num
                      ).length;
                      const winningThreshold =
                        battleMode === "best-of-3" ? 2 : 3;
                      const isWinner = count >= winningThreshold;
                      const isLeader =
                        count > 0 &&
                        !isWinner &&
                        count ===
                          Math.max(
                            ...[1, 2, 3, 4, 5, 6].map(
                              (n) =>
                                battleRolls.filter((roll) => roll === n).length
                            )
                          );

                      return (
                        <div
                          key={num}
                          className={`number-stat ${
                            isWinner ? "winner" : isLeader ? "leader" : ""
                          } ${count === 0 ? "zero" : ""}`}
                        >
                          <span className="number-label">{num}:</span>
                          <span className="number-count">
                            {count}/{winningThreshold}
                          </span>
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
              {gameMode === "odd-even" && winner && (
                <div className="winner-message">
                  <span className="winner-text">
                    {winner} {t.isTheWinner}
                  </span>
                </div>
              )}
              {gameMode === "battle" && winner && (
                <div className="winner-message">
                  <span className="winner-text">
                    <span className="winner-number">{winner}</span>{" "}
                    {t.winsTheBattle}!
                  </span>
                  {players.some((p) => p.bet !== null) && (
                    <div className="players-bet-results">
                      {players.map((player, index) => {
                        if (player.bet === null) return null;
                        const isCorrect = player.bet === parseInt(winner);
                        return (
                          <div
                            key={index}
                            className={`player-bet-result ${
                              isCorrect ? "correct" : "incorrect"
                            }`}
                          >
                            {player.name.trim() || `Player ${index + 1}`}:{" "}
                            {isCorrect ? "✓" : "✗"} {t.betOn} {player.bet}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!(gameMode === "battle" && winner) && (
            <button
              className="roll-button"
              onClick={rollDice}
              disabled={
                isRolling ||
                (gameMode === "odd-even" && !oddEvenChoice) ||
                (gameMode === "battle" && !battleMode) ||
                (gameMode === "select-numbers" && selectedNumbers.length < 2)
              }
            >
              {isRolling
                ? t.rolling
                : gameMode === "battle" && battleRolls.length > 0 && !winner
                ? t.rollAgain
                : t.rollDice}
            </button>
          )}

          {gameMode === "battle" && winner && (
            <button className="roll-button reset-button" onClick={resetBattle}>
              {t.rollDice} {t.of}{" "}
              {battleMode === "best-of-3" ? t.bestOf3 : t.bestOf5}
            </button>
          )}

          <div className="roll-history">
            <p className="roll-history-title">{t.rollHistory}</p>
            {rollHistory.length === 0 ? (
              <p className="no-rolls-message">{t.noRollsYet}</p>
            ) : (
              <div className="roll-history-list">
                {rollHistory.map((roll, index) => {
                  const date = new Date(roll.timestamp);
                  const timeString = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <div key={index} className="roll-history-item">
                      <span className="roll-history-value">{roll.value}</span>
                      {roll.playerName && (
                        <span className="roll-history-player">
                          {roll.playerName}
                        </span>
                      )}
                      <span className="roll-history-time">{timeString}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
