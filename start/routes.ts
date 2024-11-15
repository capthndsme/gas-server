/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const SystemsController = () => import('#controllers/systems_controller')


router.post('/gas-report', [SystemsController, 'report'])


router.group(() => {

})
.use([middleware.auth()])