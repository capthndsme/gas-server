import Sensor from "#models/sensor";
 
import { SensorData } from "../types/SensorData.js";

class DataService {
  private lastWriteTime: number = 0; // Tracks the last write timestamp
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
    this.data = localData;
    console.log(localData);

    const now = Date.now();
    const throttleInterval = 6 * 1000; // 6s THROTTLE

    // Check if the last write happened within the throttle interval
    if (now - this.lastWriteTime < throttleInterval) {
      console.log("Throttled: Write skipped");
      return this.data;
    }

    try {
      await Sensor.create({
        humanDetected: localData.humanDetected,
        pressure: localData.pressure,
        gas1: localData.gas1,
        gas2: localData.gas2,
      });
      this.lastWriteTime = now; // Update the last write time
      console.log("Data saved");
    } catch (e) {
      console.log("Error saving data", e);
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
