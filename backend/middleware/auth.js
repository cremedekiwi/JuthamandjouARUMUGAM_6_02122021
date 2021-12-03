const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {
		// le header contient le mot-clé Bearer, on utilise split pour récupèrer tout après l'espace
		const token = req.headers.authorization.split(' ')[1]
		// la fonction verify décode notre token
		const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET')
		// on extrait l'ID user de notre token
		const userId = decodedToken.userId
		req.auth = { userId }
		if (req.body.userId && req.body.userId !== userId) {
			throw 'Invalid user ID'
		} else {
			next()
		}
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!'),
		})
	}
}
