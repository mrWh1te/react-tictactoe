import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let classNames = "square";
    if (props.value === 'O') {
        classNames += " circle";
    }

    return (    
        <button 
            className={classNames}
            onClick={() => { props.onClick() }}
        >
            {props.value}
        </button>
    );
}

function Board(props) {

    function renderSquare(i) {
        return (
            <Square 
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }

    return (
        <div className="container">
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

const initialGameState = {
    history: [{
        squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialGameState;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); // immutable

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // stay immutable
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    resetGame() {
        this.setState({...initialGameState})
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move : 
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        moves.push(
            <li key="last">
                <button onClick={() => this.resetGame()}>
                    Reset Game
                </button>
            </li>
        )

        let status;
        let gameBoardClassNames = "game-board"
        if (winner) {
            status = 'Winner: ' + winner;
            gameBoardClassNames += " winner-" + winner.toLowerCase();
        } else {
            const currentPlayer = this.state.xIsNext ? 'X' : 'O';
            status = 'Current player: ' + currentPlayer;
        }

        return (
            <div className="game">
                <div className={gameBoardClassNames}>
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}

// ======== Helpers =======================

const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
