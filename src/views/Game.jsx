/* eslint-disable react/prop-types */
import './Game.css'
import { useState } from 'react';


function Board({boardMatrix, ghostPosition, lastMovePosition, winningPositions}) {  

  function Row({ rowData, rowId }) {
    const row = rowData.map((val, colId) => {
      const classList = ['slot', (val === 1 ? 'yellow' : val === 2 ? 'red' : '')];

      // Highlight empty slot where token will be dropped, depending on which column the player is hovering over
      if (ghostPosition !== null && rowId === ghostPosition[0] && colId === ghostPosition[1]) {
        classList.push('ghost');
      }

      // Highlight tokens if they are part of a winning line
      if (winningPositions !== null && winningPositions.some(position => position[0] === rowId && position[1] === colId)) {
        classList.push('win');
      }

      // Highlight the most recently dropped token
      if (lastMovePosition !== null && rowId === lastMovePosition[0] && colId === lastMovePosition[1]) {
        classList.push('last-move');
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
  
  
function DropBtnBar({numBtns, handleMove, handleHover, handleStopHover}) { // Bar containing drop buttons  
  function DropBtn({onBtnClick, onHover, onStopHover}) { // Click button to drop token into column
    return (
      <button className='drop-btn' onClick={onBtnClick} 
        onMouseOut= {onHover}
        onMouseLeave={onStopHover}>
        <i className='fa fa-arrow-down'></i>
      </button>
    )
  }

  let dropBtns = [];
  for (let i = 0; i < numBtns; i++) {
    dropBtns.push(
      <DropBtn key={i} 
        onBtnClick={() => handleMove(i)} 
        onHover={() => handleHover(i)}
        onStopHover={() => handleStopHover()}
      />
    );
  }
  return (
    <div className='drop-bar'>{dropBtns}</div>
    )
}


function Game({updateScores, returnToMenu}) {
  const numRows = 6;
  const numCols = 7;
  const numSlots = numRows * numCols;

  function createBoardMatrix(numRows, numCols) {
    return Array.from({ length: numRows }, () => Array(numCols).fill(0));
  }

  const [boardHistory, setBoardHistory] = useState([createBoardMatrix(numRows, numCols)]); // Array of matrices storing each state of the board
  const [moveNum, setMoveNum] = useState(0);	
  const [moveHistory, setMoveHistory] = useState([null]); // Array of [rowId, colId] arrays storing the positions of each token played over the game
  
  const [ghostPosition, setGhostPosition] = useState(null);
  const [winningPositions, setWinningPositions] = useState(null);
  
  const [gameActive, setGameActive] = useState(true);
  
  const currentBoard = boardHistory[moveNum]; 
  const lastMove = moveHistory[moveNum]; 
  
  function handleHover(colId) { // When player hovers over drop-btn, ghost token is shown in board
    if (!gameActive) {
      return;
    }

    setGhostPosition(null);

    for (let i = numRows - 1; i >= 0 ; i--) {
      if (!currentBoard[i][colId]) { //Available slot -> will show ghost token here
        setGhostPosition([i, colId]);
        return;
      }
    }
  }

  function handleStopHover() {
    setGhostPosition(null);
  }

  function undoMove() {
    if (moveNum === 0 || !gameActive) {
      return;
    }
    setMoveNum(moveNum - 1);
  }

  function restartGame() {
    setMoveNum(0);
    setBoardHistory([createBoardMatrix(numRows, numCols)]);
    setWinningPositions(null);
    setGameActive(true);
  }

  function handleMove(colId) {
		if (!gameActive) {
			return;
		}

    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    const moveValue = moveNum % 2 === 0 ? 1 : 2;

    function dropToken(colId) {
      // Find lowest empty slot in column
      for (let i = numRows - 1; i >= 0 ; i--) {
        if (!newBoard[i][colId]) { // Empty slot
          newBoard[i][colId] = moveValue;
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
				const rowArray = newBoard[rowId];
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
        const colArray = newBoard.map((row, rowId) => newBoard[rowId][colId]);
        const colString = colArray.join('');
        const winningPosition = colString.indexOf(winningLine);
        if (winningPosition !== -1) {
          setWinningPositions(
            Array.from({length: winningNumber}, (val, i) => [winningPosition + i, colId])
          );
        }
        return winningPosition !== -1;
      }

      function checkDiagonalDown(rowId, colId) {
        const startRow = rowId - Math.min(rowId, colId);
        const startCol = colId - Math.min(rowId, colId);
        const endRow = rowId + Math.min(numRows - 1 - rowId, numCols - 1 - colId);
        const diagonalArray = [];
        for (let i=0; i <= endRow - startRow; i++) {
          diagonalArray.push(newBoard[startRow + i][startCol + i]);
        }
        const diagonalString = diagonalArray.join('');
        const winningPosition = diagonalString.indexOf(winningLine);
        if (winningPosition !== -1) {
          setWinningPositions(
            Array.from({length: winningNumber}, (val, i) => [startRow + winningPosition + i, startCol + winningPosition + i])
          )
        }
        return winningPosition !== -1;
      }

      function checkDiagonalUp(rowId, colId) {
        const startRow = rowId + Math.min(numRows - 1 - rowId, colId);
        const startCol = colId - Math.min(numRows - 1 - rowId, colId);
        const endRow = rowId - Math.min(rowId, numCols - 1 - colId);
        const diagonalArray = [];
        for (let i = 0; i <= startRow - endRow; i++) {
          diagonalArray.push(newBoard[startRow - i][startCol + i]);
        }
        const diagonalString = diagonalArray.join('');
        const winningPosition = diagonalString.indexOf(winningLine);
        if (winningPosition !== -1) {
          setWinningPositions(
            Array.from({length: winningNumber}, (val, i) => [startRow - winningPosition - i, startCol + winningPosition + i])
          )
        }
        return winningPosition !== -1;
      }
			
      return checkRow(rowId) || checkCol(colId) || checkDiagonalDown(rowId, colId) || checkDiagonalUp(rowId, colId);
    }

    const rowId = dropToken(colId); // rowId of slot that token was dropped in 
    if (rowId !== null) { // If token was dropped successfully, i.e. valid move was made
      setBoardHistory([...boardHistory.slice(0, moveNum + 1), newBoard]); 
      const lastMove = [rowId, colId];
      setMoveHistory([...moveHistory.slice(0, moveNum + 1), lastMove]); // [rowId, colId] of positon where token was dropped

      if (checkWin(rowId)) {
        setGameActive(false);
        updateScores(moveNum % 2 === 0 ? 'yellow' : 'red');
      }

      // If all slots are filled, end the game with a tie
      else if (moveNum === numSlots - 1) {
        setGameActive(false);
        updateScores('tie');
      }
      
      setMoveNum(moveNum + 1);
    }
  }

  return (
    <>
      <h1>Connect 4</h1>
      <Prompt moveNum={moveNum} gameActive={gameActive}/>
      <DropBtnBar handleMove={handleMove} handleHover={handleHover} handleStopHover={handleStopHover} numBtns={numCols}/>
			<div className='game-area'>

				<div className='undo-restart'>
					<button className='undo-btn' onClick={() => undoMove()}>
            <i className='fa fa-undo'></i>
          </button>
					<button className='restart-btn' onClick={() => restartGame()}>
            <i className='fa fa-refresh'></i>
          </button>
				</div>

        <Board boardMatrix={currentBoard} ghostPosition={ghostPosition} lastMovePosition={lastMove} winningPositions={winningPositions}/>

        <div className='menu'>
          <button className='back-to-menu' onClick={() => returnToMenu()}>
            <i className='fa fa-home'></i>
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
  
  let message = null;
  if (moveNum === 42) {
    message = 'Tie!';
  }
  else if (gameActive) {
    const player = moveNum % 2 === 0 ? 'Yellow' : 'Red';
    const verb = ' to move';
    message = <><span className={player.toLowerCase()}>{player}</span>{verb}</>

  } else {
    const player = moveNum % 2 === 0 ? 'Red' : 'Yellow';
    const verb = ' wins!'
    message = <><span className={player.toLowerCase()}>{player}</span>{verb}</>
  }

  return (
    <div className='prompt'>
      {message}
    </div>
  )
}

export default Game
