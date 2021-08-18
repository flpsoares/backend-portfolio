import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

import Project from '../Models/Project'

export default class Technology extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Project, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'technology_id',
    pivotTable: 'project_technologies',
    pivotTimestamps: {
      createdAt: 'creation_date',
      updatedAt: 'updation_date',
    },
  })
  public technologies: ManyToMany<typeof Project>
}
