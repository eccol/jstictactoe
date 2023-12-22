const createUser = ({ symbol }) => ({
  symbol,
});

const p1 = createUser({ symbol: "X" });
const p2 = createUser({ symbol: "O" });

const board = (function () {
  const EMPTY = '-';
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
      } else {
        return undefined;
      }
    },
    reset() {
      this.squares = Array(9).fill(EMPTY);
    },
    is_valid_move(sq) {
      return sq >= 0 && sq <= 8 && this.squares[sq] == '-';
    },
    print() {
      console.log(this.squares[0], this.squares[1], this.squares[2]);
      console.log(this.squares[3], this.squares[4], this.squares[5]);
      console.log(this.squares[6], this.squares[7], this.squares[8]);
      for (let i = 0; i < 9; i++) {
        document.querySelector(`[data-num="${i}"]`).innerText = this.squares[i];
      }
    }
  }
})();

const gameController = (({ p1, p2, board }) => ({
  p1,
  p2,
  current_turn: p1,
  board,
  change_turn() {
    if (this.current_turn === p1) {
      this.current_turn = p2;
    } else {
      this.current_turn = p1;
    }
  },
  place(sq) {
    if (this.board.is_valid_move(sq)) {
      this.board.squares[sq] = this.current_turn.symbol;
      this.change_turn();
      console.log(this.board.squares);
    }
  },
  play() {
    this.board.reset();
    while (this.board.winner() == undefined) {
      this.board.print();
      move = window.prompt(this.current_turn);
      this.place(move);
      if (move == 'q') {
        return;
      }
    }
    this.board.print();
    console.log(this.board.winner(), "wins");
  }
}))({ p1, p2, board });

// Interactivity listeners

document.querySelector(".start").addEventListener("click", () => {
  gameController.play();
});