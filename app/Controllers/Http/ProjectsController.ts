import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import * as uuid from 'uuid'

import Project from 'App/Models/Project'
import Image from 'App/Models/Image'

import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'

export default class ProjectsController {
  public async index({}: HttpContextContract) {
    const data = Project.query().preload('images').preload('technologies').orderBy('id')

    return data
  }

  public async storeWithImage({ request }: HttpContextContract) {
    const validatedData = await request.validate({
      schema: schema.create({
        name: schema.string(),
        description: schema.string(),
      }),
      messages: {
        'name.required': 'Name cannot be null',
        'description.required': 'Description cannot be null',
      },
    })

    const { technologies } = request.only(['technologies'])

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

    if (payload.image) {
      payload.image.map(async (images) => {
        const imageName = `${uuid.v4()}-${images?.clientName}`

        const image = await Image.create({ filename: imageName, size: images?.size })

        await images?.move(Application.publicPath('uploads'), { name: imageName })

        project.related('images').save(image)
        project.load('images')
      })
    }

    return project
  }

  public async storeWithLink({ request }: HttpContextContract) {
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

    const project = await Project.create(validatedData)

    if (technologies && technologies.length > 0) {
      await project.related('technologies').attach(technologies)
      await project.load('technologies')
    }

    return project
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

  public async show({ params }: HttpContextContract) {
    const projectId = params.id

    const data = await Project.findByOrFail('id', projectId)

    await data.load((loader) => {
      loader.load('images').load('technologies')
    })

    return data
  }

  public async update({ request, params }: HttpContextContract) {
    const data = request.all()

    const project = await Project.findByOrFail('id', params.id)

    await project
      .related('technologies')
      .detach()
      .then(() => {
        project.related('technologies').attach(data.technologies)
      })

    const validatedImage = schema.create({
      image: schema.array.optional().members(
        schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        })
      ),
    })

    const payload = await request.validate({ schema: validatedImage })

    if (payload.image) {
      payload.image.map(async (images) => {
        const imageName = `${uuid.v4()}-${images?.clientName}`

        const image = await Image.create({ filename: imageName, size: images?.size })

        await images?.move(Application.publicPath('uploads'), { name: imageName })

        project.related('images').save(image)
        project.load('images')
      })
    }

    await project.load((loader) => {
      loader.load('images').load('technologies')
    })

    project.merge(data)
    await project.save()

    return project
  }

  public async delete({ params, response }: HttpContextContract) {
    const project = await Project.findOrFail(params.id)

    project.delete()

    return response.json({ message: 'Project deleted' })
  }
}
