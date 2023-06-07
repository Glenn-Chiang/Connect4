/* eslint-disable react/prop-types */
import './MainMenu.css'

export default function MainMenu({startGame}) {
  return (
    <>
      <h1>CONNECT 4</h1>
      <div className='menu-btns'>
        <button className='play' onClick={() => startGame()}>
          <i className='fa fa-play'></i>
          Play
        </button>
        <button className='stats'>
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

