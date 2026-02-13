import { getAllQuestions } from '../data/manualQuestions';
import { books } from '../data/books';
import { fetchChapter, getBookEnglish } from './bibleApi';

// ----------------------------------------------------------------------
// 1. Busca perguntas manuais (incluindo as do admin)
// ----------------------------------------------------------------------
export async function findManualQuestion(bookPt, chapter, verse) {
  const all = getAllQuestions();
  return all.find(q => q.book === bookPt && q.chapter === chapter && q.verse === verse);
}

// ----------------------------------------------------------------------
// 2. Geradores de perguntas automáticas (fallback)
// ----------------------------------------------------------------------

/**
 * Pergunta sobre o nome do livro (múltipla escolha)
 */
function generateBookQuestion(bookPt) {
  const correctBook = bookPt;
  // Seleciona 3 outros livros aleatórios
  const otherBooks = books
    .filter(b => b.portuguese !== correctBook)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(b => b.portuguese);
  const options = [correctBook, ...otherBooks];
  // Embaralha
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    question: `De qual livro bíblico foi extraído este versículo?`,
    options,
    correct: options.indexOf(correctBook),
    explanation: `O versículo pertence ao livro de ${bookPt}.`
  };
}

/**
 * Pergunta sobre o capítulo (múltipla escolha)
 */
function generateChapterQuestion(chapter) {
  const correct = chapter.toString();
  // Gera 3 opções falsas próximas (evitando zero)
  const fake = [];
  while (fake.length < 3) {
    const rand = Math.floor(Math.random() * 30) + 1; // 1-30
    const str = rand.toString();
    if (str !== correct && !fake.includes(str)) fake.push(str);
  }
  const options = [correct, ...fake];
  // Embaralha
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    question: `Em que capítulo da Bíblia está este versículo?`,
    options,
    correct: options.indexOf(correct),
    explanation: `Este versículo está no capítulo ${chapter}.`
  };
}

/**
 * Pergunta sobre o total de versículos do capítulo (requer chamada à API)
 */
async function generateVerseCountQuestion(bookPt, chapter) {
  const bookEng = getBookEnglish(bookPt);
  if (!bookEng) return null;
  const verses = await fetchChapter(bookEng, chapter);
  const total = verses.length;
  if (total === 0) return null;
  const correct = total.toString();
  // Opções falsas: -1, +1, +2 (mas nunca menor que 1)
  const fake = [
    Math.max(1, total - 1).toString(),
    (total + 1).toString(),
    (total + 2).toString()
  ];
  // Remove duplicatas e garante 3 opções
  const uniqueFake = [...new Set(fake)].slice(0, 3);
  while (uniqueFake.length < 3) uniqueFake.push((total + uniqueFake.length + 1).toString());
  const options = [correct, ...uniqueFake];
  // Embaralha
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    question: `Quantos versículos tem o capítulo ${chapter} do livro de ${bookPt}?`,
    options,
    correct: options.indexOf(correct),
    explanation: `O capítulo ${chapter} de ${bookPt} possui ${total} versículos.`
  };
}

/**
 * Gera uma pergunta automática com base na passagem
 */
export async function generateAutoQuestion(bookPt, chapter, verse, passageText) {
  // Escolhe aleatoriamente entre os três tipos
  const rand = Math.random();
  if (rand < 0.4) {
    return generateBookQuestion(bookPt);
  } else if (rand < 0.7) {
    return generateChapterQuestion(chapter);
  } else {
    const q = await generateVerseCountQuestion(bookPt, chapter);
    return q || generateBookQuestion(bookPt); // fallback
  }
}

// ----------------------------------------------------------------------
// 3. Função principal: gera pergunta para a referência
// ----------------------------------------------------------------------
export async function generateQuestion(bookPt, chapter, verse, passageText) {
  // 1. Tenta encontrar pergunta manual
  const manual = await findManualQuestion(bookPt, chapter, verse);
  if (manual) return manual;

  // 2. Caso contrário, gera automática
  return await generateAutoQuestion(bookPt, chapter, verse, passageText);
}