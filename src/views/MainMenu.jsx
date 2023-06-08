/* eslint-disable react/prop-types */
import './MainMenu.css'

export default function MainMenu({startGame, viewStats}) {
  return (
    <>
      <div className='logo'>
        <div className='token'></div>
        <div className='token'></div>
        <div className='token'></div>
        <div className='token'></div>
      </div>
      <h1>CONNECT 4</h1>
      <div className='menu-btns'>
        <button className='play' onClick={() => startGame()}>
          <i className='fa fa-play'></i>
          Play
        </button>
        <button className='stats' onClick={() => viewStats()}>
          <i className='fa fa-bar-chart'></i>
          Stats
        </button>
        <button className='options'>
          <i className='fa fa-cog'></i>
          Options
        </button>
      </div>
    </>
  )
}

