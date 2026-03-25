#include <Arduino.h>
#include <Wire.h>
#include <DHT.h>
#include <BH1750.h>
#include <WiFi.h>

// --- Configuración Wi-Fi (Router Virtual de Wokwi) ---
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Configuracion del sensor DHT22 (Temperatura y Humedad )
#define DHTPIN 15     
#define DHTTYPE DHT22

// Definición del PIN para el sensor de humedad del suelo
#define SOIL_MOISTURE_PIN 34

// ---- Creamos el objeto de los sensores ----

// Creacion sensor de temperatura y humedad DHT22
DHT dht(DHTPIN, DHTTYPE);

// Creacion sensor de luminosidad BH1750
BH1750 lightMeter;

// ---- Inicializacion de sensores consola ----
void setup() {
  // Iniciamos la consola serie a 115200 baudios
  Serial.begin(115200);
  
  // Pequeña pausa para que la consola arranque limpia
  delay(1000);

  Serial.println("---- Sistema IoT - Lectura de Sensores ----");

  Serial.println("Conectando a Wi-Fi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado a Wi-Fi!");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  // Arrancamos el sensor DHT22
  dht.begin();

  // Arrancamos el busI2C (Pines 21 y 22 en el ESP32)
  Wire.begin(21, 22);

  // Arrancamos el sensor BH1750
  lightMeter.begin();

  // Configuramos SOIL_MOISTURE_PIN como entrada
  pinMode(SOIL_MOISTURE_PIN, INPUT);
}

// ---- Loop principal ----
void loop() {
  // Pausa de 10 segundos entre lecturas
  delay(10000);

  // ---- Lecturas de sensores ----

  // Leemos la humedad y la temperatura
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  // Leemos el nivel de luz
  float lightLevel = lightMeter.readLightLevel();

  // Leemos el nivel de humedad del suelo
  int soilMoistureValue = analogRead(SOIL_MOISTURE_PIN);

  // ---- Comprobaciones de errores ----

  // Comprobacion en el sensor DHT22
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("¡Error: No se pudo leer el sensor DHT22!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }

  // Comprobacion en el sensor BH1750
  if(lightLevel < 0) {
    Serial.println("¡Error: No se pudo leer el sensor BH1750!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }

  // Comprobacion en el sensor de humedad del suelo
  if(soilMoistureValue < 0 || soilMoistureValue > 4095) {
    Serial.println("¡Error: No se pudo leer el sensor de humedad del suelo!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }
  // Mapeamos el valor a un porcentaje (ajustar según calibración)
  int soilMoisturePercent = map(soilMoistureValue, 4095, 0, 0, 100);

  // ---- Impresion de resultados en consola ----

  /*
  // Imprimimos los valores de la humedad y la temperatura
  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.print("%  |  Temperatura: ");
  Serial.print(temperatura);
  Serial.println("°C");*/

  /*
  // Imprimimos el nivel de luz
  Serial.print("Nivel de luz: ");
  Serial.print(lightLevel);
  Serial.println(" lx");*/

  /*
  // Imprimimos el nivel de humedad del suelo
  Serial.print("Humedad del suelo: ");
  Serial.print(soilMoisturePercent);
  Serial.println("%");*/
}