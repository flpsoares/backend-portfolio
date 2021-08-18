import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProjectTechnologies extends BaseSchema {
  protected tableName = 'project_technologies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('project_id')
        .unsigned()
        .references('projects.id')
        .onDelete('CASCADE')
        .index('project_id')
      table
        .integer('technology_id')
        .unsigned()
        .references('technologies.id')
        .onDelete('CASCADE')
        .index('technology_id')
      table.unique(['project_id', 'technology_id'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
