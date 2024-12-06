import Token from "#models/token";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import SettingService from "./SettingService.js";



class PushNotificationService {

  readonly #fcm;
 

  constructor() {
    const service = readFileSync(join(homedir(), "gas.json"))
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(service.toString()))
    })

    this.#fcm = admin.messaging()
    
  }

  async registerToken(token: string) {
    console.log("register token", token)
    const exist = await Token.query().where('token', token).first()
    if (!exist) {
      await Token.create({
        token
      })
    }
    return true;
  }

  lastNotify: Record<string, number> = {};
  async shouldNotify(val: number, sensor: string) {
    const {highVal, midVal} = SettingService.config;
    const severity = val > highVal ? "HIGH" : "MEDIUM"

    // 12s cooldown
    if (
      Date.now() - this.lastNotify[sensor] < 12000
    ) {
      console.log("Notifier: Cooldown")
      return false;
    }

    // if value below medium value, ignore.
    if (val < midVal) return console.log("Notifier: Ignore (low)", val, midVal) ?? false;

    console.log(`notifier triggered with gas val ${val} - gas ${sensor}`)
    console.log(`get tokens`)
    const targets = (await Token.query()).map(t => t.token)
    console.log(`tokcnt: ${targets.length}`)
    await this.#fcm.sendEachForMulticast(
      {
        tokens: targets,
        notification: {
          body: `${severity==="HIGH"?"Danger": "Warning"}: ${sensor} level is ${severity.toLowerCase()}. (${val}). ${sensor==="Pressure"?"":" Exhaust has been started."}`,
          title: `Gas ${severity==="HIGH"?"Danger": "Warning"}!`
        }
      }
    )

    this.lastNotify[sensor] = Date.now()
    console.log(`pushed notifications`)
    return true;

  }

}

export default new PushNotificationService()