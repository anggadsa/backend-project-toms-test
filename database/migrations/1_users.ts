import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { UserRoles } from 'Contracts/enums'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.enum('role', Object.values(UserRoles))
        .defaultTo(UserRoles.DRAFT)
        .notNullable()
      table.string('phone_number').notNullable()
      table.string('address').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
