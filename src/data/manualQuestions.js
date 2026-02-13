// Banco inicial de perguntas manuais (exemplos fornecidos + extras)
export const manualQuestions = [
  {
    id: 1,
    book: "Mateus",
    chapter: 4,
    verse: 18,
    question: "Qual era a profissão de Pedro antes de seguir Jesus?",
    options: ["Pescador", "Carpinteiro", "Publicano", "Médico"],
    correct: 0,
    explanation: "Mateus 4:18 – 'E Jesus, andando junto ao mar da Galiléia, viu dois irmãos, Simão, chamado Pedro, e André, seu irmão, que lançavam as redes ao mar, porque eram pescadores.'"
  },
  {
    id: 2,
    book: "Gênesis",
    chapter: 6,
    verse: 14,
    question: "Que material Deus mandou Noé usar na construção da arca?",
    options: ["Madeira de gofer", "Cedro", "Acácia", "Oliveira"],
    correct: 0,
    explanation: "Gênesis 6:14 – 'Faze para ti uma arca da madeira de gofer; farás compartimentos na arca e a betumarás por dentro e por fora com betume.'"
  },
  {
    id: 3,
    book: "Êxodo",
    chapter: 3,
    verse: 2,
    question: "O que Moisés viu no monte Horebe?",
    options: ["Uma sarça ardente", "Uma nuvem de fogo", "Uma coluna de fumaça", "Um anjo com espada"],
    correct: 0,
    explanation: "Êxodo 3:2 – 'E apareceu-lhe o anjo do Senhor em uma chama de fogo do meio duma sarça; e olhou, e eis que a sarça ardia no fogo, e a sarça não se consumia.'"
  },
  {
    id: 4,
    book: "1 Samuel",
    chapter: 17,
    verse: 4,
    question: "De onde era o gigante Golias?",
    options: ["Gate", "Asdode", "Ecrom", "Gaza"],
    correct: 0,
    explanation: "1 Samuel 17:4 – 'Então saiu do arraial dos filisteus um campeão, cujo nome era Golias, de Gate, que tinha de altura seis côvados e um palmo.'"
  },
  {
    id: 5,
    book: "Mateus",
    chapter: 14,
    verse: 25,
    question: "Em que momento da noite Jesus foi até os discípulos andando sobre o mar?",
    options: ["Quarta vigília da noite", "Madrugada", "Entardecer", "Meia-noite"],
    correct: 0,
    explanation: "Mateus 14:25 – 'Mas, à quarta vigília da noite, dirigiu-se Jesus para eles, andando sobre o mar.'"
  },
  {
    id: 6,
    book: "João",
    chapter: 11,
    verse: 43,
    question: "Que ordem Jesus deu em voz alta diante do túmulo de Lázaro?",
    options: ["Lázaro, vem para fora!", "Levanta-te e anda!", "Desatai-o e deixai-o ir!", "Eu sou a ressurreição e a vida"],
    correct: 0,
    explanation: "João 11:43 – 'E, tendo dito isto, clamou com grande voz: Lázaro, vem para fora.'"
  }
];

// Funções para gerenciar perguntas adicionadas via Admin (localStorage)
const STORAGE_KEY = 'gincana_admin_questions';

export const getAdminQuestions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addAdminQuestion = (question) => {
  const admin = getAdminQuestions();
  const newId = admin.length > 0 ? Math.max(...admin.map(q => q.id)) + 1 : 1000;
  const newQuestion = { id: newId, ...question };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...admin, newQuestion]));
  return newQuestion;
};

// Retorna todas as perguntas (manuais + admin)
export const getAllQuestions = () => {
  return [...manualQuestions, ...getAdminQuestions()];
};