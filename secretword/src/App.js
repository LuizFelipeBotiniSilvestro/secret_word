// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from './data/word';

// Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;


function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState("");

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  // Cria a função
  const pickWordAndCategory = useCallback(() => {

    // categories recebe as categorias do objeto wordd.
    const categories = Object.keys(words);

    // Acessa o array de categorias, escolhe um indice aleatório * o nr de chaves que tem o objeto
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Escolhe uma palavra da categoria escolhida (category) de forma randômica.
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    // Retorna as palavras.
    return {word, category};
  }, [words]);


  // Cria a função que inicia o jogo
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates();

    // Recebe a palavra e a categoria
    const { word, category } = pickWordAndCategory();

    // Cria o array de letras (lista com todas as letras)
    let wordLetters = word.split("");
    // Deixa tudo em minúsculo
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Agora que tem a categoria e palavra, passe para o state.
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    // Chama para o state o modo de iniciar o jogo
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Função para processa a letra para o input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // Check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    };

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      // Altera as letras advinhas, pega o atual estado da letras, pegando todos os elementos do array e adicionando a nova letra.
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      // Diminui o número de tentativas
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect (() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

// Check win condition
// Checa as letras que o usuário utilizou com as que ele precisa advinhar
useEffect(() => {
  // Cria um array de letras  únicas
  const uniqueLetters = [...new Set(letters)];

  // Condição de vitória
  if (guessedLetters.length === uniqueLetters.length) {
    // Adiciona o score
    setScore((actualScore) => actualScore += 100);

    // Restart no jogo com nova palavra
    startGame();
  }

}, [guessedLetters, letters, startGame]);

  // Função para reiniciar o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">

    {/* Se estiver no modo "start", então mostra o componente StartScreen */}
    {gameStage === "start" && <StartScreen startGame={startGame}/>}
    
    {gameStage === "game" && <Game 
                              verifyLetter={verifyLetter} 
                              pickedWord={pickedWord}
                              pickedCategory={pickedCategory}
                              letters={letters}
                              guessedLetters={guessedLetters}
                              wrongLetters={wrongLetters}
                              guesses={guesses}
                              score={score}/>}

    {gameStage === "end" && <GameOver retry={retry} score={score}/>}

    </div>
  );
}

export default App;
