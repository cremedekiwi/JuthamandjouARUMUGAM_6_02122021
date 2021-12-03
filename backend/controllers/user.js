const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

exports.signup = (req, res, next) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			})
			user
				.save()
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch((error) => res.status(400).json({ error }))
		})
		.catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
	// vérifie que l'e-mail entré par l'user correspond à un user existant de la BDD
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: 'Utilisateur non trouvé !' })
			}
			bcrypt
				// compare le mdp entré par l'user avec le hash enregistré dans la BDD
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: 'Mot de passe incorrect !' })
					}
					// réponse 200 contenant l'ID user et un token
					res.status(200).json({
						userId: user._id,
						// jswonwebtoken encode un nouveau token
						token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
							//  l'user devra se reconnecter au bout de 24h
							expiresIn: '24h',
						}),
					})
				})
				.catch((error) => res.status(500).json({ error }))
		})
		.catch((error) => res.status(500).json({ error }))
}
