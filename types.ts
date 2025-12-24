export interface Story {
  id: number;
  image: string;
  text: string;
}

export enum GameType {
  FLAPPY = 'FLAPPY',
  DINO = 'DINO',
  SNAKE = 'SNAKE',
  WORDSEARCH = 'WORDSEARCH'
}