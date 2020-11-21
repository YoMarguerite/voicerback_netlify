class Player{
    constructor(pseudo){
      this.pseudo = pseudo;
      this.ready = false;
      this.ingame = false;
      this.haveVote = false;
      this.record = null;
      this.score = 0;
      this.vote = [];
    }

    addVote = function(pseudo) {
      this.vote.push(pseudo);
    }
};
  
class Game{
    constructor(pseudo, code){
      this.creator = new Player(pseudo);
      this.players = [this.creator];
      this.sentence = Manage.generateSentence();
      this.code = code;
      this.winners = [];

      this.wait = true;
      this.defineTimeout();
    };

    defineTimeout = function() {
      if(this.wait) {
        this.wait = false;
        let self = this;
        setTimeout(function() {
          self.defineTimeout();
        }, 10000);
      }
      else {
        console.log("autodestruction")
        Manage.delGame(this.code);
      }
    };

    getData = function() {
      return {
        creator : this.creator,
        players : this.players,
        sentence : this.sentence,
        code : this.code,
        winners : this.winners
      }
    };

    getPlayer = function(pseudo) {
      return this.players.find((player) => { return player.pseudo == pseudo});
    };

    addPlayer = function(pseudo) {
      if(!this.getPlayer(pseudo)) {
        let player = new Player(pseudo);
        this.players.push(player);
        return player;
      }
      return false;
    };

    delPlayer = function(pseudo) {
      this.players = this.players.filter((player) => {
        return player.pseudo !== pseudo
      });
    };

    defineWinner = function() {
      let ingamePlayers = this.players.filter((player) => {
        return player.ingame;
      });

      let votes = ingamePlayers.map((player) => {
        return player.vote.length;
      });

      let nbVote = votes.reduce((a, b) => {
          return a + b;
      });
      
      if(ingamePlayers.length === nbVote) {
          let maxVote = Math.max(...votes);
          this.winners = this.players.filter((player) => {
              return player.vote.length === maxVote;
          });
          this.players = this.players.map((player) => {
            if(this.winners.includes(player)) {
              player.score++;
            }
            return player;
          });
      }   
    };
};



const Manage = {
  games: [],

  getGame: function(code) {
    let game = this.games.find((game) => { return game.code === code});
    game.wait = true;
    return game.getData();
  },

  getGames: function(code) {
    return this.games.map((game) => {
      return game.getData();
    });
  },
  
  addGame: function(pseudo) {
    let code = this.generateID(this.games);
    if(typeof pseudo === 'string' && typeof code === 'string') {
      let game = new Game(pseudo, code);
      this.games.push(game);
      return game.getData();
    }
    return false;
  },

  delGame: function(code) {
    this.games = this.games.filter((game) => {
      return game.code !== code;
    });
  },

  generateID: function(array) {
    let test = true;
    let result = ""; 
    let resultLength = 4;
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    let length = alphabet.length; 
  
    if(array.length === Math.pow(length, resultLength)) {
      return null;
    }
  
    while(test){
      result = "";
  
      while (result.length < resultLength){ 
       result += alphabet[Math.floor(Math.random() * length)];
      }
  
      test = array.find((el) => {
        return el.code === result;
      });
    }
    return result;
  },
  
  generateSentence: function() {
    let actions = ['Sing', 'Shout', 'Speak', 'Whisper'];
    let words = ['Cat', 'Dog', 'Mouse', 'Bird', 'Bear', 'Fish'];
    return actions[Math.floor(Math.random() * actions.length)]+' "'+words[Math.floor(Math.random() * words.length)]+'".';
  }
};


module.exports = {
    Player,
    Game,
    Manage
};