import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4dgXXg-GO7M0w1gPI7xXF4JlsmcGJBT0",
  authDomain: "beamsmart-7b041.firebaseapp.com",
  databaseURL: "https://beamsmart-7b041-default-rtdb.firebaseio.com",
  projectId: "beamsmart-7b041",
  storageBucket: "beamsmart-7b041.firebasestorage.app",
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
const commandButtons = {
  forward: document.getElementById("forward"),
  backward: document.getElementById("backward"),
  right: document.getElementById("right"),
  left: document.getElementById("left"),
  stop: document.getElementById("stop"),
};

// Firebase references
const lightStateRef = ref(db, "car/lightState");
const obstacleDistanceRef = ref(db, "car/obstacleDistance");
const commandRef = ref(db, "car/command");

// Update UI based on Firebase values
onValue(lightStateRef, (snapshot) => {
  const value = snapshot.val();
  lightStateElement.textContent = value || "Unknown";
});

onValue(obstacleDistanceRef, (snapshot) => {
  const value = snapshot.val();
  obstacleDistanceElement.textContent = value || "Unknown";
});

// Toggle Light State
toggleLightButton.addEventListener("touchstart", async () => {
  const currentStateSnapshot = await get(lightStateRef);
  const currentState = currentStateSnapshot.val();
  const newState = currentState === "Normal Beam" ? "Low Beam" : "Normal Beam";
  set(lightStateRef, newState);
});

// Handle command buttons with touchstart and touchend
Object.keys(commandButtons).forEach((key) => {
  const button = commandButtons[key];
  button.addEventListener("touchstart", () => {
    set(commandRef, key.toUpperCase());
  });
  button.addEventListener("touchend", () => {
    set(commandRef, "STOP");
  });
});
