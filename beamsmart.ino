#include <WiFi.h>
#include <FirebaseESP32.h>

// Wi-Fi credentials
const char* WIFI_SSID = "---";
const char* WIFI_PASSWORD = "---";

// Firebase settings
#define FIREBASE_HOST "---" 
const char* FIREBASE_API_KEY = "---";

// Firebase objects
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;
FirebaseData firebaseData;

// GPIO Pins
#define MOTOR_LEFT_FORWARD 25
#define MOTOR_LEFT_BACKWARD 26
#define MOTOR_RIGHT_FORWARD 27
#define MOTOR_RIGHT_BACKWARD 32
#define LED_HIGH_PIN 33   
#define LED_LOW_PIN 12    
#define LDR_PIN 34      
#define TRIG_PIN 13    
#define ECHO_PIN 14   

// Thresholds and Settings
const int LDR_THRESHOLD = 100;       
const int OBSTACLE_DISTANCE = 50;   

// Global Variables
String motorCommand = "STOP";      
bool isHighBeam = true;          

void setup() {
  Serial.begin(115200);

  // Initialize Wi-Fi
  connectToWiFi();

  // Configure Firebase
  setupFirebase();

  // Initialize GPIO pins
  initializePins();

  // Set initial beam state to HIGH
  setBeamState(true);
}

void loop() {
  // Read sensor values
  int ldrValue = analogRead(LDR_PIN);
  long distance = measureDistance();

  // Fetch motor command from Firebase
  fetchMotorCommand();

  // Manage beam state based on conditions
  manageBeamState(ldrValue, distance);

  // Update Firebase with sensor data
  updateFirebaseData(ldrValue, distance);
}

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void setupFirebase() {
  firebaseConfig.host = FIREBASE_HOST;
  firebaseConfig.api_key = FIREBASE_API_KEY;
  firebaseAuth.user.email = "sharmaabhi10101010@gmail.com";
  firebaseAuth.user.password = "admin123@";

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
}

void initializePins() {
  pinMode(MOTOR_LEFT_FORWARD, OUTPUT);
  pinMode(MOTOR_LEFT_BACKWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_FORWARD, OUTPUT);
  pinMode(MOTOR_RIGHT_BACKWARD, OUTPUT);
  pinMode(LED_HIGH_PIN, OUTPUT);
  pinMode(LED_LOW_PIN, OUTPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void setBeamState(bool highBeam) {
  if (highBeam) {
    digitalWrite(LED_HIGH_PIN, HIGH); 
    digitalWrite(LED_LOW_PIN, LOW);  
    isHighBeam = true;
  } else {
    digitalWrite(LED_HIGH_PIN, LOW); 
    digitalWrite(LED_LOW_PIN, HIGH); 
    isHighBeam = false;
  }
}

long measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  return (duration * 0.0343) / 2; 
}

void fetchMotorCommand() {
  if (Firebase.getString(firebaseData, "/car/command")) {
    motorCommand = firebaseData.stringData();
    executeMotorCommand();
  } else {
    Serial.println("Error fetching command: " + firebaseData.errorReason());
  }
}

void manageBeamState(int ldrValue, long distance) {
  bool brightLight = ldrValue <= LDR_THRESHOLD;
  bool lowLight = ldrValue >= LDR_THRESHOLD;
  bool obstacleDetected = distance > 0 && distance <= OBSTACLE_DISTANCE;

  if ((brightLight || obstacleDetected) && isHighBeam) {
    Serial.println("Ambient Light or Obstacle Detected. Switching to LOW beam.");
    Firebase.setString(firebaseData, "/car/lightState", "Low Beam");
    setBeamState(false);
  } else if ((lowLight && distance > OBSTACLE_DISTANCE) && !isHighBeam) {
    Serial.println("Clear conditions. Switching back to HIGH beam.");
    Firebase.setString(firebaseData, "/car/lightState", "High Beam");
    setBeamState(true);
  }
}

void updateFirebaseData(int ldrValue, long distance) {
    if (!Firebase.setInt(firebaseData, "/car/obstacleDistance", distance)) {
        Serial.println("Failed to update obstacle distance: " + firebaseData.errorReason());
    }
    String lightState = isHighBeam ? "High Beam" : "Low Beam";
    if (!Firebase.setString(firebaseData, "/car/lightState", lightState)) {
        Serial.println("Failed to update light state: " + firebaseData.errorReason());
    }
}


void executeMotorCommand() {
  if (motorCommand == "FORWARD") {
    moveForward();
  } else if (motorCommand == "BACKWARD") {
    moveBackward();
  } else if (motorCommand == "LEFT") {
    turnLeft();
  } else if (motorCommand == "RIGHT") {
    turnRight();
  } else {
    stopMotors();
  }
}

void moveForward() {
  Serial.println("Moving FORWARD");
  digitalWrite(MOTOR_LEFT_FORWARD, HIGH);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
}

void moveBackward() {
  Serial.println("Moving BACKWARD");
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, HIGH);
}

void turnLeft() {
  Serial.println("Turning LEFT");
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_FORWARD, HIGH);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
}

void turnRight() {
  Serial.println("Turning RIGHT");
  digitalWrite(MOTOR_LEFT_FORWARD, HIGH);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, HIGH);
}

void stopMotors() {
  Serial.println("Stopping Motors");
  digitalWrite(MOTOR_LEFT_FORWARD, LOW);
  digitalWrite(MOTOR_LEFT_BACKWARD, LOW);
  digitalWrite(MOTOR_RIGHT_FORWARD, LOW);
  digitalWrite(MOTOR_RIGHT_BACKWARD, LOW);
}
