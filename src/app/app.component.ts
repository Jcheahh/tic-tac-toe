import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Field = "X" | "O" | undefined

interface Board {
  0: Field,
  1: Field,
  2: Field,
  3: Field,
  4: Field,
  5: Field,
  6: Field,
  7: Field,
  8: Field,

  // Dirty hack :'(
  [key: number]: Field | undefined
}


interface StateResponse {
  gameOver: boolean, 
  board: Board
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  board: Board = {
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
    8: undefined,
  }
  playerX = "X"
  playerO = "O"
  player: any
  over: any
  winner: any
  
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http
      .get<StateResponse>('https://quiet-taiga-58800.herokuapp.com/state')
      .subscribe((data) => {
        this.board = data.board;
        this.over = data.gameOver;
        this.player = this.playerX;
      })
  }

  addTicToe(id: any) {

    const body = { playerId: this.player, position: id };

    this.http.post<any>('https://quiet-taiga-58800.herokuapp.com/turn', body).subscribe(data => {
        this.board = data.state;
        this.over = data.gameOver;
        if (!this.over) {
          this.changePlayer();
        } 
        if (data.winner != null) {
          this.winner = data.winner.id;
        }
    })
  }

  resetBoard() {

    this.http.post<any>('https://quiet-taiga-58800.herokuapp.com/reset', null).subscribe(board => {
        this.board = board;
        if (this.over) {
          this.over = !this.over;
        }
        this.player = this.playerX
        this.winner = null
    })
  }

  changePlayer(): void {
    if (this.player == this.playerX) {
      this.player = this.playerO
    } else if (this.player == this.playerO) {
      this.player = this.playerX
    }

  }

}
