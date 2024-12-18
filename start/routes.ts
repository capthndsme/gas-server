/*
|--------------------------------------------------------------------------z  
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/


import router from '@adonisjs/core/services/router'
 

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const SystemsController = () => import('#controllers/systems_controller')
const SensorsController = () => import('#controllers/sensors_controller')

router.post('/gas-report', [SystemsController, 'report'])


router.group(() => {
  router.get('/data-report', [SensorsController, 'get'])
  router.get('/history', [SensorsController, 'index'])
  router.get('/last-detect', [SensorsController, 'lastDetect'])
  router.post('/register-token', [SystemsController, 'registerToken'])
  router.get("/settings", [SystemsController, 'getSettings'])
  router.post("/settings", [SystemsController, 'changeSetting'])

})

// no api
router.post("/login", [SystemsController, 'login'])
router.post("/valid-token", [SystemsController, 'validToken'])
