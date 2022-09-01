const jwt = require('jsonwebtoken')
module.exports = function (role) {
    return function (req, res, next) {

        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] //0 - тип токена(Bearer) через пробел сам токен в 1
            if (!token) {
                return res.status(401).json({ message: "Пользователь не авторизован" })
            }

            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            if (decoded.role !== role) {
                return res.status(403).json({ message: "Нет доступа" })
            }
            next()
        }
        catch (err) {
            res.status(401).json({ message: "Пользователь не авторизован" })

        }
    }
}