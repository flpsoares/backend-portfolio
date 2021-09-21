import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import Image from 'App/Models/Image'
import Project from 'App/Models/Project'

import * as uuid from 'uuid'

export default class ImagesController {
  public async index() {
    const data = Image.all()

    return data
  }

  public async listAllByProject({ params }: HttpContextContract) {
    const images = await Image.query().where('project_id', '=', params.project_id)

    return images
  }

  public async store({ request, params }: HttpContextContract) {
    const validatedImage = schema.create({
      image: schema.array().members(
        schema.file({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        })
      ),
    })

    const project = await Project.findOrFail(params.id)

    const payload = await request.validate({ schema: validatedImage })

    if (payload.image) {
      payload.image.map(async (images) => {
        const imageName = `${uuid.v4()}-${images?.clientName}`

        const image = await Image.create({ filename: imageName, size: images.size })

        await images.move(Application.publicPath('uploads'), { name: imageName })

        project.related('images').save(image)
        project.load('images')
      })
    }

    return payload
  }

  public async show({ params, response }: HttpContextContract) {
    return response.attachment(Application.tmpPath('uploads', params.filename))
  }

  public async delete({ params, response }: HttpContextContract) {
    const images = await Image.query().where('project_id', '=', params.project_id)

    images.map(async (image) => {
      if (image.id.toString() === params.id) {
        await image.delete()
      }
    })

    return response.json({ message: 'Image deleted successfully' })
  }
}
