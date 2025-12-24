import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const WORDS = ['PLAYSTATION', 'AMOR', 'AYLA', 'THOMAZ', 'RAPUNZEL', 'CLARA'];
const GRID_SIZE = 12;

export const WordSearch: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{r: number, c: number}[]>([]);
  // New state to store permanently highlighted cells
  const [foundCells, setFoundCells] = useState<{r: number, c: number}[]>([]);
  
  const [isSelecting, setIsSelecting] = useState(false);

  // Initialize Grid
  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    // Empty grid
    let newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Place words
    WORDS.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = Math.random() > 0.5 ? 'H' : 'V';
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setFoundCells([]);
  };

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    if (dir === 'H') {
      if (col + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row + word.length > GRID_SIZE) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWord = (grid: string[][], word: string, row: number, col: number, dir: string) => {
    for (let i = 0; i < word.length; i++) {
      if (dir === 'H') grid[row][col + i] = word[i];
      else grid[row + i][col] = word[i];
    }
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    setSelectedCells([{ r, c }]);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isSelecting) return;
    const start = selectedCells[0];
    
    // Calculate line
    const cells = [];
    const diffR = r - start.r;
    const diffC = c - start.c;

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (diffR === 0 || diffC === 0 || Math.abs(diffR) === Math.abs(diffC)) {
        const steps = Math.max(Math.abs(diffR), Math.abs(diffC));
        const stepR = diffR === 0 ? 0 : diffR / steps;
        const stepC = diffC === 0 ? 0 : diffC / steps;

        for (let i = 0; i <= steps; i++) {
            cells.push({ r: start.r + i * stepR, c: start.c + i * stepC });
        }
        setSelectedCells(cells);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    // Check word
    const word = selectedCells.map(cell => grid[cell.r][cell.c]).join('');
    const reverseWord = word.split('').reverse().join('');
    
    let isValid = false;
    let foundWordText = '';

    if (WORDS.includes(word) && !foundWords.includes(word)) {
      isValid = true;
      foundWordText = word;
    } else if (WORDS.includes(reverseWord) && !foundWords.includes(reverseWord)) {
      isValid = true;
      foundWordText = reverseWord;
    }

    if (isValid) {
        setFoundWords([...foundWords, foundWordText]);
        setFoundCells([...foundCells, ...selectedCells]);
    }
    
    setSelectedCells([]);
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some(cell => cell.r === r && cell.c === c);
  };
  
  const isCellFound = (r: number, c: number) => {
    return foundCells.some(cell => cell.r === r && cell.c === c);
  }

  return (
    <div className="flex flex-col items-center w-full" onMouseUp={handleMouseUp}>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center max-w-lg">
        {WORDS.map(word => (
          <span 
            key={word} 
            className={`px-3 py-1 rounded-full text-sm font-bold ${foundWords.includes(word) ? 'bg-love-500 text-white line-through decoration-2' : 'bg-gray-200 text-gray-700'}`}
          >
            {word}
          </span>
        ))}
      </div>

      <div 
        className="bg-white p-4 rounded-lg shadow-inner border border-love-200 select-none touch-none"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gap: '2px' }}
      >
        {grid.map((row, r) => (
          row.map((letter, c) => (
            <div
              key={`${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              // Mobile Touch Events
              onTouchStart={(e) => { 
                  e.preventDefault(); // Stop scroll
                  handleMouseDown(r, c); 
              }}
              className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center font-mono font-bold cursor-pointer rounded-sm transition-colors
                ${isCellFound(r, c) ? 'bg-love-200 text-love-800' : isCellSelected(r, c) ? 'bg-love-500 text-white' : 'bg-gray-50 hover:bg-love-100'}
              `}
            >
              {letter}
            </div>
          ))
        ))}
      </div>

      {foundWords.length === WORDS.length && (
         <div className="mt-6 text-center animate-bounce">
            <p className="text-xl font-bold text-love-600">Parabéns meu amor! ❤️</p>
            <button onClick={generateGrid} className="mt-2 text-sm text-gray-500 flex items-center gap-1 mx-auto hover:text-love-500">
                <RotateCcw size={14} /> Reiniciar
            </button>
         </div>
      )}
    </div>
  );
};