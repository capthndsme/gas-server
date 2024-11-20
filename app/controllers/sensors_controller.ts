import type { HttpContext } from '@adonisjs/core/http'
import DataService from '../service/DataService.js'
import { SensorData } from '../types/SensorData.js'

export default class SensorsController {
  async index() {
    return await DataService.history()
  }

  async get() {
    return await DataService.get()
  }
  
  async store({ request }: HttpContext) {
    const data = request.body()
    return await DataService.report(data as SensorData)
  }

  async lastDetect() {
    return await DataService.getLastDetect() || {humanDetected: false}
  
  }


}