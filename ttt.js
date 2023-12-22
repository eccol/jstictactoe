const createUser = ({ symbol }) => ({
  symbol,
});

const p1 = createUser({ symbol: "X" });
const p2 = createUser({ symbol: "O" });

const board = (() => ({
  squares: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
  winner() {
    if ((this.squares[0] == this.squares[1] && this.squares[1] == this.squares[2]) ||
      this.squares[0] == this.squares[3] && this.squares[3] == this.squares[6] ||
      this.squares[0] == this.squares[4] && this.squares[4] == this.squares[8]) {
      return this.squares[0];
    } else if ((this.squares[8] == this.squares[5] && this.squares[5] == this.squares[2]) ||
      this.squares[8] == this.squares[7] && this.squares[7] == this.squares[6]) {
      return this.squares[8];
    } else {
      return undefined;
    }
  },
  is_valid_move(sq) {
    return sq >= 0 && sq <= 8 && this.squares[sq] == '-';
  }
}))();

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
  // turn() {
  //   move = window.prompt(this.current_turn.symbol);
  //   this.place(move);
  //   this.change_turn();
  // }
}))({ p1, p2, board });
