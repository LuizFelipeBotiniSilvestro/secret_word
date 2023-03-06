//React
import { useState, useRef } from "react";

// CSS
import './Game.css';

const Game = ({ 
                verifyLetter, 
                pickedWord,
                pickedCategory,
                letters,
                guessedLetters,
                wrongLetters,
                guesses,
                score,
              }) => {

  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);

  // Cria a função
  const handleSubmit = (e) => {
    e.preventDefault();

    // Chama a função passando a letra que foi alterada pelo state.
    verifyLetter(letter);

    // Deleta a letra depois de ter utilizado na função verifyLetter
    setLetter("");

    // Faz o focus sempre ficar no campo da letra
    // Para isso também foi passado no formuário a propriedad "Ref={letterInputRef}"
    letterInputRef.current.focus();
  }
  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra: </h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativas(s)</p>
      <div className="workContainer">
        {/* Vai mapear cada uma das letras, na letra e no seu indice (i), vai retornar um objeto */}
        {/* Se a letra ja estiver sido adivinhada, imprime ela, se não um blankSqauare */}
        {letters.map((letter, i) => 
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">{letter}</span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente advinhar uma letra da palavra: </p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="letter" 
            maxLength="1" 
            required 
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>
      <div className="wrongLettersContainer">

        <p>Letras já utilizadas: </p>
            {wrongLetters.map((letter, i) => (
              <span key={i}>{letter}, </span>
            ))}
      </div>
    </div>
  )
}

export default Game;