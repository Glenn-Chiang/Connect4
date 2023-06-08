/* eslint-disable react/prop-types */
import './Stats.css'

export default function Stats({scores, returnToMenu}) {
  return(
    <>
      <h1>Scores</h1>
      <div className="scores">
        <div className="yellow">
          <span className='player'>Yellow</span>
          <span className='score'>{scores.yellow}</span>
        </div>
        <div className="red">
          <span className='player'>Red</span>
          <span className='score'>{scores.red}</span>
        </div>
      </div>
      <div className='menu'>
        <button className='back-to-menu' onClick={() => returnToMenu()}>
          <i className='fa fa-home'></i>     
        </button>
      </div>
    </>
  )
}