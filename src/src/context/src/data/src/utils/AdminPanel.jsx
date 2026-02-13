import React, { useState } from 'react';
import { books } from '../data/books';
import { addAdminQuestion } from '../data/manualQuestions';
import './AdminPanel.css';

export default function AdminPanel() {
  const [form, setForm] = useState({
    book: books[0].portuguese,
    chapter: 1,
    verse: 1,
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: ''
  });
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação simples
    if (!form.question || form.options.some(opt => !opt.trim()) || !form.explanation) {
      alert('Preencha todos os campos.');
      return;
    }
    addAdminQuestion(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    // Limpa formulário
    setForm({
      book: books[0].portuguese,
      chapter: 1,
      verse: 1,
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: ''
    });
  };

  return (
    <div className="admin-panel">
      <h2>Painel Administrativo</h2>
      <p>Cadastre novas perguntas manualmente. Elas serão adicionadas ao banco de perguntas.</p>
      {success && <div className="success-message">✅ Pergunta cadastrada com sucesso!</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Livro:</label>
          <select value={form.book} onChange={e => setForm({...form, book: e.target.value})}>
            {books.map(b => <option key={b.english}>{b.portuguese}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Capítulo:</label>
          <input type="number" min="1" value={form.chapter} onChange={e => setForm({...form, chapter: parseInt(e.target.value)})} />
        </div>
        <div className="form-group">
          <label>Versículo:</label>
          <input type="number" min="1" value={form.verse} onChange={e => setForm({...form, verse: parseInt(e.target.value)})} />
        </div>
        <div className="form-group">
          <label>Pergunta:</label>
          <textarea value={form.question} onChange={e => setForm({...form, question: e.target.value})} rows="2" />
        </div>
        <div className="form-group">
          <label>Opções (4 alternativas):</label>
          {form.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Opção ${idx + 1}`}
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
            />
          ))}
        </div>
        <div className="form-group">
          <label>Resposta correta (índice 0-3):</label>
          <input type="number" min="0" max="3" value={form.correct} onChange={e => setForm({...form, correct: parseInt(e.target.value)})} />
        </div>
        <div className="form-group">
          <label>Explicação:</label>
          <textarea value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} rows="3" />
        </div>
        <button type="submit">Salvar Pergunta</button>
      </form>
    </div>
  );
}