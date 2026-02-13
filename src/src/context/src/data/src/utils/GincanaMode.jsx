import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { fetchVerse, getBookEnglish } from '../utils/bibleApi';
import { generateQuestion } from '../utils/questionGenerator';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import Scoreboard from './Scoreboard';

// Lista de referências pré-definidas para a gincana (pode ser expandida)
const GINCANA_REFERENCES = [
  { book: "Mateus", chapter: 4, verse: 18 },
  { book: "Gênesis", chapter: 1, verse: 1 },
  { book: "João", chapter: 3, verse: 16 },
  { book: "Salmos", chapter: 23, verse: 1 },
  { book: "Romanos", chapter: 8, verse: 28 },
  // ... mais referências
];

export default function GincanaMode() {
  const { score, addPoints, round, nextRound, resetGame } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameFinished, setGameFinished] = useState(false);
  const [error, setError] = useState('');

  // Inicia a primeira pergunta
  useEffect(() => {
    resetGame();
    loadQuestion(1);
    // eslint-disable-next-line
  }, []);

  const loadQuestion = async (roundNumber) => {
    setLoading(true);
    setError('');
    // Seleciona uma referência (pode ser aleatória)
    const ref = GINCANA_REFERENCES[(roundNumber - 1) % GINCANA_REFERENCES.length];
    const bookEng = getBookEnglish(ref.book);
    if (!bookEng) {
      setError('Livro não encontrado.');
      setLoading(false);
      return;
    }
    const data = await fetchVerse(bookEng, ref.chapter, ref.verse);
    if (!data) {
      setError('Erro ao carregar passagem.');
      setLoading(false);
      return;
    }
    const question = await generateQuestion(ref.book, ref.chapter, ref.verse, data.text);
    setCurrentQuestion(question);
    setTimeLeft(30);
    setLoading(false);
  };

  const handleAnswer = (isCorrect, explanation) => {
    if (isCorrect) {
      addPoints(10);
    }
    // Aguarda 2 segundos e carrega próxima pergunta
    setTimeout(() => {
      if (round < 5) {
        nextRound();
        loadQuestion(round + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    // Tempo esgotado: erro automático
    if (currentQuestion) {
      handleAnswer(false, 'Tempo esgotado!');
    }
  };

  if (gameFinished) {
    return (
      <div className="gincana-finished">
        <h2>🎉 Gincana Concluída!</h2>
        <p>Sua pontuação final: <strong>{score}</strong></p>
        <Scoreboard />
        <button onClick={() => window.location.reload()}>Nova Gincana</button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Carregando pergunta...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gincana-mode">
      <div className="gincana-header">
        <h2>Modo Gincana - Rodada {round}/5</h2>
        <div className="score-display">Pontos: {score}</div>
      </div>
      {currentQuestion && (
        <>
          <div className="timer-container">
            Tempo restante: <Timer initialSeconds={30} onTimeUp={handleTimeUp} isActive={!gameFinished && !loading} />
          </div>
          <QuestionCard
            questionObj={currentQuestion}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
          />
        </>
      )}
    </div>
  );
}