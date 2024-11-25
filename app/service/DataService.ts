import Sensor from "#models/sensor";

import { SensorData } from "../types/SensorData.js";
import PushNotificationService from "./PushNotificationService.js";

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
    const throttleInterval = 10 * 1000; // 10 seconds

    // Push service hook
    await PushNotificationService.shouldNotify(localData.gas1, "Gas (MQ-2)")
    await PushNotificationService.shouldNotify(localData.gas2, "Gas (MQ-135)")
    await PushNotificationService.shouldNotify(localData.pressure, "Pressure")




    // Always write immediately if humanDetected is true
    if (localData.humanDetected) {
      console.log("Immediate write due to humanDetected");
      await this.writeToDatabase(localData);
      return this.data;
    }

    // Otherwise, throttle writes
    if (now - this.lastWriteTime < throttleInterval) {
      console.log("Throttled: Write skipped");
      return this.data;
    }

    await this.writeToDatabase(localData);
    
    return this.data;
  }

  private async writeToDatabase(localData: SensorData) {
    try {
      await Sensor.create({
        humanDetected: localData.humanDetected,
        pressure: localData.pressure,
        gas1: localData.gas1,
        gas2: localData.gas2,
      });
      this.lastWriteTime = Date.now(); // Update the last write time
      console.log("Data saved");
    } catch (e) {
      console.log("Error saving data", e);
    }
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
