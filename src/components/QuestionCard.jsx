import React, { useState } from 'react';
import './QuestionCard.css';

export default function QuestionCard({ questionObj, onAnswer, timeLeft, showFeedback = true }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleOptionClick = (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === questionObj.correct;
    if (onAnswer) onAnswer(isCorrect, questionObj.explanation);
    if (isCorrect) {
      setFeedback('✅ Resposta correta!');
    } else {
      setFeedback(`❌ Resposta incorreta. A resposta correta é: ${questionObj.options[questionObj.correct]}`);
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <h3 className="question-text">{questionObj.question}</h3>
        {timeLeft !== undefined && (
          <div className={`timer ${timeLeft < 10 ? 'urgent' : ''}`}>
            ⏳ {timeLeft}s
          </div>
        )}
      </div>
      <div className="options">
        {questionObj.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${selected === idx ? (idx === questionObj.correct ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleOptionClick(idx)}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>
      {answered && showFeedback && (
        <div className="feedback">
          <p className="feedback-message">{feedback}</p>
          {questionObj.explanation && (
            <div className="explanation">
              <strong>Explicação:</strong> {questionObj.explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}