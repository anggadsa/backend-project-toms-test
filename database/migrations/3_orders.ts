import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { OrderStaus } from 'Contracts/enums'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('ebook_id').unsigned().notNullable().references('id').inTable('ebooks').onDelete('CASCADE'); // delete profile when user is deleted;
      table.integer('customer_id').notNullable().notNullable().references('id').inTable('users').onDelete('CASCADE'); // delete profile when user is deleted;
      table.enum('status', Object.values(OrderStaus))
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
