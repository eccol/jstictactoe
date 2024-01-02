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
          return this.squares[a];
        }
      }
      return null;
    },
    reset() {
      this.squares = Array(9).fill(EMPTY);
    },
    is_valid_move(sq) {
      return sq >= 0 && sq <= 8 && this.squares[sq] == EMPTY;
    }
  }
})();

const gameController = (({ board }) => ({
  current_turn: this.p2,
  board,
  in_progress: false,
  change_turn() {
    if (this.current_turn === this.p1) {
      this.current_turn = this.p2;
    } else {
      this.current_turn = this.p1;
    }
    displayController.updateInfo(`${this.current_turn.name}'s turn.`);
  },
  place(sq) {
    if (this.board.is_valid_move(sq)) {
      this.board.squares[sq] = this.current_turn.symbol;
      this.change_turn();
      console.log(this.board.squares);
    }
    displayController.updateSquares();
    if (this.board.winner() != null) {
      this.displayWinner();
    }
  },
  displayWinner() {
    this.in_progress = false;
    this.change_turn();
    if (this.board.winner() == "TIE") {
      displayController.updateInfo("It's a tie!");
    } else {
      displayController.updateInfo(`${this.current_turn.name} wins!`);
    }
  },
  start() {
    this.p1 = createUser({ symbol: "X", name: document.getElementById("xName").value || "X" });
    this.p2 = createUser({ symbol: "O", name: document.getElementById("oName").value || "O" });
    this.board.reset();
    displayController.updateSquares();
    this.in_progress = true;
    this.change_turn();
  }
}))({ board });

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
      if (gameController.in_progress) {
        gameController.place(i);
      }
    })
  }
})();