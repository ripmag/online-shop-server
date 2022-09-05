const {Basket, Brand, BasketDevice,Device} = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketController {
    /* created with User */

    async addDevice(req,res){
        const {basketId, deviceId} = req.body       
        console.log("basketId, deviceId:",basketId, deviceId)
        const basketDevice = await BasketDevice.create({basketId,deviceId})
        return res.json(basketDevice)
    }
   async getBasket(req, res) {
        const {basketId} = req.query       
        
        //if (basketId == undefined) basketId = 2
        const basket = await BasketDevice.findAll({where: {basketId},include: [{model: Device, as: 'device'}]}
        )
        return res.json(basket)
    }
}

module.exports = new BasketController()