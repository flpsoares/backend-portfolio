import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Project from 'App/Models/Project'
import Image from 'App/Models/Image'

import Database from '@ioc:Adonis/Lucid/Database'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class ProjectsController {
  public async index({}: HttpContextContract) {
    const data = Project.query().preload('images').preload('technologies')

    return data
  }

  public async store({ request }: HttpContextContract) {
    // const { technologies, ...data } = request.only(['name', 'link', 'description', 'technologies'])

    const validatedData = await request.validate({
      schema: schema.create({
        name: schema.string(),
        link: schema.string.optional(),
        description: schema.string(),
      }),
      messages: {
        'name.required': 'Name cannot be null',
        'description.required': 'Description cannot be null',
      },
    })

    const { technologies } = request.only(['technologies'])

    // const validatedImage = schema.create({
    //   image: schema.file.optional({
    //     size: '2mb',
    //     extnames: ['jpg', 'png', 'jpeg'],
    //   }),
    //   filename: schema.string.optional(),
    // })

    const validatedImage = schema.create({
      image: schema.array().members(
        schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        })
      ),
    })

    const project = await Project.create(validatedData)

    if (technologies && technologies.length > 0) {
      await project.related('technologies').attach(technologies)
      await project.load('technologies')
    }

    const payload = await request.validate({ schema: validatedImage })

    // if (payload.image) {
    //   payload.image.map(async (images) => {
    //     const imageName = `${Date.now()}-${images?.clientName}`

    //     const image = Image.create({ filename: imageName, size: images?.size })

    //     await images?.move(Application.tmpPath('uploads'), { name: imageName })

    //     project.related('images').save(await image)
    //     project.load('images')
    //   })
    // }

    // return project
  }

  public async storeTechnology({ request, params }: HttpContextContract) {
    const data = Project.findOrFail(params.id)

    const { technologies } = request.only(['technologies'])

    if (technologies && technologies.length > 0) {
      await (await data).related('technologies').attach(technologies)
      await (await data).load('technologies')
    }

    return data
  }

  public async show({}: HttpContextContract) {
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
