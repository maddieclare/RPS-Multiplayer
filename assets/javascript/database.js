// DATABASE CODE

// Initialises database.
const firebaseConfig = {
  apiKey: "AIzaSyCeDbX4zYNhZZYgbM1trIFWMJleZBetyDE",
  authDomain: "maddie-test-aee71.firebaseapp.com",
  databaseURL: "https://maddie-test-aee71.firebaseio.com",
  projectId: "maddie-test-aee71",
  storageBucket: "maddie-test-aee71.appspot.com",
  messagingSenderId: "396098819277",
  appId: "1:396098819277:web:c67c1624d8211a35860584"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

let databaseModifyCode = function() {
  // Creates new user object and assigns unique ID.
  function createUserInDatabaseAndGetUniqueId() {
    return database
      .ref("Players")
      .push(userObject)
      .then(function(newEntry) {
        return (userUniqueId = newEntry.key);
      });
  }

  // User object event listener function.
  function startListeningToPlayerObject() {
    let userProfileChange = firebase.database().ref("Players/" + userUniqueId);
    userProfileChange.on("value", function(snapshot) {
      userObject = snapshot.val();
    });
  }

  // Updates user object.
  function updateDatabase() {
    return firebase
      .database()
      .ref("Players/" + userUniqueId)
      .update(userObject);
  }

  // Event listener to check whether another player has loaded game.
  function listenForNewPlayer() {
    let databaseChange = database.ref("Players").orderByKey();
    databaseChange.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.key !== userUniqueId) {
          let otherPlayerData = childSnapshot.val();
          if (otherPlayerData.opponentId == "") {
            databaseChange.off();
            game.opponentFound(otherPlayerData, childSnapshot.key);
            return true;
          }
        }
      });
    });
  }

  // Assigns opponent ID to user object.
  function setOpponentIdAttributeToUserId(opponentProfile, opponentKey) {
    firebase
      .database()
      .ref("Players/" + opponentKey)
      .set(opponentProfile);
  }

  // Opponent object event listener.
  function startListeningToOpponent() {
    let opponentProfileChange = firebase
      .database()
      .ref("Players/" + userObject.opponentId);
    opponentProfileChange.on("value", function(snapshot) {
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
