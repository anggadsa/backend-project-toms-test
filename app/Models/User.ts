import { DateTime } from 'luxon'
import { column, beforeSave, BaseModel, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import { UserRoles } from 'Contracts/enums'
import Orders from './Order';
import Hash from '@ioc:Adonis/Core/Hash';

export default class User extends BaseModel {
  @hasMany(() => Orders)
  public orders: HasMany<typeof Orders>

  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public email:string

  @column()
  public password:string

  @column()
  public role:UserRoles
  
  @column()
  public phone_number:string

  @column()
  public address:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


}
