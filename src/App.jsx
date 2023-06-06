/* eslint-disable react/prop-types */
import './App.css'
import { useState } from 'react';


function Board({boardMatrix, lastMovePosition, winningPositions}) {  

  function Row({ rowData, rowId }) {
    const row = rowData.map((val, colId) => {
      const classList = ['slot', (val === 1 ? 'yellow' : val === 2 ? 'red' : '')];

      // Highlight the most recently dropped token
      if (lastMovePosition !== null && rowId === lastMovePosition[0] && colId === lastMovePosition[1]) {
        classList.push('last-move');
      }
      
      // Highlight tokens if they are part of a winning line
      if (winningPositions !== null && winningPositions.some(position => position[0] === rowId && position[1] === colId)) {
        classList.push('win');
      }

      return <div className={classList.join(' ')} key={colId}></div>;
    });
    return (<div className='row'>{row}</div>); // Array of slots
  }

  function renderBoard(boardMatrix) {
    const boardRows = boardMatrix.map((rowData, rowId) => <Row rowData={rowData} rowId={rowId} key={rowId}/>);
    return (<div className='board'>{boardRows}</div>);
  }
  
  const boardDisplay = renderBoard(boardMatrix);
  
  return (
    <>
      {boardDisplay}
    </>
    );
}
  
  
function DropBtnBar({numBtns, handleMove}) { // Bar containing drop buttons  
  function DropBtn({onBtnClick}) { // Click button to drop token into column
    return (
      <button className='drop-btn' onClick={onBtnClick}>
        <i className='fa fa-arrow-down'></i>
      </button>
    )
  }

  let dropBtns = [];
  for (let i = 0; i < numBtns; i++) {
    dropBtns.push(<DropBtn key={i} onBtnClick={() => handleMove(i)}/>);
  }
  return (
    <div className='drop-bar'>{dropBtns}</div>
    )
}


function Game() {
  const numRows = 6;
  const numCols = 7;
  
  function createBoardMatrix(numRows, numCols) {
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
  }

  const [boardMatrix, setBoardMatrix] = useState(createBoardMatrix(numRows, numCols));
  // const [boardHistory, setBoardHistory] = useState([createBoardMatrix(numRows, numCols)]);

  const [moveNum, setMoveNum] = useState(0);
	const [gameActive, setGameActive] = useState(true);

  const [lastMovePosition, setLastMovePosition] = useState(null);
  const [winningPositions, setWinningPositions] = useState(null);

  function handleMove(colId) {
		if (!gameActive) {
			return;
		}

    const newMatrix = boardMatrix.slice();
    const moveValue = moveNum % 2 === 0 ? 1 : 2;

    function dropToken(colId) {
      // Find lowest empty slot in column
      for (let i = numRows - 1; i >= 0 ; i--) {
        if (!newMatrix[i][colId]) { // Empty slot
          newMatrix[i][colId] = moveValue;
          return i; // rowId of slot that token was dropped ikn 
        } 
      }
      // No empty slots in column -> invalid move
      return null;
    }

    function checkWin(rowId) {
      const winningNumber = 4;
      const winningLine = moveValue.toString().repeat(winningNumber);

      function checkRow(rowId) {
				const rowArray = newMatrix[rowId];
        const rowString = rowArray.join('');
        const winningPosition = rowString.indexOf(winningLine);
        if (winningPosition !== -1) {
          setWinningPositions(
            Array.from({length: winningNumber}, (val, i) => [rowId, winningPosition + i])
          );
        }
        return winningPosition !== -1;
      }

      function checkCol(colId) {
        const colArray = newMatrix.map((row, rowId) => newMatrix[rowId][colId]);
        const colString = colArray.join('');
        const winningPosition = colString.indexOf(winningLine);
        if (winningPosition !== -1) {
          setWinningPositions(
            Array.from({length: winningNumber}, (val, i) => [winningPosition + i, colId])
          );
        }
        return winningPosition !== -1;
      }

      function checkDiagonal(rowId, colId) {
        rowId, colId
      }
			
      return checkRow(rowId) || checkCol(colId) || checkDiagonal(rowId, colId);
    }

    const rowId = dropToken(colId); // rowId of slot that token was dropped in 
    if (rowId !== null) { // If token was dropped successfully, i.e. valid move was made
      setBoardMatrix(newMatrix); 
      setLastMovePosition([rowId, colId]); // [rowId, colId] of positon where token was dropped

      if (checkWin(rowId)) {
        setGameActive(false);
				return
      }

      setMoveNum(moveNum + 1);
    }
  }
  

  return (
    <>
      <h1>Connect 4</h1>
      <Prompt moveNum={moveNum} gameActive={gameActive}/>
      <DropBtnBar handleMove={handleMove} numBtns={numCols}/>
			<div className='game-area'>

				<div className='undo-restart'>
					<button className='undo-btn'>
            <i className='fa fa-undo'></i>
          </button>
					<button className='restart-btn'>
            <i className='fa fa-refresh'></i>
          </button>
				</div>

        <Board boardMatrix={boardMatrix} lastMovePosition={lastMovePosition} winningPositions={winningPositions}/>

        <div className='stats'>
          <button className='undo-btn'>
            <i className='fa fa-undo'></i>
          </button>
					<button className='restart-btn'>
            <i className='fa fa-refresh'></i>
          </button>
        </div>
			</div>
    </>
  )
}

function Prompt({ moveNum, gameActive }) {
  const player = moveNum % 2 === 0 ? 'Yellow' : 'Red';
  const action = gameActive ? ' to move' : ' wins!';

  return (
    <div className='prompt'>
      <span className={player.toLowerCase()}>{player}</span>
      <span className={action}>{action}</span>
    </div>
  )
}

export default Game
