import React, { useState } from 'react';
import { books } from '../data/books';
import { fetchVerse, getBookEnglish } from '../utils/bibleApi';
import { generateQuestion } from '../utils/questionGenerator';
import QuestionCard from './QuestionCard';

export default function ChallengeMode() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRandomQuestion = async () => {
    setLoading(true);
    setError('');
    // Seleciona livro, capítulo e versículo aleatórios
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const bookPt = randomBook.portuguese;
    const maxChapter = randomBook.chapters;
    const randomChapter = Math.floor(Math.random() * maxChapter) + 1;
    const randomVerse = Math.floor(Math.random() * 30) + 1; // versículo entre 1 e 30 (simplificado)

    const bookEng = getBookEnglish(bookPt);
    if (!bookEng) {
      setError('Erro ao selecionar livro.');
      setLoading(false);
      return;
    }

    const data = await fetchVerse(bookEng, randomChapter, randomVerse);
    if (!data) {
      // Se falhar, tenta novamente (recursão simples)
      loadRandomQuestion();
      return;
    }

    const question = await generateQuestion(bookPt, randomChapter, randomVerse, data.text);
    setCurrentQuestion(question);
    setLoading(false);
  };

  return (
    <div className="challenge-mode">
      <h2>Modo Desafio</h2>
      <p>Perguntas aleatórias de toda a Bíblia. Clique no botão para começar.</p>
      {!currentQuestion && !loading && (
        <button onClick={loadRandomQuestion} className="start-challenge">
          Iniciar Desafio
        </button>
      )}
      {loading && <div className="loading">Sorteando pergunta...</div>}
      {error && <div className="error">{error}</div>}
      {currentQuestion && (
        <>
          <QuestionCard questionObj={currentQuestion} onAnswer={() => {}} />
          <button onClick={loadRandomQuestion} className="next-question">
            Próxima Pergunta
          </button>
        </>
      )}
    </div>
  );
}