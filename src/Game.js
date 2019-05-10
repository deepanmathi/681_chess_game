import React from 'react';
import Clock from './Clock';
import Moment from 'react-moment';
const { firebase, Chess, ChessBoard, metro_board_theme, symbol_piece_theme, wikipedia_board_theme, $ } = window;

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Game extends React.Component {
  constructor(props) {
    super(props);
    let date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    this.updateDeadline = this.updateDeadline.bind(this);
    this._tick = this._tick.bind(this);
   this.state = { token: this.props.token, squares: [] , playerNum: 0, isMyTurn: true,  
    deadline: date.toString(), currentDate: '', currentUser: '', disqualifyCounter: 0, status: this.props.status};
    console.log(this.state.status);
    this.engine = new Chess();
  }

  render() {
    return (
      <div className='view row'>
        <div className='column column-50'>
          <div id='game-board' />
        </div>
        <div className='column column-50'>
          <blockquote>
            <h5 className='turn'>{ this.state.turnText }</h5>
            <h5 className='status'>{ this.state.statusText }</h5>
          </blockquote>
          <p className='history'>{ history(this.state.moves) }</p>
          <div className='history'>Deadline to make next move:: <Clock deadline={ this.state.deadline }/></div>
        </div>
      </div>
      
    );
  }

  componentDidMount() {
    const date = new Date();
    this.setState({currentDate: date.toString()});
    let count = 0;
    let intervalId = 0;
    if (this.state.status === 'In-Progress') {
      intervalId = setInterval(this._tick, 10000);
    }
    this.setState({intervalId: intervalId});
    listenForUpdates(this.state.token, (id, game) => {
      this.setState({'currentGameID': id});
      this._updateBoard(id, game);
      this._updateInfo(game, id);
    });

  }

  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.state.intervalId);
}

  _tick() {
    const engine = this.engine;
    if (this.state.deadline) {
      const time = (Date.parse(this.state.deadline) - Date.parse(new Date()));
          if(time < 0) {
            const endFen = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78';
            this.engine.load(endFen);
            this.setState({disqualifyCounter: this.state.disqualifyCounter++});
            this.setState({statusText : 'Game over!! '+this.state.turnUser+' has been disqualified'});
            this.setState({turnText: ''});
            if (this.state.disqualifyCounter < 2) {
              const id = this.state.currentGameID;
              const game = {
                status: 'Complete',
                winner: this.state.turnOpponent
              }
              firebase.database().ref(`/games/${id}`).update(game);
            }
          } else {
            //this._tick(a, game);
          }
    }
  }

  _updateInfo(game, id) {
    const engine = this.engine;
    const playerNum = figurePlayer(this.state.token, game);
    this.setState({
      moves: game.moves ? game.moves.split(",") : [],
      p1_token: game.p1_token,
      p2_token: game.p2_token,
      turnText: turnText(playerNum, isMyTurn(playerNum, engine.turn()), game),
      statusText: statusText(this.engine.turn(), this.engine.in_checkmate(), this.engine.in_draw(), this.engine.in_check(), this.engine.game_over(), id, game, playerNum),
      deadline: setDeadline(game, id),
      playerNum: playerNum,
      turnUser: turnUser(playerNum, isMyTurn(playerNum, engine.turn()), game),
      turnOpponent: turnOpponent(playerNum, isMyTurn(playerNum, engine.turn()), game)
    });

    if(this.state.statusText.indexOf('Game over')!=-1)
    {
      let date = new Date();
      this.setState({status: 'Complete'});
      this.setState({deadline: date.toString()});
      let winnerEmail;
      if (this.engine.turn() === 'w'){
        winnerEmail = game.p2_email;
      } else  {
        winnerEmail = game.p1_email;
      }
      this.setState({
        turnText: "'"+winnerEmail+ "' has WON the match !!!"
      })
    }
  }

  _updateBoard(id, game) {
    const playerNum = figurePlayer(this.state.token, game);
    this.engine.load(game.fen || INITIAL_FEN);

    if (!this.board) {
      this.board = this._initBoard(id, game);
      this.board.position(this.engine.fen());
    } else if (isMyTurn(playerNum, this.engine.turn())) {
      this.board.position(this.engine.fen());
    }
  }

  updateDeadline(date) {
    this.setState({deadline: date});
  }

  _initBoard(id, game) {
    const token = this.state.token;
    const engine = this.engine;
    const playerNum = figurePlayer(token, game);
    const config = {
      draggable: true,
      pieceTheme: symbol_piece_theme,
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      boardTheme: metro_board_theme,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
    };

    function onMouseoutSquare(square, piece) {
      removeGreySquares();
    }

    function removeGreySquares() {
      const arr = JSON.parse(sessionStorage.getItem('squares'));
      const arrString = Array.from(arr);
      for(let i=0; i<arrString.length; i++) {
        let squareEl = $('#game-board .square-' + arrString[i]);
        let background = '#EFEFEF';
        if (squareEl.hasClass('black-3c85d') === true) {
          background = '#FFFFFF';
        }
        squareEl.css('background', background);
      }
      /*$('#game-board .square-55d63').css('background', '');*/
    }

    function greySquare (square) {
      let squareEl = $('#game-board .square-' + square);
      let background = '#a9a9a9';
      if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
      }
      squareEl.css('background', background);
    }

    function onMouseoverSquare(square, piece) {
     let squareArray = [];
      // get list of possible moves for this square
      const moves = engine.moves({
        square: square,
        verbose: true
        
      });
      // exit if there are no moves available for this square
      if (moves.length === 0) return;
      // highlight the square they moused over
      squareArray.push(square);
      greySquare(square);

      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        squareArray.push(moves[i].to);
        greySquare(moves[i].to);
      }
      sessionStorage.setItem('squares',JSON.stringify(squareArray));
    }

    const board = ChessBoard('game-board', config);
    if (playerNum === 2) {
      board.orientation('black');
    }
    return board;

    function onDragStart(source, piece) {
      return !engine.game_over() &&
        isMyTurn(playerNum, engine.turn()) &&
        allowMove(engine.turn(), piece);
    }

    function onDrop(source, target) {
      const m = engine.move({
        from: source,
        to: target,
        promotion: 'q'
      });
      if (m === null) return "snapback";

      game.fen = engine.fen();
      game.moves = pushMove(game.moves, `${m['from']}-${m['to']}`);
      game.currentDeadline = getCurrentDateTime();
      games(id).set(game);
      }

    function onSnapEnd() {
      return board.position(engine.fen());
    }
  }
}
export default Game;

