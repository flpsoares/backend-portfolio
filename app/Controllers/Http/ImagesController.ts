import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Image from 'App/Models/Image'
import Project from 'App/Models/Project'

export default class ImagesController {
  public async index() {
    const data = Image.all()

    return data
  }

  public async store({ request, params }: HttpContextContract) {
    const validatedImage = schema.create({
      image: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      }),
      filename: schema.string(),
    })

    const payload = await request.validate({ schema: validatedImage })

    const project = await Project.findOrFail(params.id)

    const imageName = `${Date.now()}-${payload.filename}`

    const image = Image.create({ filename: imageName, size: payload.image.size })

    await payload.image.move(Application.tmpPath('uploads'), { name: imageName })

    if (payload) {
      await project.related('image').associate(await image)
      await project.load('image')
    }

    return project
  }

  public async show({ params, response }: HttpContextContract) {
    return response.attachment(Application.tmpPath('uploads', params.filename))
  }
}
