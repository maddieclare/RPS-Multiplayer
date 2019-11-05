// Actual game code.
let userAlias = "";
let opponentAlias = "";
let wins = 0;
let losses = 0;
let userUniqueId = "";
let opponentReady = false;
let currentRound = 0

let userObject = {
  id: "",
  opponentId: "",
  wins: 0,
  losses: 0,
  alias: "",
  currentSelection: "",
  round:0
};

let opponentObject = {
  id: "",
  wins: 0,
  losses: 0,
  alias: "",
  currentSelection: "",
  round:0
};

let gameCode = function() {
  function initialiseTheGame() {
    databaseModify.create().then(() => {
      databaseModify.userListen();
      userScreen.welcome();
    });
  }

  function setUserAlias(newAlias) {
    // Lets player set their alias.
    // Stores player alias.
    userObject.alias = newAlias;
    console.log(newAlias);
    databaseModify.update().then(() => {
      userScreen.update();
      console.log("ready to search");
      userScreen.awaitingOpponent();
      if (!userObject.opponentId) {
        databaseModify.search();
      } else {
        databaseModify.opponentListen();
        console.log("Game is ready to start");
        startTheGame();
      }
    });
  }

  function processUserObjectChange() {
    console.log("Processing user object change");
    console.log(userObject);
  }

  function opponentFound(opponentProfile, opponentRef) {
    opponentObject = opponentProfile;
    opponentObject.opponentId = userUniqueId;
    userObject.opponentId = opponentRef;
    if (opponentProfile.alias) {
      opponentReady = true;
    }
    databaseModify.lockInOpponent(opponentProfile, opponentRef);
    databaseModify.opponentListen();
    databaseModify.update().then(function() {
      userScreen.update();
      startTheGame();
    });
  }

  function processOpponentObjectChange() {
    console.log("Processing opponent object change");
    console.log(opponentObject);
    console.log("opponent ready: " + opponentReady);
    if (!opponentReady && opponentObject.alias) {
      console.log("Opponent is now ready");
      opponentReady = true;
      startTheGame();
    } else if (opponentReady && opponentObject.currentSelection && userObject.round == currentRound && opponentObject.round == currentRound) {
      console.log("Opponent Has Selected");
      processOutcome(userObject.currentSelection);
    } else {
      console.log("Some other change happened");
    }
  }

  function startTheGame() {
    if (opponentReady) {
      console.log("Starting the Game");
      startNewRound();
    } else {
      console.log("Opponent hasn't set an alias");
    }
  }

  function startNewRound() {
    console.log("New round started.");
    // Clears previous player selection.
    userObject.round = currentRound
    userObject.currentSelection = "";
    databaseModify.update();
    // Starts timer. TBC
    // Displays user selection screen.
    userScreen.choose();
  }

  function userSelectionInput(selection) {
    // Updates player selection in playerObject.
    console.log("User made selection: " + selection);
    userObject.currentSelection = selection;
    databaseModify.update().then(function() {
      console.log("checking if selected");
      if (opponentObject.currentSelection) {
        //opponent already picked
        console.log("Opponent had already picked");
        processOutcome(selection);
      } else {
        // Shows screen letting player know opponent is still selecting.
        console.log("Still waiting on opponent");
        userScreen.awaitingOpponentChoice(selection);
      }
    });
  }

  function processOutcome() {
    console.log("Processing outcome: " + userObject.currentSelection);
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
      } else {
        errorHandlingFunction({
          error: "Non-standard result",
          input: result,
          location: "eitherPlayerMakesASelection"
        });
      }
    } else {
      console.log("Still waiting");
    }
  }



  function timerRanOut(playerSelections) {
    console.log("Time's up!");
    // Else if only 1 player has made a selection, that player wins.
    if (playerSelections.user) {
      console.log("You win!");
      userWins({ playerSelections: playerSelections, source: "timer" });
      // If neither player has selected, show time up screen (both players lose a point).
    } else {
      console.log("You lose :(");
      userLoses({ playerSelections: playerSelections, source: "timer" });
    }
  }

  function determineOutcome(playerSelections) {
    // Get player/opponent selections.
    console.log("Determining Outcome");
    console.log(playerSelections);
    let userSelection = playerSelections.user;
    let opponentSelection = playerSelections.opponent;
    // If both players make the same selection, return tie result.
    if (userSelection == opponentSelection) {
      return "tie";
      // Else if:
      // Player guesses rock and opponent guesses scissors, player wins (else they lose).
    } else if (userSelection == "rock") {
      if (opponentSelection == "scissors") {
        return "win";
      } else {
        return "lose";
      }
      // Player guesses paper and opponent guesses rock, player wins (else they lose).
    } else if (userSelection == "paper") {
      if (opponentSelection == "rock") {
        return "win";
      } else {
        return "lose";
      }
      // Player guesses scissors and opponent guesses paper, player wins (else they lose).
    } else if (userSelection == "scissors") {
      if (opponentSelection == "paper") {
        return "win";
      } else {
        return "lose";
      }
      // Else return an error.
    } else {
      errorHandlingFunction({
        error: "Invalid user or opponent selections",
        input: playerSelections,
        location: "determineOutcomes"
      });
    }
  }

  function userWins() {
    // Add 1 to player win count.
    userObject.wins++
    databaseModify.update();
    // Show win screen.
    userScreen.win();
    // Call new round function after a few seconds.
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  function userLoses() {
    // Add 1 to player loss count.
    userObject.losses++
    databaseModify.update();
    // Show lose screen.
    userScreen.lose();
    // Call new round function after a few seconds
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  function userTies() {
    // Show tie screen.
    userScreen.tied();
    // Call new round function after a few seconds.
    setTimeout(function() {
      game.newRound();
    }, 2000);
  }

  function connectionLostWithOpponent() {
    // Alert player connection has dropped.
    console.log("Connection lost!");
    // Wait for new opponent.
    userScreen.awaitingOpponent();
  }

  function errorHandlingFunction(error) {
    // Log error in console.
    console.log(error);
    // Show players error screen.
    userScreen.error();
  }

  return {
    initialise: initialiseTheGame,
    newUserAlias: setUserAlias,
    userObjectChanged: processUserObjectChange,
    opponentObjectChanged: processOpponentObjectChange,
    start: startTheGame,
    newRound: startNewRound,
    userSelected: userSelectionInput,
    timeUp: timerRanOut,
    win: userWins,
    lose: userLoses,
    tie: userTies,
    opponentDropped: connectionLostWithOpponent,
    error: errorHandlingFunction,
    opponentFound: opponentFound
  };
};

let game = gameCode();

// User interface functions.
let userScreenCode = function() {
  function welcomeScreen() {
    console.log("Welcome!");
    // Displays welcome screen.
    // Prompts player to enter alias.
    $("#alias-select-screen").css("display", "block");
    // Instructions?
    $("#instructions-screen").css("display", "block");
  }

  function awaitingOpponentScreen() {
    console.log("Waiting for another player to join...");
    // Hides welcome screen.
    $("#alias-select-screen").css("display", "none");
    $("#instructions-screen").css("display", "none");
    // Displays waiting screen.
    $("#waiting-for-opponent-screen").css("display", "block");
  }

  function chooseYourMoveScreen() {
    console.log("Showing player choice screen.");
    // Displays player choice screen.
  }

  function awaitingOpponentMoveScreen(userChoice) {
    console.log("Waiting for opponent selection. Your pick: " + userChoice);
    // Displays awaiting opponent choice screen.
  }

  function showThatOtherPlayerHasSelected() {
    console.log("Your opponent has already chosen. Better hurry!");
    // Displays hurry up screen.
  }

  function youWinScreen() {
    console.log("Showing player win screen.");
    // Displays player win screen.
  }

  function youLoseScreen() {
    console.log("Showing player lose screen.");
    // Displays player lose screen.
  }

  function youTiedScreen() {
    console.log("Showing tie screen.");
    // Displays tie screen.
  }

  function updateUserDetailsWindow() {
    console.log("User info updated.");
    // Show player alias, wins and losses in corner.
  }

  function showErrorScreen() {
    console.log("This will eventually be an error screen.");
    // Alerts player that there is an error (asks them to refresh browser?).
  }

  return {
    welcome: welcomeScreen,
    awaitingOpponent: awaitingOpponentScreen,
    choose: chooseYourMoveScreen,
    awaitingOpponentChoice: awaitingOpponentMoveScreen,
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
  function userMoveSelected(selection) {
    // Selection either paper, scissors or rock.
    console.log("Your selection: " + selection);
    // Call game.selection function.
    game.selection(selection);
  }

  function submitNewUserAlias(newAlias) {
    // Update playerObject with player alias.
    console.log("Your new alias is: " + newAlias);
  }

  return {
    select: userMoveSelected,
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

// Initialise database.
const firebaseConfig = {
  apiKey: "AIzaSyCeDbX4zYNhZZYgbM1trIFWMJleZBetyDE",
  authDomain: "maddie-test-aee71.firebaseapp.com",
  databaseURL: "https://maddie-test-aee71.firebaseio.com",
  projectId: "maddie-test-aee71",
  storageBucket: "maddie-test-aee71.appspot.com",
  messagingSenderId: "396098819277",
  appId: "1:396098819277:web:c67c1624d8211a35860584"
};

let playerObjectStructure = {
  id: "",
  opponentId: "",
  wins: 0,
  losses: 0,
  alias: "",
  currentSelection: "",
  round:0
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

//To Be Deleted
function testButtonClick() {
  console.log("Test button working");
  game.userSelected("rock");
}

let databaseModifyCode = function() {
  function createUserInDatabaseAndGetUniqueId() {
    return database
      .ref("Players")
      .push(playerObjectStructure)
      .then(function(newEntry) {
        return (userUniqueId = newEntry.key);
      });
  }

  function startListeningToPlayerObject() {
    console.log("Creating listener: " + userUniqueId);
    let userProfileChange = firebase.database().ref("Players/" + userUniqueId);
    userProfileChange.on("value", function(snapshot) {
      console.log("Change on the users profile in the database");
      console.log(snapshot.val());
      userObject = snapshot.val();
      game.userObjectChanged();
    });
  }

  function updateDatabase() {
    console.log("Setting:");
    console.log(userUniqueId);
    console.log("To:");
    console.log(userObject);
    return firebase
      .database()
      .ref("Players/" + userUniqueId)
      .update(userObject);
  }

  function listenForNewPlayer() {
    console.log("Starting to search for new player");
    let databaseChange = database.ref("Players").orderByKey();
    databaseChange.on("value", function(snapshot) {
      console.log("Overall Database Listener detected a change:");
      console.log(snapshot.val());
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.key !== userUniqueId) {
          let otherPlayerData = childSnapshot.val();
          if (otherPlayerData.opponentId == "") {
            console.log(
              "Found player without an opponent: " +
                otherPlayerData.alias +
                ". Waiting for registration."
            );
            console.log(otherPlayerData);
            databaseChange.off();
            game.opponentFound(otherPlayerData, childSnapshot.key);
            return true;
          }
        }
      });
    });
  }

  function setOpponentIdAttributeToUserId(opponentProfile, opponentKey) {
    console.log("Updating opponent:");
    console.log(opponentKey);
    firebase
      .database()
      .ref("Players/" + opponentKey)
      .set(opponentProfile);
  }

  function startListeningToOpponent() {
    console.log("Creating listener: " + userObject.opponentId);
    let opponentProfileChange = firebase
      .database()
      .ref("Players/" + userObject.opponentId);
    opponentProfileChange.on("value", function(snapshot) {
      console.log("Change on the opponents profile in the database");
      console.log(snapshot.val());
      opponentObject = snapshot.val();
      game.opponentObjectChanged();
    });
  }

  return {
    update: updateDatabase,
    create: createUserInDatabaseAndGetUniqueId,
    userListen: startListeningToPlayerObject,
    search: listenForNewPlayer,
    lockInOpponent: setOpponentIdAttributeToUserId,
    opponentListen: startListeningToOpponent
  };
};

let databaseModify = databaseModifyCode();

game.initialise();

// TO Do List
//replace all DatabaseModify references in the game IIFE with a chage to the userObject and then databaseModify.update()
//add "opponentID" attribute to the user object
//create a function which is called by the database change event listener which processes the database change - i.e. was the change the opponent selecting something
//create a function which searches the player database for a player without an opponent and then adds them to the userObject.oppnent
//create a function which after the opponent has been found adds an event listener for changes to the opponents info in the database
