import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash';
import Orders from './Order';
// import JwtTokens from 'Database/migrations/4_jwt_tokens';
import { column, beforeSave, BaseModel, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import { UserRoles } from 'Contracts/enums'

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
  public rememberMeToken?: string
  
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
  
  @beforeSave()
  public static async hashPassword(user: User) {
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
