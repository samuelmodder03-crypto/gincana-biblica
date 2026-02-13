import React, { useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import BibleSelector from './components/BibleSelector';
import GincanaMode from './components/GincanaMode';
import ChallengeMode from './components/ChallengeMode';
import AdminPanel from './components/AdminPanel';
import Scoreboard from './components/Scoreboard';
import './App.css';

function Main() {
  const { mode, setMode } = useQuiz();

  return (
    <div className="app">
      <header>
        <h1>📖 Gincana Bíblica</h1>
        <nav>
          <button 
            className={mode === 'free' ? 'active' : ''} 
            onClick={() => setMode('free')}
          >
            Modo Livre
          </button>
          <button 
            className={mode === 'gincana' ? 'active' : ''} 
            onClick={() => setMode('gincana')}
          >
            Modo Gincana
          </button>
          <button 
            className={mode === 'challenge' ? 'active' : ''} 
            onClick={() => setMode('challenge')}
          >
            Modo Desafio
          </button>
          <button 
            className={mode === 'admin' ? 'active' : ''} 
            onClick={() => setMode('admin')}
          >
            Admin
          </button>
        </nav>
      </header>
      <main className="container">
        {mode === 'free' && <BibleSelector />}
        {mode === 'gincana' && <GincanaMode />}
        {mode === 'challenge' && <ChallengeMode />}
        {mode === 'admin' && <AdminPanel />}
        {/* Scoreboard aparece apenas no modo gincana, mas podemos fixar ou exibir globalmente */}
        {mode === 'gincana' && <Scoreboard />}
      </main>
      <footer>
        <p>Igreja Nova Aliança — Perguntas e Respostas Bíblicas</p>
        <p>Dados bíblicos: <a href="https://bible-api.com" target="_blank" rel="noreferrer">bible-api.com</a> (tradução Almeida)</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QuizProvider>
      <Main />
    </QuizProvider>
  );
}