import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sensors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.boolean('human_detected')
      table.index('human_detected')
      table.float( 'pressure')
      table.float( 'gas1')
      table.float( 'gas2')


    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}