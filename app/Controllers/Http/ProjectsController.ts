import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Project from 'App/Models/Project'
import Image from 'App/Models/Image'

import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class ProjectsController {
  public async index({ response }: HttpContextContract) {
    const data = Project.query().preload('images')

    return data
  }

  public async store({ request }: HttpContextContract) {
    const validatedData = await request.validate({
      schema: schema.create({
        name: schema.string(),
        description: schema.string(),
      }),
      messages: {
        'name.required': 'name cannot be null',
        'description.required': 'description cannot be null',
      },
    })

    const validatedImage = schema.create({
      image: schema.file.optional({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      }),
      filename: schema.string.optional(),
    })

    const payload = await request.validate({ schema: validatedImage })

    const project = await Project.create(validatedData)

    if (payload.image) {
      const imageName = `${Date.now()}-${payload.filename}`

      const image = Image.create({ filename: imageName, size: payload.image.size })

      await payload.image.move(Application.tmpPath('uploads'), { name: imageName })

      project.related('images').save(await image)
      project.load('images')
    }

    return project
  }

  public async show({ params }: HttpContextContract) {
    // const data = Project.findOrFail(params.id)
    // return data

    // const data = await Database.rawQuery('select * from projects where id = ?', [params.id])

    const data = await Database.from('projects').join(
      'projects.id',
      'images.project_id',
      '=',
      'projects.id'
    )

    return data
  }

  public async delete({ params, response }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    project.delete()

    return response.json({ message: 'Project deleted' })
  }
}
