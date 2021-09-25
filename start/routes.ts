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

// projects
Route.get('/projects', 'ProjectsController.index')

Route.get('/project/:id', 'ProjectsController.show')

Route.post('/project/:id', 'ProjectsController.storeTechnology')
Route.post('/projectImage', 'ProjectsController.storeWithImage')
Route.post('/projectLink', 'ProjectsController.storeWithLink')

Route.put('/project/:id', 'ProjectsController.update')

Route.delete('/project/:id', 'ProjectsController.delete')

// images
Route.get('images', 'ImagesController.index')
Route.get('images/:project_id', 'ImagesController.listAllByProject')
Route.post('image/:id', 'ImagesController.store')
Route.delete('image/:project_id/:id', 'ImagesController.delete')
Route.put('updateOrder', 'ImagesController.updateOrder')

// file system
Route.get('file', 'FileSystemsController.index').as('fileshow')

// technologies
Route.get('technologies', 'TechnologiesController.index')
Route.post('technology', 'TechnologiesController.store')
