// USER INTERFACE CODE

let userScreenCode = function() {
  function welcomeScreen() {
    // Displays welcome screen.
    // Prompts player to enter alias.
    $("#alias-select-screen").css("display", "block");

    // Instructions?
    $("#instructions-screen").css("display", "block");
    userScreen.update();
  }

  function awaitingOpponentScreen() {
    // Hides welcome screen.
    $("#alias-select-screen").css("display", "none");
    $("#instructions-screen").css("display", "none");

    // Displays waiting screen.
    $("#waiting-for-opponent-screen").css("display", "block");
  }

  function chooseYourMoveScreen() {
    // Hides waiting screen.
    $("#waiting-for-opponent-screen").css("display", "none");
    $("#outcome-screen").css("display", "none");

    // Displays player choice screen.
    $("#opponent-found-screen").css("display", "none");
    $("#player-choice-screen").css("display", "block");
    userScreen.update();
  }

  function awaitingOpponentMoveScreen(userChoice) {
    // Displays awaiting opponent choice screen.
    $("#player-choice-screen").css("display", "none");
    $("#waiting-for-opponent-choice-screen").css("display", "block");
  }

  function youWinScreen() {
    // Hides all other screens.
    $("#player-choice-screen").css("display", "none");
    $("#waiting-for-opponent-choice-screen").css("display", "none");
    $("#opponent-chose-first-screen").css("display", "none");

    // Displays player win screen.
    $("#outcome-screen").css("display", "block");
    $("#player-choice").html("Your choice: " + userObject.currentSelection);
    $("#opponent-choice").html(
      "Your opponent's choice: " + opponentObject.currentSelection
    );
    $("#final-outcome").html("You win!");
  }

  function youLoseScreen() {
    // Hides all other screens.
    $("#player-choice-screen").css("display", "none");
    $("#waiting-for-opponent-choice-screen").css("display", "none");
    $("#opponent-chose-first-screen").css("display", "none");

    // Displays player lose screen.
    $("#outcome-screen").css("display", "block");
    $("#player-choice").html("Your choice: " + userObject.currentSelection);
    $("#opponent-choice").html(
      "Your opponent's choice: " + opponentObject.currentSelection
    );
    $("#final-outcome").html("You lose :(");
  }

  function youTiedScreen() {
    // Hides all other screens.
    $("#player-choice-screen").css("display", "none");
    $("#waiting-for-opponent-choice-screen").css("display", "none");
    $("#opponent-chose-first-screen").css("display", "none");

    // Displays tie screen.
    $("#outcome-screen").css("display", "block");
    $("#player-choice").html("Your choice: " + userObject.currentSelection);
    $("#opponent-choice").html(
      "Your opponent's choice: " + opponentObject.currentSelection
    );
    $("#final-outcome").html("It's a tie!");
  }

  function updateUserDetailsWindow() {
    // Show player alias, wins and losses in corner.
    $("#wins").html("Wins: " + userObject.wins);
    $("#losses").html("Losses: " + userObject.losses);
    $("#rounds").html("Rounds: " + userObject.round);
  }

  return {
    welcome: welcomeScreen,
    awaitingOpponent: awaitingOpponentScreen,
    choose: chooseYourMoveScreen,
    awaitingOpponentChoice: awaitingOpponentMoveScreen,
    win: youWinScreen,
    lose: youLoseScreen,
    tied: youTiedScreen,
    update: updateUserDetailsWindow
  };
};

let userScreen = userScreenCode();

// User input functions.
let userInputCode = function() {
  function userMoveSelected(selection) {
    // Selection either paper, scissors or rock.
    // Call game.selection function.
    game.selection(selection);
  }

  return {
    select: userMoveSelected
  };
};

let userInput = userInputCode();
