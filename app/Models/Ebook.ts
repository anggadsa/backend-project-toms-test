import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ebook extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title:string

  @column()
  public author:string
  
  @column()
  public summary:string

  @column()
  public price:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
