const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket, Token} = require('../models/models')

const generateJwt = (id,email,role) => {
    return jwt.sign(        
        {id, email, role},
        process.env.JWT_ACCESS_KEY,
        {expiresIn:'24h'}
        )
}
const generateRefreshToken = (id,email,role) => {
    return jwt.sign(        
        {id, email, role},
        process.env.JWT_REFRESH_KEY,
        {expiresIn:'30d'}
        )
}

class UserController {
    async registration(req,res,next){
        
        const {email, password, role} = req.body
        if(!email || !password)
            return next(ApiError.badRequest("плохой пароль или email"))

        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        
        const hashPassword = await bcrypt.hash(password,5)
        const user = await User.create({
            email,
            role,
            password:hashPassword
        })        

        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)

        //const refreshToken = generateRefreshToken(user.id, user.email, user.role)
        //const saveToken = await Token.create({refreshToken: refreshToken, userId:user.id})
        //res.cookie('refreshToken',refreshToken,{maxAge: 30 *24*60*60*1000,httpOnly:true})

        return res.json({token})
    }

    async login(req,res,next){
        const {email, password} = req.body
        const user = await User.findOne({where:{email}})
        if(!user) {
            return next(ApiError.internal("Пользователя с таким email не существует"))
        }
        const comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.badRequest("Указан не правильный пароль"))
        }
        const token = generateJwt(user.id,user,email,user.role)

        //const refreshToken = generateRefreshToken(user.id, user.email, user.role)        
        //res.cookie('refreshToken',refreshToken,{maxAge: 30 *24*60*60*1000,httpOnly:true})

        return res.json({token,email})

    }
    async check(req,res,next){        
        const token = generateJwt(req.user.id, req.user.emai, req.user.role)
        return res.json({token})
    }
    /*
    async refresh(req,res,next){        
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            throw ApiError.unauthorizedError()
        }

        const verify_token = jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY)
        const tokenFromBD = await Token.findOne({where:{refreshToken}})
        if(!verify_token || !tokenFromBD)
        {
            throw ApiError.unauthorizedError()
        }


        const token = generateJwt(req.user.id, req.user.emai, req.user.role)
        return res.json(token)
    }*/
    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            //res.clearCookie('refreshToken');
            //return res.json(token)
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = new UserController()