// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRwwCfKBRd9jyqqFgtr1Z-udQ-Fs-B_o8",
    authDomain: "rps-game-5a16a.firebaseapp.com",
    databaseURL: "https://rps-game-5a16a.firebaseio.com",
    projectId: "rps-game-5a16a",
    storageBucket: "rps-game-5a16a.appspot.com",
    messagingSenderId: "955540312266"
};

firebase.initializeApp(config);

//setting my initial firbase directory as a var
const database = firebase.database();
$(document).ready(function() {
    //clear firebase
    database.ref().remove();

    //establish global vars
    var playerWins = 0;
    var playerLosses = 0;
    var opponentWins = 0;
    var opponentLosses = 0;
    var ties = 0;
    var playerChoice;
    var opponentChoice;
    var playerName = "";
    var player1 = false;
    var player2 = false;
    var playerDir = "";
    var opponentDir = "";
    var chat = "";
    var checked = false;

    //object for game
    var rpsGame = {
        //hiding the html until players log in
        hide: $(".player1Info, .player2Info, #tieInfo").hide(),
        getPlayerName: $("#submitName").on('click', function() {
            event.preventDefault();
            var text = $(":text").val().trim();
            playerName = text;
            rpsGame.establishPlayers();
            $("#createPlayer").hide();
        }),
        //gets players name and if they are 1 or 2 and adds data to firebase
        establishPlayers: function() {
            database.ref().once('value', function(snapshot) {
                //checks to see if there is already a player 1, if not then make a player one
                if (!snapshot.child('players/one').exists()) {
                    database.ref().update({
                        players: {
                            one: {
                                name: playerName,
                                wins: playerWins,
                                losses: playerLosses,
                            }
                        }
                    })
                    $("#welcome").html("Welcome " + playerName + ", you are player 1.")
                    player1 = true;
                    playerDir = database.ref('players/one/');
                    opponentDir = database.ref('players/two/');
                    //sets the log off message when player disconnects
                    database.ref('players/chat').onDisconnect().set({
                            logoff: {
                                message: "has logged off.",
                                player: playerName
                            }
                        })
                        //removes players data from firebase
                    database.ref('players/one').onDisconnect().remove();
                } else {
                    //creates player 2 if player 1 is already logged in
                    database.ref('players/').update({
                        two: {
                            name: playerName,
                            wins: playerWins,
                            losses: playerLosses,
                        }

                    })
                    $("#welcome").text("Welcome " + playerName + ", you are player 2.")
                    player2 = true;
                    playerDir = database.ref('players/two/');
                    opponentDir = database.ref('players/one/');
                    //sets log off message
                    database.ref('players/chat').onDisconnect().set({
                        logoff: {
                            message: "has logged off.",
                            player: playerName
                        }
                    })
                    database.ref('players/two').onDisconnect().remove();


                }
            });
        },
        //now show the html of the player data
        showInfo: database.ref('players').on('value', function(snapshot) {
            if (snapshot.hasChild('one')) {
                $(".player1Info").show();
                $(".player1").html(snapshot.child('one').child('name').val());
            }
            if (snapshot.hasChild('two')) {
                $(".player2Info").show();
                $(".player2").html(snapshot.child('two').child('name').val());
            }
            if (snapshot.hasChild('ties')) {
                $("#tieInfo").show();
            }
        }),

        //log player choice in firebase
        getPlayersChoice: $(".button").on("click", function() {
            event.preventDefault();
            playerChoice = $(this).html();
            if (player1) {
                database.ref("/players/one").update({
                    choice: playerChoice
                });
            } else if (player2) {
                database.ref("/players/two").update({
                    choice: playerChoice
                });
            }
            // rpsGame.getOpponentChoice();
            rpsGame.checkBothPlayersAreReady();
        }),
        //constently look for opponent's choice
        getOpponentChoice: database.ref('players/').on('value', function(snapshot) {
            if (player1) {
                opponentChoice = snapshot.child('two').child('choice').val();

            } else {
                opponentChoice = snapshot.child('one').child('choice').val();

            }
        }),
        //checks to see if both players have chosen then runs the check to see who wins
        checkBothPlayersAreReady: function() {

            if (typeof(playerChoice) === "string" && typeof(opponentChoice) === "string") {
                rpsGame.rpsCheck();

            }

        },
        // displays wins, and ties
        setscore: database.ref('players/').on('value', function(snapshot) {
            $("#player1Wins").text(snapshot.child('one').child('wins').val());
            $("#player2Wins").text(snapshot.child('two').child('wins').val());
            $("#ties").text(snapshot.child('ties').val());
            $("#player1Choice").text(snapshot.child('one').child('choice').val());
            $("#player2Choice").text(snapshot.child('two').child('choice').val());

        }),
        //checks to see who wone
        rpsCheck: function() {
            if ((playerChoice === "rock") && (opponentChoice === "scissors")) {
                playerWins++;
                opponentLosses++;
                playerDir.update({
                    wins: playerWins
                });
                opponentDir.update({
                    losses: opponentLosses
                });
                rpsGame.clear();

            } else if ((playerChoice === "rock") && (opponentChoice === "paper")) {
                playerLosses++;
                opponentWins++;
                playerDir.update({
                    losses: playerLosses
                });
                opponentDir.update({
                    wins: opponentWins
                });
                rpsGame.clear();

            } else if ((playerChoice === "scissors") && (opponentChoice === "rock")) {
                playerLosses++;
                opponentWins++;
                playerDir.update({
                    losses: playerLosses
                });
                opponentDir.update({
                    wins: opponentWins
                });
                rpsGame.clear();

            } else if ((playerChoice === "scissors") && (opponentChoice === "paper")) {
                playerWins++;
                opponentLosses++;
                playerDir.update({
                    wins: playerWins
                });
                opponentDir.update({
                    losses: opponentLosses
                });
                rpsGame.clear();

            } else if ((playerChoice === "paper") && (opponentChoice === "rock")) {
                playerWins++;
                opponentLosses++;
                playerDir.update({
                    wins: playerWins
                });
                opponentDir.update({
                    losses: opponentLosses
                });
                rpsGame.clear();

            } else if ((playerChoice === "paper") && (opponentChoice === "scissors")) {
                playerLosses++;
                opponentWins++;
                playerDir.update({
                    losses: playerLosses
                });
                opponentDir.update({
                    wins: opponentWins
                });
                rpsGame.clear();
            } else if (playerChoice === opponentChoice) {
                ties++;
                database.ref('players/').update({
                    ties: ties
                });
                rpsGame.clear();
            };
            // database.ref('players/one/choice').remove();
            // database.ref('players/two/choice').remove();
        },
        //a clear function to clear out player choice in firebase after a winner is chosen
        clear: function() {
            var playerOneTimer = database.ref('players/one/choice').remove()
            var playerTwoTimer = database.ref('players/two/choice').remove()
            setTimeout(playerOneTimer, 1000 * 10);
            setTimeout(playerTwoTimer, 1000 * 10);
        },

        //stores chat message to firebase
        chat: $("#submitChat").on('click', function() {
            event.preventDefault();
            var chatMessage = $("#chatMessage").val().trim();
            chat = chatMessage;
            database.ref('players/chat/').push({
                message: chatMessage,
                player: playerName
            });
        }),
        //adds chat messages to chat div
        chatMessageBox: database.ref('players/chat/').on('child_added', function(childSnapshot) {
            var text = childSnapshot.val().player + ": " + childSnapshot.val().message;
            var messageText = $("<h4>").text(text);
            $("#chatBox").append(messageText);
        }),

    };
})