#include <Arduino.h>
#include <Wire.h>
#include <DHT.h>
#include <BH1750.h>

// Configuracion del sensor DHT22 (Temperatura y Humedad )
#define DHTPIN 15     
#define DHTTYPE DHT22 

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
  
  // Arrancamos el sensor DHT22
  dht.begin();

  // Arrancamos el busI2C (Pines 21 y 22 en el ESP32)
  Wire.begin(21, 22);

  // Arrancamos el sensor BH1750
  lightMeter.begin();
}

// ---- Loop principal ----
void loop() {
  // Pausa de 10 segundos entre lecturas
  delay(10000);

  // Leemos la humedad y la temperatura
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  // Comprobamos si hubo algún error en la lectura
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("¡Error: No se pudo leer el sensor DHT22!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }

  // Leemos el nivel de luz
  float lightLevel = lightMeter.readLightLevel();

  // Comprobamos si hubo algún error en la lectura
  if(lightLevel < 0) {
    Serial.println("¡Error: No se pudo leer el sensor BH1750!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }

  /*
  // Imprimimos los valores de la humedad y la temperatura
  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.print("%  |  Temperatura: ");
  Serial.print(temperatura);
  Serial.println("°C");*/

  // Imprimimos el nivel de luz
  Serial.print("Nivel de luz: ");
  Serial.print(lightLevel);
  Serial.println(" lx");
}