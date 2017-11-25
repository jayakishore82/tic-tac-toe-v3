(function(){

    let firstTime = true;
    const start = document.getElementById("start");
    const finish = document.getElementById("finish");
    const board = document.getElementById("board");
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");
    const boxes = document.querySelector('.boxes');

/*gameUI object
*/
    let gameUI = {

/*Function to display the Start screen
*/
      showStartScreen: function(){

        board.style.display = 'none';
        finish.style.display = 'none';
        start.style.display = '';
        this.startBtnHandler(board);
      },

/*Event Listener for Start Button
*/
      startBtnHandler: function() {

        const btn = start.querySelector('a');
        btn.addEventListener('click', () => {
            this.showGameScreen();
        });
      },

/*Displays the game board.
*/
      showGameScreen : function(){

        if (firstTime){
          firstTime = false;
        }
        else {
          this.setGameScreens();
          game = new Game();
        }

        board.style.display = '';
        finish.style.display = 'none';
        start.style.display = 'none';
        player1.className += ' active';
        this.boardBoxHandler();

      },

/*Function to clear the screens when new game btn is pressed.
*/

      setGameScreens: function(){

        const boxlist = boxes.querySelectorAll('.box');
        player1.className = 'players';
        player2.className = 'players';
        boxlist.forEach(box => box.className = 'box');
        finish.className = 'screen screen-win';
      },

/*Event listener for board boxes, for mouseover sets the corresponding background images,
 For mouse click fills the boxes with either'X' or 'O' and toggles the active player.
*/
      boardBoxHandler: function() {

        boxes.addEventListener('mouseover', (e) => {
            if (e.target.className === 'box') {
              if (game.getCurrentPlayer() === 'O'){
                e.target.style.backgroundImage = "url('img/o.svg')";
              }
              else {
                e.target.style.backgroundImage = "url('img/x.svg')";
              }
            }

        });

        boxes.addEventListener('mouseout', (e) => {
              e.target.style.backgroundImage = "";
        });

        boxes.addEventListener('click', (e) => {
          if (e.target.className === 'box') {
              if(game.getCurrentPlayer() === 'O'){
                e.target.className += ' box-filled-1';
                player2.className += ' active';
                player1.className = 'players';
              }
              else{
                  e.target.className += ' box-filled-2';
                  player1.className += ' active';
                  player2.className = 'players';
              }
              this.setGameState();
          }

        });

      },

/*Function to check the game state. Calls the function loadBoardArray to load the input and check
the game result.
*/

      setGameState : function() {

        let result = game.loadBoardArray();
        const self = this;
        if (result === 'Win' || result === 'Draw') {
          setTimeout(function() {
            self.setFinishScreen(result);}, 800);
        }

        else {
              game.setCurrentPlayer();
        }

      },

/*Displays the finish screen.
*/
      setFinishScreen : function(result) {

          const message = document.querySelector('.message');
          board.style.display = 'none';
          finish.style.display = '';
          if (result === 'Win') {
            message.textContent = 'Winner';
            if (game.getCurrentPlayer() === 'O'){
               finish.className += ' screen-win-one';
            }
            else {
              finish.className += ' screen-win-two';
            }
          }
          else {
              message.textContent = 'Draw';
              finish.className += ' screen-win-tie';
          }
          this.newGameBtnHandler();
      },

/*Event Listener for New game btn.
*/
      newGameBtnHandler : function() {

        const newGamebtn = finish.querySelector('a');
        newGamebtn.addEventListener('click', () => {
          gameUI.showGameScreen();
        });

      }
    }

//Game constructor
    function Game(){
      this.currentPlayer = 'O';
      this.moveCount = 0;
      this.boardArray = [ [0,0,0],
                          [0,0,0],
                          [0,0,0]
                       ];

    }
/*Function to load the Board array.
*/
    Game.prototype.loadBoardArray = function(){

      const boxList = document.querySelectorAll(".box");
      let k = 0;

      for(let i=0; i<3; i++) {
          for(let j=0; j<3; j++){
            let className = boxList[k].className;

            if (className.substring(4,14) === 'box-filled' && this.boardArray[i][j] === 0){
                this.boardArray[i][j] = this.currentPlayer;
                this.moveCount++;
                return this.findGameResult(i,j);
            }
            k++;
          }
      }

    }

/* Function to check the Game result
*/
    Game.prototype.findGameResult = function(i,j){

      let  matchFound = true;
      let result = 'Continue';

//Checks the row
      function checkRow() {

        for(let k=0; k<3; k++){
          if(this.boardArray[i][k] !== this.currentPlayer) {
            matchFound = false;
            break;
          }
        }
        return matchFound;
      }

//Checks the column
      function checkCol() {

        matchFound = true;
        for(let k=0; k<3; k++){
          if(this.boardArray[k][j] !== this.currentPlayer) {
            matchFound = false;
            break;
          }
        }
        return matchFound;
      }

//Checks the diagonal
      function checkDiag() {

        matchFound = true;
        for(let k=0; k<3; k++){
          if(this.boardArray[k][k] !== this.currentPlayer) {
            matchFound = false;
            break;
          }
        }
        return matchFound;
      }

//Checks the antidiagonal
      function checkDiag2() {

        matchFound = true;
        for(let k=0; k<3; k++){
          if(this.boardArray[k][2-k] !== this.currentPlayer) {
            matchFound = false;
            break;
          }
        }
        return matchFound;
      }

      if (checkRow.call(this)){
          result = 'Win';
          return result;
      }

      if(checkCol.call(this)){
        result = 'Win';
        return result;
      }

      if (i===j){
        if(checkDiag.call(this)){
          result = 'Win';
          return result;
        }
      }

      if ((i + j) === 2){
        if(checkDiag2.call(this)){
          result = 'Win';
          return result;
        }
      }

//Check whether the game is Draw
      if(this.moveCount === 9) {
        result = 'Draw';
        return result;
      }

    }
//function to get the current player
    Game.prototype.getCurrentPlayer = function(){

      return this.currentPlayer;
    }

//function to toggle the player.
    Game.prototype.setCurrentPlayer = function(){

      if (this.currentPlayer === 'O') {
        this.currentPlayer = 'X';
      }
      else {
        this.currentPlayer = 'O'
      }
    }

    let game = new Game();
    gameUI.showStartScreen();

}());
