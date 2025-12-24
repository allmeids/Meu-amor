import React, { useState } from 'react';
import { GameType } from '../types';
import { FlappyDog } from '../games/FlappyDog';
import { ClaraSaltadora } from '../games/CatRun';
import { SnakeGame } from '../games/SnakeGame';
import { WordSearch } from '../games/WordSearch';
import { Gamepad2, X, Dog, Cat, AlignJustify } from 'lucide-react';

export const GameHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const games = [
    { type: GameType.FLAPPY, title: 'Flappy Dog', icon: <Dog />, color: 'bg-blue-100 text-blue-600' },
    { type: GameType.DINO, title: 'Clara Saltadora', icon: <Cat />, color: 'bg-yellow-100 text-yellow-600' },
    { type: GameType.SNAKE, title: 'Snake Amor', icon: <div className="font-bold text-lg">S</div>, color: 'bg-green-100 text-green-600' },
    { type: GameType.WORDSEARCH, title: 'Caça Palavras', icon: <AlignJustify />, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <section className="px-4 max-w-6xl mx-auto mb-24">
      <div className="text-center mb-12">
        <h2 className="font-script text-5xl text-love-600 mb-4">Nossos Jogos</h2>
        <p className="text-gray-600">Um pouquinho de diversão para a gente.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map(game => (
          <button
            key={game.type}
            onClick={() => setActiveGame(game.type)}
            className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl mx-auto ${game.color}`}>
              {game.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center">{game.title}</h3>
            <p className="text-sm text-gray-400 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Clique para jogar
            </p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            <div className="bg-love-50 p-4 flex justify-between items-center border-b border-love-100">
              <h3 className="font-bold text-xl text-love-800 flex items-center gap-2">
                <Gamepad2 size={20} />
                {games.find(g => g.type === activeGame)?.title}
              </h3>
              <button 
                onClick={() => setActiveGame(null)}
                className="p-2 hover:bg-love-200 rounded-full transition-colors text-love-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-gray-50 min-h-[400px] flex items-center justify-center">
              {activeGame === GameType.FLAPPY && <FlappyDog />}
              {activeGame === GameType.DINO && <ClaraSaltadora />}
              {activeGame === GameType.SNAKE && <SnakeGame />}
              {activeGame === GameType.WORDSEARCH && <WordSearch />}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};