import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'

export default class Sensor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare humanDetected: boolean

  @column()
  declare pressure: number

  @column()
  declare gas1: number

  @column()
  declare gas2: number

  static async history() {
    const raw = await  db.rawQuery(`
      SELECT
          strftime('%Y-%m-%d %H:%M:00', created_at) as time_group,
          AVG(pressure) as avg_pressure,
          AVG(gas_1) as avg_gas1,
          AVG(gas_2) as avg_gas2,
           MAX(human_detected) as humanDetected
      FROM sensors
      WHERE created_at >= datetime('now', '-3 hours')
      GROUP BY time_group
      ORDER BY time_group DESC
      LIMIT 2016;
    `);

    return raw.map((row: any) => ({
      createdAt: DateTime.fromSQL(row.time_group).toISO(),
      pressure: row.avg_pressure,
      gas1: row.avg_gas1,
      gas2: row.avg_gas2,
      humanDetected: row.humanDetected > 0 ? true : false,
    }));
  }

}