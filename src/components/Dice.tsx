import { useEffect, useState } from 'react';
import './Dice.css';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
}

const Dice = ({ value, isRolling }: DiceProps) => {
  const [displayValue, setDisplayValue] = useState<number | null>(value);

  useEffect(() => {
    if (isRolling) {
      // Show random values while rolling
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, isRolling]);

  const renderDots = (num: number) => {
    const dots = [];
    // Grid positions: 0 1 2
    //                 3 4 5
    //                 6 7 8
    const positions: { [key: number]: number[] } = {
      1: [4], // Center
      2: [0, 8], // Diagonal: top-left, bottom-right
      3: [0, 4, 8], // Diagonal: top-left, center, bottom-right
      4: [0, 2, 6, 8], // Four corners
      5: [0, 2, 4, 6, 8], // Four corners + center
      6: [0, 3, 6, 2, 5, 8], // Two columns: left (0,3,6) and right (2,5,8)
    };

    const dotPositions = positions[num] || [];
    
    for (let i = 0; i < 9; i++) {
      dots.push(
        <div
          key={i}
          className={`dot ${dotPositions.includes(i) ? 'visible' : ''}`}
        />
      );
    }

    return dots;
  };

  return (
    <div className={`dice ${isRolling ? 'rolling' : ''}`}>
      {displayValue ? (
        <div className="dice-face">{renderDots(displayValue)}</div>
      ) : (
        <div className="dice-face empty">
          <span>?</span>
        </div>
      )}
    </div>
  );
};

export default Dice;

