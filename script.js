import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4dgXXg-GO7M0w1gPI7xXF4JlsmcGJBT0",
  authDomain: "beamsmart-7b041.firebaseapp.com",
  databaseURL: "https://beamsmart-7b041-default-rtdb.firebaseio.com",
  projectId: "beamsmart-7b041",
  storageBucket: "beamsmart-7b041.firebasestorage.app",
  messagingSenderId: "591934946040",
  appId: "1:591934946040:web:dac2f85aa2fd3d3fee190d",
  measurementId: "G-28LQCHPEER"
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
  const value = snapshot.val();
  lightStateElement.textContent = value || "Unknown";
});

onValue(obstacleDistanceRef, (snapshot) => {
  const value = snapshot.val();
  obstacleDistanceElement.textContent = value || "Unknown";
});

// Toggle Light State
toggleLightButton.addEventListener("click", async () => {
  const currentStateSnapshot = await get(lightStateRef);
  const currentState = currentStateSnapshot.val();
  const newState = currentState === "Normal Beam" ? "Low Beam" : "Normal Beam";
  set(lightStateRef, newState);
});

// Send car movement commands
window.sendCommand = function (command) {
  set(commandRef, command);
};
