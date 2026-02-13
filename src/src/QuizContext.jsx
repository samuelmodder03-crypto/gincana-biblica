import React, { createContext, useState, useContext } from 'react';

// Contexto global para gerenciar modo do jogo, pontuação e rodada
const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [mode, setMode] = useState('free');        // free, gincana, challenge, admin
  const [score, setScore] = useState(0);           // pontuação atual (modo gincana)
  const [round, setRound] = useState(1);           // rodada atual (1 a 5)
  const [ranking, setRanking] = useState([]);      // armazena pontuações anteriores

  const addPoints = (points) => setScore(prev => prev + points);
  const resetGame = () => {
    setScore(0);
    setRound(1);
  };
  const nextRound = () => setRound(prev => prev + 1);
  const saveRanking = (playerName, finalScore) => {
    const newEntry = { name: playerName || 'Anônimo', score: finalScore, date: new Date().toLocaleDateString('pt-BR') };
    setRanking(prev => [...prev, newEntry].sort((a,b) => b.score - a.score).slice(0, 10));
    // também salva no localStorage
    const stored = JSON.parse(localStorage.getItem('gincanaRanking') || '[]');
    const updated = [...stored, newEntry].sort((a,b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('gincanaRanking', JSON.stringify(updated));
  };

  return (
    <QuizContext.Provider value={{
      mode, setMode,
      score, setScore,
      round, setRound,
      ranking, setRanking,
      addPoints,
      resetGame,
      nextRound,
      saveRanking
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);