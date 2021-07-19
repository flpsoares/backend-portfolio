import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'

export default class FileSystemsController {
  public async index({ request, response }: HttpContextContract) {
    const { path } = request.all()

    const reader = fs.createReadStream(Application.tmpPath(path))
    response.header('content-type', 'image/webp')
    return response.stream(reader)
  }
}
