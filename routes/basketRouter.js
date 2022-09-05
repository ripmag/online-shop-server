const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.post('/',basketController.addDevice)
router.get('/',basketController.getBasket)

module.exports = router