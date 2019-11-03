// Actual game code.
let userAlias = "";
let opponentAlias = "";
let wins = 0;
let losses = 0;

let game = gameCode();

let gameCode = function() {
  function initialiseTheGame() {
    // Displays welcome screen.
  }

  function setUserAlias(newAlias) {
    // Lets user set their alias.
    // Adds user alias to playerObject.
  }

  function startTheGame(opponentName) {
    // Sets opponent alias.
    // Starts a new round.
  }

  function startNewRound() {
    // Clears previous player selection.
    // Starts timer.
    // Displays user selection screen.
  }

  function userSelectionInput(selection) {
    // Updates player selection in playerObject.
    // Shows screen letting player know opponent is still selecting.
  }

  function eitherPlayerMakesASelection(playerSelections) {
    // If statement:
      // If both players have selected:
        // Display player/opponent choices.
        // Call determineOutcome function.
        // Sub-if statement:
          // Show win screen for one player and loss for the other, or tie for both.
      // Else if only player 1 has made a selection:
        // Show player selection.
        // Let player know opponent is still choosing.
      // Else if only opponent has made a selection:
        // Tell player to hurry up.
      // Else log an error.
  }

  function timerRanOut(playerSelections) {
    // If neither player has selected, show time up screen (both players lose a point).
    // Else if only 1 player has made a selection, that player wins.
  }

  function determineOutcome(playerSelections) {
    // Get player/opponent selections.
    // If both players make the same selection, return tie result.
    // Else if:
      // Player guesses rock and opponent guesses scissors, player wins (else they lose).
      // Player guesses paper and opponent guesses rock, player wins (else they lose).
      // Player guesses scissors and opponent guesses paper, player wins (else they lose).
      // Else return an error.
  }

  function userWins() {
    // Show win screen.
    // Add 1 to player win count.
    // Call new round function after a few seconds.
  }

  function userLoses() {
    // Show lose screen.
    // Add 1 to player loss count.
    // Call new round function after a few seconds
  }

  function userTies() {
    // Show tie screen.
    // Call new round function after a few seconds.
  }

  function connectionLostWithOpponent() {
    // Alert player connection has dropped.
    // Wait for new opponent.
  }

  function errorHandlingFunction(error) {
    // Log error in console and alert players.
  }

  return {
    initialise: initialiseTheGame,
    newUserAlias: setUserAlias,
    start: startTheGame,
    newRound: startNewRound,
    userSelected: userSelectionInput,
    selection: eitherPlayerMakesASelection,
    timeUp: timerRanOut,
    opponentDropped: connectionLostWithOpponent,
    error: errorHandlingFunction
  };
};

// User interface.
let userScreen = userScreenCode();

let userScreenCode = function() {
  // UI change functions go here.
};

// Database code.
let playerObject = {
  id: "string",
  wins: 0,
  losses: 0,
  alias: "string",
  currentSelection: "string: paper | scissors | rock"
};

let databaseModify = databaseModifyCode();

let databaseModifyCode = function() {
  // Database functions go here.
}