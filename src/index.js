import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.squareClass} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        let squareClass = "square";
        if (this.props.winnerSquares && this.props.winnerSquares.includes(i)) {
            squareClass = "winner";
        }
        return (<Square 
            squareClass={squareClass}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}    
            />
        );
    }
  
    render() {
        /*let fullBoard;
        for (let i = 0; i < 3; i++) {
            
        }*/
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            clickedSquares: Array(9).fill(null),
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const clickedSquares = this.state.clickedSquares.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            clickedSquares: clickedSquares.concat(i),
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const clickedSquares = this.state.clickedSquares;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const column = (clickedSquares[move] % 3) + 1;
            const row = Math.trunc(clickedSquares[move] / 3) + 1;

            const desc = move ?
                "Go to move #" + move + " (" + column + ", " + row +")" :
                "Go to game start";
            let buttonClass = "normal";
            if (move === this.state.stepNumber) {
                buttonClass = "selected"
            }
            return (
                <li key={move}>
                    <button className={buttonClass} onClick={() => this.jumpTo(move)}>{desc}</button> 
                </li>
            );
        });

        let status;
        let winnerSquares;
        if (winner) {
            status = "Winner: " + winner[0];
            winnerSquares = winner[1];
        } else if (this.state.stepNumber === 9) {
            status = "Tie!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                        winnerSquares = {winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
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
            return [squares[a], lines[i]];
        }
    }
    return null;
}