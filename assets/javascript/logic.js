// Actual game code.
let userAlias = "";
let opponentAlias = "";
let wins = 0;
let losses = 0;

let gameCode = function() {
  function initialiseTheGame() {
    userScreen.welcome();
  }

  function setUserAlias(newAlias) {
    // Lets player set their alias.
    // Stores player alias.
    userAlias = newAlias;
    console.log(userAlias);
    databaseModify.alias(newAlias);
    userScreen.update();
    console.log("setUserAlias working")
  }

  function startTheGame(opponentName) {
    // Sets opponent alias.
    opponentAlias = opponentName;
    console.log(opponentAlias);
    // Starts a new round.
    startNewRound();
  }

  function startNewRound() {
    console.log("New round started.")
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

let game = gameCode();

// User interface functions.
let userScreenCode = function() {
  function welcomeScreen() {
    console.log("Welcome!");
    // Displays welcome screen.
    // Prompts player to enter alias.
  }

  function awaitingOpponentScreen() {
    // Displays waiting screen.
  }

  function chooseYourMoveScreen() {
    // Displays player choice screen.
  }

  function awaitingOpponentsMoveScreen(usersChoice) {
    // Displays awaiting opponent choice screen.
  }

  function showThatOtherPlayerHasSelected() {
    // Displays hurry up screen.
  }

  function youWinScreen() {
    // Displays player win screen.
  }

  function youLoseScreen() {
    // Displays player lose screen.
  }

  function youTiedScreen() {
    // Displays tie screen.
  }

  function updateUserDetailsWindow() {
    console.log("User info updated.");
    // Show player alias, wins and losses in corner.
  }

  function showErrorScreen() {
    // Alerts player that there is an error (asks them to refresh browser?).
  }

  return {
    welcome: welcomeScreen,
    awaitingOpponent: awaitingOpponentScreen,
    choose: chooseYourMoveScreen,
    awaitingOpponentsChoice: awaitingOpponentsMoveScreen,
    opponentHasSelected: showThatOtherPlayerHasSelected,
    win: youWinScreen,
    lose: youLoseScreen,
    tied: youTiedScreen,
    update: updateUserDetailsWindow,
    error: showErrorScreen
  };
};

let userScreen = userScreenCode();

// User input functions.
let userInputCode = function() {
  function usersMoveSelected(selection) {
    // Selection either paper, scissors or rock.
    // Call game.selection function.
  }

  function submitNewUserAlias(newAlias) {
    // Update playerObject with player alias.
  }

  return {
    select: usersMoveSelected,
    newAlias: submitNewUserAlias
  };
};

let userInput = userInputCode();

// Database code.

// Database structure:
  // Heading    : Data
  // Session ID : Unique ID for the game session
  // Player One : playerObject
  // Player Two : playerObject
  // Live       : Boolean
  // Timer      : Number

let playerObject = {
  id: "string",
  wins: 0,
  losses: 0,
  alias: "string",
  currentSelection: "string: paper | scissors | rock"
};

// Initialise database.

// Join game.

// Event listener for database changes.

// Opponent join = game.start(opponentName)

// Player selections.

// Time's up = game.timeUp(playerSelections)

let databaseModifyCode = function() {
  function clearPreviousPlayerSelections() {
    // Clears out player selections from the previous round.
  }

  function addPlayerWinCount() {
    // Increases wins count in playerObject by 1.
  }

  function addPlayerLossCount() {
    // Increases losses count in playerObject by 1.
  }

  function addNewPlayerAlias(newAlias) {
    // Updates player object with new alias.
  }

  function addUsersSelection(selection) {
    // Updates player object with new selection (paper, scissors or rock).
  }

  function startDatabaseTurnTimer() {
    // Starts the timer in the database.
  }

  return {
    clearSelections: clearPreviousPlayerSelections,
    win: addPlayerWinCount,
    lose: addPlayerLossCount,
    alias: addNewPlayerAlias,
    selection: addUsersSelection,
    startTimer: startDatabaseTurnTimer
  };
}

let databaseModify = databaseModifyCode();

game.start("Opponent");