/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// projects
Route.get('/projects', 'ProjectsController.index')
Route.get('/project/:id', 'ProjectsController.show')
Route.post('/project', 'ProjectsController.store')
Route.delete('/project/:id', 'ProjectsController.delete')

// images
Route.get('images', 'ImagesController.index')
Route.get('image/:filename', 'ImagesController.show')
Route.post('image/:id', 'ImagesController.store')

//file system
Route.get('file', 'FileSystemsController.index').as('fileshow')