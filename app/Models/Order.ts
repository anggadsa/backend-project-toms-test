import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { OrderStaus } from 'Contracts/enums'
import Users from './User'
import Ebooks from './Ebook'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ isPrimary: true })
  public ebook_id: number
  
  @column({ isPrimary: true })
  public customer_id: number

  @column()
  public status:OrderStaus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Users)
  public users: BelongsTo<typeof Users>

  @belongsTo(() => Ebooks)
  public ebooks: BelongsTo<typeof Ebooks>
}
