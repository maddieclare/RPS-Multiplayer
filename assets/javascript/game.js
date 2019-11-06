// GAME CODE

let userAlias = "";
let opponentAlias = "";
let wins = 0;
let losses = 0;
let userUniqueId = "";
let opponentReady = false;
let currentRound = 0;

let userObject = {
  id: "",
  opponentId: "",
  wins: 0,
  losses: 0,
  alias: "",
  currentSelection: "",
  round: 0
};

let opponentObject = {
  id: "",
  wins: 0,
  losses: 0,
  alias: "",
  currentSelection: "",
  round: 0
};

let gameCode = function() {
  // Creates new user in Firebase with unique ID.
  // Starts player event listener.
  // Shows welcome page.
  function initialiseTheGame() {
    databaseModify.create().then(function() {
      databaseModify.userListen();
      userScreen.welcome();
    });
  }

  function setUserAlias(newAlias) {
    // Stores player alias in Firebase.
    // Shows waiting screen.
    userObject.alias = newAlias;
    databaseModify.update().then(function() {
      userScreen.update();
      userScreen.awaitingOpponent();
      // If no opponent ID assigned to player, continues listening.
      // Else starts game.
      if (!userObject.opponentId) {
        databaseModify.search();
      } else {
        databaseModify.opponentListen();
        startTheGame();
      }
    });
  }

  // Initialises opponent object.
  function opponentFound(opponentProfile, opponentRef) {
    opponentObject = opponentProfile;
    opponentObject.opponentId = userUniqueId;
    userObject.opponentId = opponentRef;
    // If opponent has set an alias, sets opponentReady to true.
    if (opponentProfile.alias) {
      opponentReady = true;
    }
    // Assigns opponent ID to player object.
    // Starts event listener for opponent alias.
    databaseModify.lockInOpponent(opponentProfile, opponentRef);
    databaseModify.opponentListen();
    // Starts game once opponent alias registered.
    databaseModify.update().then(function() {
      userScreen.update();
      startTheGame();
    });
  }

  // Called by opponent listener function on opponent object change.
  // If the change = opponent has set their alias, starts game.
  // Else  if the change = opponent has made selection, determines winner.
  function processOpponentObjectChange() {
    if (!opponentReady && opponentObject.alias) {
      opponentReady = true;
      startTheGame();
    } else if (
      opponentReady &&
      opponentObject.currentSelection &&
      userObject.round == currentRound &&
      opponentObject.round == currentRound
    ) {
      processOutcome(userObject.currentSelection);
    }
  }

  // Calls start new round function if opponent has chosen alias.
  function startTheGame() {
    if (opponentReady) {
      startNewRound();
    }
  }

  // Sets round to = currentRound value.
  // Clears previous player selection.
  // Displays user selection screen.
  function startNewRound() {
    userObject.round = currentRound;
    userObject.currentSelection = "";
    databaseModify.update();
    userScreen.choose();
  }

  // Updates player selection in userObject.
  // If opponent has already chosen, determines outcomes.
  // Else shows waiting screen.
  function userSelectionInput(selection) {
    userObject.currentSelection = selection;
    databaseModify.update().then(function() {
      if (opponentObject.currentSelection) {
        processOutcome(selection);
      } else {
        userScreen.awaitingOpponentChoice(selection);
      }
    });
  }

  // If both players have selected, increments round count and determines winner.
  function processOutcome() {
    if (userObject.currentSelection && opponentObject.currentSelection) {
      let playerSelections = {
        user: userObject.currentSelection,
        opponent: opponentObject.currentSelection
      };
      let result = determineOutcome(playerSelections);
      currentRound++;
      if (result == "win") {
        userWins({ playerSelections: playerSelections, source: "selections" });
      } else if (result == "tie") {
        userTies({ playerSelections: playerSelections, source: "selections" });
      } else if (result == "lose") {
        userLoses({ playerSelections: playerSelections, source: "selections" });
      }
    }
  }

  // Gets player/opponent selections.
  // Returns win/lose/tie result depending on player selections.
  function determineOutcome(playerSelections) {
    let userSelection = playerSelections.user;
    let opponentSelection = playerSelections.opponent;
    if (userSelection == opponentSelection) {
      return "tie";
    } else if (userSelection == "rock") {
      if (opponentSelection == "scissors") {
        return "win";
      } else {
        return "lose";
      }
    } else if (userSelection == "paper") {
      if (opponentSelection == "rock") {
        return "win";
      } else {
        return "lose";
      }
    } else if (userSelection == "scissors") {
      if (opponentSelection == "paper") {
        return "win";
      } else {
        return "lose";
      }
    }
  }

  // Adds 1 to player win count and show win screen.
  // Calls new round function after a few seconds.
  function userWins() {
    userObject.wins++;
    databaseModify.update();
    userScreen.win();
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  // Adds 1 to player lose count and show lose screen.
  // Calls new round function after a few seconds.
  function userLoses() {
    userObject.losses++;
    databaseModify.update();
    userScreen.lose();
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  // Shows tie screen.
  // Calls new round function after a few seconds.
  function userTies() {
    userScreen.tied();
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  return {
    initialise: initialiseTheGame,
    newUserAlias: setUserAlias,
    opponentObjectChanged: processOpponentObjectChange,
    start: startTheGame,
    newRound: startNewRound,
    userSelected: userSelectionInput,
    win: userWins,
    lose: userLoses,
    tie: userTies,
    opponentFound: opponentFound
  };
};

let game = gameCode();
