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

var database = firebase.database().ref();