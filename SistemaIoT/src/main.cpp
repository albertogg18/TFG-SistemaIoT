#include <Arduino.h>
#include <DHT.h>

// Definimos el pin al que conectamos el sensor (según nuestro JSON)
#define DHTPIN 15     
// Definimos el tipo de sensor
#define DHTTYPE DHT22 

// Inicializamos el objeto del sensor
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Iniciamos la consola serie a 115200 baudios
  Serial.begin(115200);
  
  // Pequeña pausa para que la consola arranque limpia
  delay(1000);
  Serial.println("--- Iniciando lectura del DHT22 ---");
  
  // Arrancamos el sensor
  dht.begin();
}

void loop() {
  // El DHT22 es un sensor lento, necesita al menos 2 segundos entre lecturas
  delay(2000);

  // Leemos la humedad y la temperatura
  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  // Comprobamos si hubo algún error en la lectura (isnan = Is Not a Number)
  if (isnan(humedad) || isnan(temperatura)) {
    Serial.println("¡Error: No se pudo leer el sensor DHT22!");
    return; // Volvemos al inicio del loop para intentar de nuevo
  }

  // Imprimimos los valores por la consola
  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.print("%  |  Temperatura: ");
  Serial.print(temperatura);
  Serial.println("°C");
}