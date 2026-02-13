import React from 'react';
import { useQuiz } from '../context/QuizContext';
import './Scoreboard.css';

export default function Scoreboard() {
  const { score, round, ranking, saveRanking } = useQuiz();
  const [playerName, setPlayerName] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);

  const handleSaveScore = () => {
    saveRanking(playerName, score);
    setShowForm(false);
    setPlayerName('');
  };

  // Carrega ranking do localStorage ao montar
  React.useEffect(() => {
    const stored = localStorage.getItem('gincanaRanking');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Atualiza o contexto (caso não esteja sincronizado)
      // Não fazemos setRanking diretamente, mas o contexto já carrega no save
    }
  }, []);

  return (
    <div className="scoreboard">
      <div className="current-score">
        <h3>Pontuação Atual</h3>
        <div className="score-value">{score}</div>
        <div className="round">Rodada: {round}/5</div>
        {score > 0 && !showForm && (
          <button onClick={() => setShowForm(true)}>Salvar pontuação</button>
        )}
        {showForm && (
          <div className="save-score">
            <input
              type="text"
              placeholder="Seu nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleSaveScore}>Salvar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        )}
      </div>
      <div className="ranking">
        <h3>Ranking (Top 10)</h3>
        <ol>
          {ranking.map((entry, idx) => (
            <li key={idx}>
              <span className="rank-name">{entry.name}</span>
              <span className="rank-score">{entry.score}</span>
              <span className="rank-date">{entry.date}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}