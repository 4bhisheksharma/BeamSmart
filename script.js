// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4dgXXg-GO7M0w1gPI7xXF4JlsmcGJBT0",
  authDomain: "beamsmart-7b041.firebaseapp.com",
  databaseURL: "https://beamsmart-7b041-default-rtdb.firebaseio.com",
  projectId: "beamsmart-7b041",
  storageBucket: "beamsmart-7b041.appspot.com",
  messagingSenderId: "591934946040",
  appId: "1:591934946040:web:dac2f85aa2fd3d3fee190d",
  measurementId: "G-28LQCHPEER"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const lightStateElement = document.getElementById("lightState");
const obstacleDistanceElement = document.getElementById("obstacleDistance");
const toggleLightButton = document.getElementById("toggleLight");

// Realtime Database References
const lightStateRef = db.ref("car/lightState");
const obstacleDistanceRef = db.ref("car/obstacleDistance");
const commandRef = db.ref("car/command");

// Listen for updates
lightStateRef.on("value", (snapshot) => {
  lightStateElement.textContent = snapshot.val();
});

obstacleDistanceRef.on("value", (snapshot) => {
  obstacleDistanceElement.textContent = snapshot.val();
});

// Toggle Light State
toggleLightButton.addEventListener("click", async () => {
  lightStateRef.once("value", (snapshot) => {
    const currentState = snapshot.val();
    const newState = currentState === "Normal Beam" ? "Low Beam" : "Normal Beam";
    lightStateRef.set(newState);
  });
});

// Send car movement commands
function sendCommand(command) {
  commandRef.set(command);
}
