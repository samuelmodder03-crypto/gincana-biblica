import React, { useState } from 'react';
import { books } from '../data/books';
import { fetchVerse, getBookEnglish } from '../utils/bibleApi';
import { generateQuestion } from '../utils/questionGenerator';
import QuestionCard from './QuestionCard';
import './BibleSelector.css';

export default function BibleSelector({ onQuestionGenerated }) {
  const [selectedBook, setSelectedBook] = useState(books[0].portuguese);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState('');
  const [verseRangeEnd, setVerseRangeEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [passageText, setPassageText] = useState('');

  // Atualiza número máximo de capítulos quando o livro muda
  const maxChapters = books.find(b => b.portuguese === selectedBook)?.chapters || 1;

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setCurrentQuestion(null);

    const bookEng = getBookEnglish(selectedBook);
    if (!bookEng) {
      setError('Livro não encontrado.');
      setLoading(false);
      return;
    }

    // Define a referência: versículo único ou intervalo
    let verseRef = selectedVerse;
    if (verseRangeEnd && parseInt(verseRangeEnd) > parseInt(selectedVerse)) {
      verseRef = `${selectedVerse}-${verseRangeEnd}`;
    }

    if (!verseRef) {
      setError('Informe o versículo.');
      setLoading(false);
      return;
    }

    const data = await fetchVerse(bookEng, selectedChapter, verseRef);
    if (!data || !data.text) {
      setError('Não foi possível encontrar esta passagem. Verifique a referência.');
      setLoading(false);
      return;
    }

    setPassageText(data.text);
    // Gera pergunta
    const question = await generateQuestion(selectedBook, selectedChapter, parseInt(selectedVerse), data.text);
    setCurrentQuestion(question);
    if (onQuestionGenerated) onQuestionGenerated(question);
    setLoading(false);
  };

  return (
    <div className="bible-selector">
      <h2>Modo Livre</h2>
      <p>Escolha o livro, capítulo e versículo para gerar uma pergunta.</p>
      <div className="selector-form">
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)}>
          {books.map(book => (
            <option key={book.english} value={book.portuguese}>{book.portuguese}</option>
          ))}
        </select>
        <select value={selectedChapter} onChange={(e) => setSelectedChapter(parseInt(e.target.value))}>
          {[...Array(maxChapters).keys()].map(i => i + 1).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Versículo"
          value={selectedVerse}
          onChange={(e) => setSelectedVerse(e.target.value)}
          min="1"
        />
        <span>até</span>
        <input
          type="number"
          placeholder="Fim (opcional)"
          value={verseRangeEnd}
          onChange={(e) => setVerseRangeEnd(e.target.value)}
          min={selectedVerse || 1}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Gerar Pergunta'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {currentQuestion && (
        <div className="generated-question">
          <h3>Pergunta gerada:</h3>
          <QuestionCard 
            questionObj={currentQuestion} 
            onAnswer={() => {}}  // modo livre: sem pontuação
          />
        </div>
      )}
    </div>
  );
}