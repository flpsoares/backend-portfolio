import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Image from './Image'
import Technology from './Technology'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public link: string

  @column()
  public description: string

  @column()
  public imageId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Image)
  public images: HasMany<typeof Image>

  @manyToMany(() => Technology, {
    localKey: 'id',
    pivotForeignKey: 'project_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'technology_id',
    pivotTable: 'project_technologies',
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
  public technologies: ManyToMany<typeof Technology>
}