function history(moves = []) {
  return moves.map((m, idx) => <span key={m}>{idx + 1}) {m}</span>);
}

function listenForUpdates(token, cb) {
  const db = firebase.database().ref("/games");
  ["p1_token", "p2_token"].forEach((name) => {
    const ref = db.orderByChild(name).equalTo(token);
    ref.on('value', (ref) => {
      const [id, game] = parse(ref.val());
      if (!id) return;
      cb(id, game);
    });
  });
}

function parse(tree) {
  if (!tree) return [];
  const keys = Object.keys(tree);
  const id = keys[0];
  const game = tree[id];
  return [id, game];
}

function games(id) {
  return firebase
    .database()
    .ref(`/games/${id}`);
}

function domain() {
  const { hostname, port } = window.location;
  if (port) {
    return `http://${hostname}:${port}`;
  } else {
    return `http://${hostname}`;
  }
}

function pushMove(moves, move) {
  if (!moves) {
    return [move].join(",");
  } else {
    const arr = moves.split(",");
    return [...arr, move].join(",");
  }
}

function isMyTurn(playerNum, turn) {
  return (playerNum === 1 && turn === 'w') || (playerNum === 2 && turn === 'b');
}

function allowMove(turn, piece) {
  return !(turn === 'w' && piece.search(/^b/) !== -1) || (turn === 'b' && piece.search(/^w/) !== -1);
}

function figurePlayer(token, { p1_token, p2_token }) {
  if (token === p1_token) {
    return 1;
  } else if (token === p2_token) {
    return 2;
  } else {
    return 0;
  }
}

function turnText(playerNum, isMyTurn, {p1_email, p2_email}) {

  if (playerNum > 0) {
    let opponent,current;
      if (playerNum === 1) {
        current=p1_email;
        opponent = p2_email;
        
      } else {
        current=p2_email;
        opponent = p1_email;
      }
    if (isMyTurn) {
      return "Your("+current+") turn";
    } else {
      return "Waiting for "+opponent+" 's move...";
    }
  } else {
    return "View Only";
  }

}

function turnUser(playerNum, isMyTurn, {p1_email, p2_email}) {
  if (playerNum > 0) {
    let opponent,current;
      if (playerNum === 1) {
        current=p1_email;
        opponent = p2_email;
        
      } else {
        current=p2_email;
        opponent = p1_email;
      }
    if (isMyTurn) {
      return current;
    } else {
      return opponent;
    }
  } else {
    return "View Only";
  }

}

function turnOpponent(playerNum, isMyTurn, {p1_email, p2_email}) {
  if (playerNum > 0) {
    let opponent,current;
      if (playerNum === 1) {
        current=p1_email;
        opponent = p2_email;
        
      } else {
        current=p2_email;
        opponent = p1_email;
      }
    if (isMyTurn) {
      return opponent;
    } else {
      return current;

    }
  } else {
    return "View Only";
  }

}

function statusText(turn, in_mate, in_draw, in_check, is_gameOver, id , {p1_token, p2_token, p1_email, p2_email}, playerNum) {
 /* console.log('Check Game status');
  console.log('In Mate '+in_mate);
  console.log('In Check '+in_check);
  console.log('Is Game Over '+is_gameOver);*/
  const moveColor = turn === 'b' ? "Black" : "White";
  let winnerEmail;
  if (in_mate){
    if (playerNum === 2 && turn === 'w'){
      winnerEmail = p2_email;
    } else  {
      winnerEmail = p1_email;
    }
    const game = {status: 'Complete', winner: winnerEmail};
    games(id).update(game);
    return `Game over, ${moveColor} is in checkmate`;
  } else if (in_draw) {
    return 'Game over, drawn position';
  } else if (in_check) {
    return `${moveColor} is in check!`;
  } else if (is_gameOver) {
    return `Game over, ${moveColor} is defeated`;
  } else
    return "";
}

function setDeadline(game, id){
  if (!game.currentDeadline) {
    return getCurrentDateTime();
  }
  return game.currentDeadline;
}

function getCurrentDateTime() {
  let date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  return date.toString();
}
