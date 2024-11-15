 import type { HttpContext } from '@adonisjs/core/http'
import SettingService from '../service/SettingService.js'
import { SensorData } from '../types/SensorData.js'
import DataService from '../service/DataService.js'
import AuthService from '../service/AuthService.js';

export default class SystemsController {

  async login({request}: HttpContext) {
    const {password} = request.body();

    return await AuthService.makeLogin(password)

  }

  async validToken({request}: HttpContext) {
    const {token} = request.body();
    return await AuthService.validToken(token)
  }

  async getSettings() {
    return SettingService.config
  }

  async changeSetting({request}: HttpContext) {
    const {highVal, lowVal, midVal, password} = request.body() as typeof SettingService.config & {password?: string}

    
    SettingService.updateSetting(
      {
        highVal,
        lowVal,
        midVal,
        password
      }
    )
  }

  async report({request}: HttpContext) {
    const body = request.body() as SensorData;
    return await DataService.report(body)
  
  }

}