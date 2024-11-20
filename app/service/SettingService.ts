import { Bcrypt } from "@adonisjs/core/hash/drivers/bcrypt";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";

class SettingService {
  readonly #bcrypt = new Bcrypt({})

  config: {
    passwordHash: string;
    lowVal: number;
    midVal: number;
    highVal: number;
  } = {
    // GasWeb123
    passwordHash: "$2a$10$xBB000A7Q4vaX741VIg7Z.QC7dfvRh7MiS9SBvd9XMpdNZc5PqFk2",
    lowVal: 300,
    midVal: 600,
    highVal: 900,
  };


  constructor() {
    try {
      const exist = readFileSync(`${homedir()}/.gasrc}`)
      if (exist) {
        const parse = JSON.parse(readFileSync(`${homedir()}/.gasrc`).toString())
        this.config = parse
      } else {
        const data=  JSON.stringify(this.config)
        writeFileSync(`${homedir()}/.gasrc`, data)
      }
    } catch (e) {
      console.log("error read config file. making new one", e)
      writeFileSync(`${homedir()}/.gasrc`, JSON.stringify(this.config))
    }
    
  }

  async updateSetting(setting: Partial<typeof this.config & {password?: string}>)  {
    if (setting.password) {
      this.config.passwordHash = await this.#bcrypt.make(setting.password)
    } 
    if (setting.lowVal) {
      this.config.lowVal = setting.lowVal
    }
    if (setting.midVal) {
      this.config.midVal = setting.midVal
    }
    if (setting.highVal) {
      this.config.highVal = setting.highVal
    }
  }
}




export default new SettingService()