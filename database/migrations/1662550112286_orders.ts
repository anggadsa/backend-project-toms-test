import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OrderStaus } from 'Contracts/enums'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ebook_id').notNullable()
      table.integer('customer_id').notNullable()
      table.enum('role', Object.values(OrderStaus))
        .defaultTo(OrderStaus.UNPAID)
        .notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
