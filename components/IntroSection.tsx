import React from 'react';
import { motion } from 'framer-motion';

export const IntroSection: React.FC = () => {
  return (
    <section className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-script text-6xl md:text-7xl text-love-600 mb-8">Meu Amor,</h1>
        
        <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-700 bg-white/60 p-8 rounded-2xl shadow-sm border border-love-100">
          <p>
            Quero te desejar um <strong className="text-love-600">Natal maravilhoso</strong>. ❤️
          </p>
          <p>
            O maior presente que eu poderia ter recebido foi tudo o que vivemos juntos. 
            Ter você todos os dias da minha vida é o melhor presente que Deus poderia me dar.
          </p>
          <p>
            Você é especial em cada detalhe: desde o seu jeito simples de ser até cada fio do seu cabelo. 
            Eu te amo demais, de um jeito que não cabe em palavras. 
            Jamais trocaria você por nada neste mundo — por nada, nada, nada.
          </p>
          <p className="font-bold text-love-700">
            Eu te amo muito e espero passar este e todos os outros Natais com você ao meu lado. 🎄✨
          </p>
        </div>
      </motion.div>
    </section>
  );
};