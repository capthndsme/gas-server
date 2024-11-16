import Sensor from "#models/sensor";
import { SensorData } from "../types/SensorData.js";

class DataService {

  data: SensorData = {
    timestamp: 0,
    humanDetected: false,
    pressure: 0,
    gas1: 0,
    gas2: 0
  };

  pressureLastTrigger: number | null = null;
  gas1LastTrigger: number | null = null;
  gas2LastTrigger: number | null = null;

  async report(localData: SensorData) {
    this.data = localData
    console.log(localData)
    try {
      await Sensor.create({
        humanDetected: localData.humanDetected,
        pressure: localData.pressure,
        gas1: localData.gas1,
        gas2: localData.gas2
      })
    } catch (e) {
      console.log("error save data", e)
    }
    return this.data;
  }

  async get() {
    return this.data;
  }

  async history() {
    return await Sensor.query()
    .orderBy('created_at', 'desc')
    .limit(20)
  }

  async getLastDetect() {
    return await Sensor.query()
    .where('human_detected', true)
    .orderBy('created_at', 'desc')
    .limit(1)
    .first()
  }
}

export default new DataService()
