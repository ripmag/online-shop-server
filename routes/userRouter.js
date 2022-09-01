const Router = require('express')
const router = new Router()

router.post('/registration',)
router.post('/login',)
router.get('/auth',(req,res) =>{
    res.json({mess:'auth!'})
})

module.exports = router