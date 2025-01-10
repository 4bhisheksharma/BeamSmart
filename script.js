// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4dgXXg-GO7M0w1gPI7xXF4JlsmcGJBT0",
  authDomain: "beamsmart-7b041.firebaseapp.com",
  databaseURL: "https://beamsmart-7b041-default-rtdb.firebaseio.com",
  projectId: "beamsmart-7b041",
  storageBucket: "beamsmart-7b041.appspot.com",
  messagingSenderId: "591934946040",
  appId: "1:591934946040:web:dac2f85aa2fd3d3fee190d",
  measurementId: "G-28LQCHPEER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const lightStateElement = document.getElementById("lightState");
const obstacleDistanceElement = document.getElementById("obstacleDistance");
const toggleLightButton = document.getElementById("toggleLight");

// Realtime Database References
const lightStateRef = ref(db, "car/lightState");
const obstacleDistanceRef = ref(db, "car/obstacleDistance");
const commandRef = ref(db, "car/command");

// Listen for updates
onValue(lightStateRef, (snapshot) => {
  lightStateElement.textContent = snapshot.val();
});

onValue(obstacleDistanceRef, (snapshot) => {
  obstacleDistanceElement.textContent = snapshot.val();
});

// Toggle Light State
toggleLightButton.addEventListener("click", async () => {
  const snapshot = await get(lightStateRef);
  const currentState = snapshot.val();
  const newState = currentState === "Normal Beam" ? "Low Beam" : "Normal Beam";
  set(lightStateRef, newState);
});

// Send car movement commands
function sendCommand(command) {
  set(commandRef, command);
}
