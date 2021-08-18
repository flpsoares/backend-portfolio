import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Technology from 'App/Models/Technology'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class TechnologiesController {
  public async index({}: HttpContextContract) {
    const data = Technology.all()

    return data
  }

  public async store({ request }: HttpContextContract) {
    const validatedData = await request.validate({
      schema: schema.create({
        name: schema.string(),
      }),
    })

    const technology = await Technology.create(validatedData)

    return technology
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
