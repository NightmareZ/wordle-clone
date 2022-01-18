import {Component, OnInit} from '@angular/core';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  grid: string[][];
  currentRow = 0;
  currentColumn = 0;
  currentWord = '';
  greenChars = '';
  yellowChars = '';
  grayChars = '';

  keyboard = [
    'йцукенгшщзхъ',
    'фывапролджэ',
    'ячсмитьбю'
  ];

  constructor() { }

  getCellStyle(row: number, column: number): any {
    if (row === this.currentRow) {
      if (column <= this.currentColumn) {
        return {
          border: '2px solid black'
        };
      }
    } else if (row < this.currentRow) {
      const char = this.grid[row][column];

      if (char === this.currentWord[column]) {
        if (!this.greenChars.includes(char)) {
          this.greenChars += char;
        }

        if (this.yellowChars.includes(char)) {
          this.yellowChars = this.yellowChars.split('').splice(this.yellowChars.indexOf('char'), 1).join('');
        }

        return {
          'background-color': '#6AA963'
        };
      } else if (this.currentWord.includes(char)) {
        if (!this.greenChars.includes(char) && !this.yellowChars.includes(char)) {
          this.yellowChars += char;
        }

        return {
          'background-color': '#CAB356'
        };
      } else {
        this.grayChars += char;

        return {
          'background-color': '#818181'
        };
      }
    }
  }

  checkState(): void {
    let found = false;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.grid.length; ++i) {
      let count = 0;

      for (let j = 0; j < this.grid[i].length; ++j) {
        const char = this.grid[i][j];

        if (char === '') {
          break;
        }

        if (this.currentWord[j] === char) {
          count++;
        } else {
          break;
        }
      }

      if (count === 5) {
        found = true;
        break;
      }
    }

    if (found) {
      setTimeout(() => {
        Dialog.alert({
          title: 'Победа',
          message: `Вы угадали слово "${this.currentWord}"!`,
        }).then(() => { this.resetGame(); });
      }, 100);
    } else if (this.currentRow * this.grid[0].length + this.currentColumn >= this.grid.length * this.grid[0].length) {
      setTimeout(() => {
        Dialog.alert({
          title: 'Неудача',
          message: 'Вы не угадали слово!',
        }).then(() => { this.resetGame(); });
      }, 100);
    }
  }

  keyboardButtonClick(row: number, column: number): void {
    const char = this.keyboard[row][column];

    if (this.currentRow * this.grid[0].length + this.currentColumn < this.grid.length * this.grid[0].length) {
      this.grid[this.currentRow][this.currentColumn] = char;
      this.currentColumn++;

      if (this.currentColumn >= this.grid[this.currentRow].length) {
        this.currentColumn = 0;
        this.currentRow++;
      }

      this.checkState();
    }
  }

  getKeyboardButtonStyle(row: number, column: number): any {
    const count = this.keyboard[row].length;
    const width = Math.floor(100 / count);
    const char = this.keyboard[row][column];
    let color = 'lightgray';

    if (this.greenChars.includes(char)) {
      color = '#6AA963';
    } else if (this.yellowChars.includes(char)) {
      color = '#CAB356';
    } else if (this.grayChars.includes(char)) {
      color = '#818181';
    }

    return {
      width: `calc(${width}% - 3px)`,
      'background-color': color
    };
  }

  clickBack(): void {
    if (this.currentColumn > 0) {
      this.grid[this.currentRow][this.currentColumn] = '';
      this.currentColumn--;
      this.grid[this.currentRow][this.currentColumn] = '';
    }
  }

  resetGame(): void {
    const words = ['народ', 'город', 'довод', 'повод', 'холод', 'короб', 'ветер', 'сурок', 'порог'];

    this.currentWord = words[Math.floor(Math.random() * words.length)];
    this.currentRow = 0;
    this.currentColumn = 0;
    this.greenChars = '';
    this.yellowChars = '';
    this.grayChars = '';

    const width = 5;
    const height = 6;
    this.grid = new Array(height);

    for (let i = 0; i < height; ++i) {
      this.grid[i] = new Array(width);

      for (let j = 0; j < width; ++j) {
        this.grid[i][j] = '';
      }
    }
  }

  ngOnInit(): void {
    this.resetGame();
  }
}
