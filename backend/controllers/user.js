const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') // génère un token

const User = require('../models/User')

// enregistrer un compte
exports.signup = (req, res) => {
	// crypte le mot de passe (data, salt)
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			// crée le nouvel user avec le mail entrée, et le mdp hash
			const user = new User({
				email: req.body.email,
				password: hash,
			})
			// enregistre le user
			user
				.save()
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch((error) => res.status(400).json({ error }))
		})
		// erreur serveur
		.catch((error) => res.status(500).json({ error }))
}

// se connecter
exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			// si il n'existe pas, erreur 401
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
