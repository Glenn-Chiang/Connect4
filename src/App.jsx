import Game from './views/Game.jsx'
import MainMenu from './views/MainMenu.jsx'
import Stats from './views/Stats.jsx';
import { useState } from 'react'


export default function App() {
  const [appState, setAppState] = useState('main-menu');

  // View navigation
  function startGame() {
    setAppState('game');
  }

  function returnToMenu() {
    setAppState('main-menu');
  }

  function viewStats() {
    setAppState('stats');
  }

  // Scores
  const [scores, setScores] = useState({yellow: 0, red: 0, tie: 0});

  function updateScores(winner) {
    const newScores = {...scores};
    newScores[winner] += 1;
    setScores(newScores);
  }

  function clearScores() {
    setScores({yellow: 0, red: 0});
  }

  const view = appState === 'main-menu' 
                ? <MainMenu startGame={startGame} viewStats={viewStats}/>
                : appState === 'game'
                  ? <Game updateScores={updateScores} returnToMenu={returnToMenu} />
                  : appState === 'stats'
                    ? <Stats scores={scores} clearScores={clearScores} returnToMenu={returnToMenu} />
                    : <></>

  return (
    <>
      {view}
    </>
  )
}

