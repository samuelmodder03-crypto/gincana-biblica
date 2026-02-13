import { books } from '../data/books';

/**
 * Busca um versículo ou intervalo na API bible-api.com (tradução Almeida)
 * @param {string} bookEnglish - nome do livro em inglês (ex: "matthew")
 * @param {number} chapter - capítulo
 * @param {number|string} verse - versículo (ex: "18" ou "18-20")
 * @returns {Promise<Object>} dados da API
 */
export async function fetchVerse(bookEnglish, chapter, verse) {
  const ref = `${bookEnglish}%20${chapter}:${verse}`;
  const url = `https://bible-api.com/${ref}?translation=almeida`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar versículo:', error);
    return null;
  }
}

/**
 * Busca todos os versículos de um capítulo (útil para contar versículos)
 */
export async function fetchChapter(bookEnglish, chapter) {
  const ref = `${bookEnglish}%20${chapter}`;
  const url = `https://bible-api.com/${ref}?translation=almeida`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
    const data = await res.json();
    return data.verses || [];
  } catch (error) {
    console.error('Falha ao buscar capítulo:', error);
    return [];
  }
}

/**
 * Mapeia nome do livro em português para inglês
 */
export function getBookEnglish(bookPortuguese) {
  const book = books.find(b => b.portuguese === bookPortuguese);
  return book ? book.english : null;
}