const createUser = ({ symbol, name }) => ({
  symbol,
  name,
});

const board = (function () {
  const EMPTY = ' ';
  return {
    winner() {
      if (this.squares[0] != EMPTY && ((this.squares[0] == this.squares[1] && this.squares[1] == this.squares[2]) ||
        this.squares[0] == this.squares[3] && this.squares[3] == this.squares[6] ||
        this.squares[0] == this.squares[4] && this.squares[4] == this.squares[8])) {
        return this.squares[0];
      } else if (this.squares[8] != EMPTY && ((this.squares[8] == this.squares[5] && this.squares[5] == this.squares[2]) ||
        this.squares[8] == this.squares[7] && this.squares[7] == this.squares[6])) {
        return this.squares[8];
      } else if (this.squares[4] != EMPTY && ((this.squares[4] == this.squares[3] && this.squares[3] == this.squares[5]) ||
        this.squares[4] == this.squares[1] && this.squares[1] == this.squares[7])) {
        return this.squares[4];
      } else if (this.squares[2] != EMPTY && (this.squares[2] == this.squares[4] && this.squares[4] == this.squares[6])) {
        return this.squares[2];
      } else if (this.squares.every(e => e != EMPTY)) {
        return "TIE"
      } else {
        return undefined;
      }
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
    document.querySelector(".info").innerText = `${this.current_turn.name}'s turn.`
  },
  place(sq) {
    if (this.board.is_valid_move(sq)) {
      this.board.squares[sq] = this.current_turn.symbol;
      this.change_turn();
      console.log(this.board.squares);
    }
    displayController.update();
    if (this.board.winner() != undefined) {
      this.displayWinner();
    }
  },
  displayWinner() {
    this.in_progress = false;
    this.change_turn();
    if (this.board.winner() == "TIE") {
      document.querySelector(".info").innerText = `It's a tie!`
    } else {
      document.querySelector(".info").innerText = `${this.current_turn.name} wins!`
    }
  },
  start() {
    this.p1 = createUser({ symbol: "X", name: document.getElementById("xName").value });
    this.p2 = createUser({ symbol: "O", name: document.getElementById("oName").value });
    this.board.reset();
    displayController.update()
    this.in_progress = true;
    this.change_turn();
  }
}))({ board });

displayController = (() => ({
  update() {
    for (let i = 0; i < 9; i++) {
      document.querySelector(`[data-num="${i}"]`).innerText = board.squares[i];
    }
  }
}))();

// Interactivity listeners

document.querySelector(".start").addEventListener("click", () => {
  gameController.start();
});

for (let i = 0; i < 9; i++) {
  document.querySelector(`[data-num="${i}"]`).addEventListener("click", () => {
    if (gameController.in_progress) {
      gameController.place(i);
    }
  })
};