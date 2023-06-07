import Game from './views/Game.jsx'
import MainMenu from './views/MainMenu.jsx'
import { useState } from 'react'


export default function App() {
  const [appState, setAppState] = useState('main-menu');

  function startGame() {
    setAppState('game');
  }

  function returnToMenu() {
    setAppState('main-menu');
  }

  const view = appState === 'main-menu' 
                  ? <MainMenu startGame={startGame} />
                  : appState === 'game'
                    ? <Game returnToMenu={returnToMenu} />
                    : <></>

  return (
    <>
      {view}
    </>
  )
}

