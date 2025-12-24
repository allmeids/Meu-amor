import React, { useState } from 'react';
import { IntroSection } from './components/IntroSection';
import { StorySection } from './components/StorySection';
import { GameHub } from './components/GameHub';
import { Heart } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen font-sans text-gray-800 relative selection:bg-love-200 selection:text-love-900">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-love-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <IntroSection />
        
        <div className="my-12 flex justify-center items-center">
           <Heart className="text-love-500 animate-pulse w-8 h-8" fill="currentColor" />
        </div>

        <StorySection />

        <div className="my-24 border-t-2 border-love-100 w-2/3 mx-auto"></div>

        <GameHub />

        <footer className="py-12 text-center text-love-800 bg-love-50 mt-20">
          <p className="font-script text-2xl">Feito com todo amor do mundo.</p>
          <p className="text-sm mt-2 opacity-70">Para nós. ❤️</p>
        </footer>
      </div>
    </div>
  );
}