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
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy
    ? response.ok(report)
    : response.badRequest(report)
})

Route.get('/', async () => {
  return { hello: 'world' }
})

Route
  .resource('users', 'UsersController')
  .apiOnly()
Route.post('admin', 'UsersController.adminCreate')
Route.post('login', 'UsersController.login')

Route
  .resource('orders', 'OrdersController')
  .apiOnly()
Route.get('admin/orders', 'OrdersController.allOrders')
  
Route
  .resource('ebooks', 'EbooksController')
  .apiOnly()

