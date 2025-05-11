//Generates temperatures based in the setpoint of the sensor
const API_BASE_URL = "https://api.proyectojonafernandez.com.es";
export const API_URLS = {
  GET_ALL_SENSORS: `${API_BASE_URL}/sensors/all`,
  ADD_RECORDS: `${API_BASE_URL}/records/add`,
};

function getRandomTemperature(max, temperature) {
  const a = Math.random();
  const increaseOrDecrease = a < 0.5 ? -1 : 1;
  return parseFloat(
    (temperature + Math.random() * max * increaseOrDecrease).toFixed(1)
  );
}

//Get sensors from the database
const fetchSensors = async () => {
  try {
    const response = await fetch(API_URLS.GET_ALL_SENSORS);
    if (!response.ok) throw new Error("Error obteniendo sensores");
    const sensors = await response.json();
    return sensors;
  } catch (error) {
    console.error("Error loading sensors", error);
    return [];
  }
};

//Fuction to format data
const formatDate = (date) => {
  return date.split(".")[0] + "+00:00";
};

//Generates the data for each sensor
const generateSensorData = (sensors) => {
  return sensors.map((sensor) => ({
    address: sensor.address,
    temperature: getRandomTemperature(2, sensor.setpoint),
    date: formatDate(new Date().toISOString()),
  }));
};

const sendDataToBackend = async (data) => {
  try {
    const response = await fetch(API_URLS.ADD_RECORDS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error sending data");
    console.log("Datos enviados correctamente.");
  } catch (error) {
    console.error("Error: ", error);
  }
};

const startSimulator = async () => {
  setInterval(async () => {
    const sensors = await fetchSensors();
    const newData = generateSensorData(sensors);
    sendDataToBackend(newData);
  }, 300000);
};

startSimulator();
