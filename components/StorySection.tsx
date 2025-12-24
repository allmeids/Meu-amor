import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Story } from '../types';

const stories: Story[] = [
  {
    id: 1,
    image: 'https://i.ibb.co/GqpjByj/1.jpg',
    text: "Dia dos namorados, um dia intenso e cheio de amor. Foi um imenso prazer passar ele ao seu lado no jantar que estávamos nervosos para ir kkkk, amo vc mais que tudo, obrigado por tudo!"
  },
  {
    id: 2,
    image: 'https://i.ibb.co/8Gc9QyX/2.jpg',
    text: "Aiai... lá em tocantinópolis, eu admirando a agua limpinha kkkk, foi legal passar esse dia com vc e aproveitar bem o dia. vamos fazer mais vezes!"
  },
  {
    id: 3,
    image: 'https://i.ibb.co/mVC80fmx/3.jpg',
    text: "Eita, dia do 3J onde me senti uma cirança brincando nas piscinas, nesse dia a gente se divertiu pra caramba, é incirvel coo vc torna meus dias melhores!"
  },
  {
    id: 4,
    image: 'https://i.ibb.co/x81BNqmx/4.jpg',
    text: "Obaaa, dia da praia, esses dias foram loucos, viagem maravilhosa que fizemos, cuidamos dos nossos \"filhos\" naquela terra sem lei, muito bom ter essa experiêwncia de praia com meu amor!"
  },
  {
    id: 5,
    image: 'https://i.ibb.co/ymQ447mH/5.jpg',
    text: "E aqui foi aonde nosso namoro começou oficialmente com uma aliança no dedo! Eu te amo mil milhões e a cada milissegundo que passa eu me apaixono 10 vezes mais por você e isso nunca vai mudar!"
  }
];

export const StorySection: React.FC = () => {
  return (
    <section className="px-4 max-w-6xl mx-auto space-y-24">
      {stories.map((story, index) => {
        return <StoryCard key={story.id} story={story} index={index} />;
      })}
    </section>
  );
};

const StoryCard: React.FC<{ story: Story; index: number }> = ({ story, index }) => {
  const isEven = index % 2 === 0;
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      {/* Image Frame */}
      <div className="w-full md:w-1/2 group">
        <div className={`relative p-3 bg-white shadow-xl transform transition-transform duration-500 hover:scale-[1.02] ${isEven ? '-rotate-2' : 'rotate-2'}`}>
          <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
            {!imgError ? (
              <img 
                src={story.image} 
                alt="Memória nossa" 
                className="w-full h-full object-cover relative z-10"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-love-50 text-love-400 p-4 text-center">
                 <p className="font-bold">Foto não carregou 😢</p>
                 <p className="text-sm mt-2">O link pode ter expirado.</p>
              </div>
            )}
          </div>
          {/* Tape effect */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-love-200/50 backdrop-blur-sm rotate-1 shadow-sm z-20"></div>
        </div>
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <div className="relative">
            <h2 className="font-script text-4xl text-love-500 mb-4 opacity-20 absolute -top-10 -left-4 select-none">
              #{index + 1}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 font-script leading-relaxed">
              {story.text}
            </p>
            <div className={`h-1 w-24 bg-love-300 mt-6 rounded-full ${isEven ? 'mx-auto md:mx-0' : 'mx-auto md:ml-auto'}`}></div>
        </div>
      </div>
    </motion.div>
  );
};