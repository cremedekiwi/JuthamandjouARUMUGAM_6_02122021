const Sauce = require('../models/Sauce') // sauceSchema

exports.likeStatus = (req, res) => {
	const like = req.body.like
	const userId = req.body.userId

	// on cherche la sauce sélectionnée
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// on vérifie si l'user a déjà like ou dislike une sauce
			let userLike = sauce.usersLiked.find((id) => id === userId)
			let userDislike = sauce.usersDisliked.find((id) => id === userId)

			switch (like) {
				// like
				case 1:
					// SI userLike n'existe pas on ajoute +1 et on push userId
					if (!userLike) {
						sauce.likes += 1
						sauce.usersLiked.push(userId)
					} else {
						// SINON userLike existe : erreur
						throw new Error('déjà like !')
					}
					// SI userDislike existe : erreur
					if (userDislike) {
						throw new Error('déjà dislike !')
					}
					break
				// annule son like
				case 0:
					// SI userLike existe, on retire -1 et dans usersLiked on garde les userId différents
					if (userLike) {
						sauce.likes -= 1
						sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId)
					}
					// SI userDislike existe, on retire -1 et dans usersDisliked on garde les userId différents
					else {
						if (userDislike) {
							sauce.dislikes -= 1
							sauce.usersDisliked = sauce.usersDisliked.filter(
								(id) => id !== userId
							)
						}
					}
					break
				// dislike
				case -1:
					// SI userDislike n'existe pas, on ajouter +1 à dislikes et on push userId dans usersDisliked
					if (!userDislike) {
						sauce.dislikes += 1
						sauce.usersDisliked.push(userId)
					}
					// SINON userDislke existe : error
					else {
						throw new Error('un seul dislike possible !')
					}
					// SI userLike existe : error
					if (userLike) {
						throw new Error('annuler votre like avant de disliker')
					}
			}
			// sauvegarde la sauce avec like/dislike
			sauce
				.save()
				.then(() =>
					res.status(201).json({ message: 'préférence enregistrée !' })
				)
				.catch((error) => res.status(400).json({ error }))
		})
		.catch((error) => res.status(500).json({ error: error.message }))
}
