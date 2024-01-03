const createUser = ({ symbol, name }) => ({
  symbol,
  name,
});

const board = (function () {
  const EMPTY = ' ';
  const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return {
    winner() {
      for (const combo of WINNING_COMBOS) {
        const [a, b, c] = combo;
        if (this.squares[a] != EMPTY && (this.squares[a] == this.squares[b] && this.squares[b] == this.squares[c])) {
          for (let x of combo) {
            document.querySelector(`[data-num="${x}"]`).classList.add("win");
          }
          return this.squares[a];
        }
      }
      if (this.squares.every(e => e != EMPTY)) {
        return "TIE";
      }
      return null;
    },
    reset() {
      this.squares = Array(9).fill(EMPTY);
      for (let i = 0; i < 9; i++) {
        document.querySelector(`[data-num="${i}"]`).className = "tile";
      }
    },
    is_valid_move(sq) {
      return sq >= 0 && sq <= 8 && this.squares[sq] == EMPTY;
    },
    place(sq, player) {
      this.squares[sq] = player.symbol;
      // X and O are hard coded in the CSS. If a feature to change symbols
      // is added, this will have to be changed somehow.
      document.querySelector(`[data-num="${sq}"]`).classList.add(player.symbol);
    }
  }
})();

const gameController = (({ board }) => {
  let _in_progress = false;
  const change_turn = () => {
    if (this.current_player === p1) {
      current_player = p2;
    } else {
      current_player = p1;
    }
    displayController.updateInfo(`${this.current_player.name}'s turn.`);
  };
  const makeMove = (sq) => {
    if (board.is_valid_move(sq)) {
      board.place(sq, current_player);
      change_turn();
    }
    displayController.updateSquares();
    if (board.winner() != null) {
      displayWinner();
    }
  };
  const displayWinner = () => {
    _in_progress = false;
    displayController.toggleFields();
    change_turn();
    if (board.winner() == "TIE") {
      displayController.updateInfo("It's a tie!");
    } else {
      displayController.updateInfo(`${current_player.name} wins!`);
    }
  };
  const start = () => {
    p1 = createUser({ symbol: "X", name: document.getElementById("xName").value || "X" });
    p2 = createUser({ symbol: "O", name: document.getElementById("oName").value || "O" });
    board.reset();
    displayController.updateSquares();
    _in_progress = true;
    displayController.toggleFields();
    change_turn();
  };

  const in_progress = () => { return _in_progress }
  return {
    start,
    in_progress,
    makeMove
  }
})({ board });

const displayController = (function () {
  const infoBox = document.querySelector(".info");
  return {
    updateSquares() {
      for (let i = 0; i < 9; i++) {
        document.querySelector(`[data-num="${i}"]`).innerText = board.squares[i];
      }
    },
    updateInfo(msg) {
      infoBox.innerText = msg;
      if (!gameController.in_progress) {
        infoBox.classList.add("bold");
      } else {
        infoBox.classList.remove("bold");
      }
    },
    toggleFields() {
      const fields = document.getElementsByClassName("nameInput");
      for (const field of fields) {
        field.disabled = !field.disabled;
      }
    }
  }
})();

// Create event listeners

(function () {
  document.querySelector(".start").addEventListener("click", () => {
    gameController.start();
  });

  for (let i = 0; i < 9; i++) {
    document.querySelector(`[data-num="${i}"]`).addEventListener("click", () => {
      if (gameController.in_progress()) {
        gameController.makeMove(i);
      }
    })
  }
})();