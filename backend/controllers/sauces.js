const Sauce = require('../models/Sauce')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce)
	delete sauceObject._id // supprime le faux _id envoyé par le front-end
	const sauce = new Sauce({
		// crée une instance du model Sauce
		...sauceObject, // contient toutes les informations du body
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
	})
	sauce // promise
		.save() // enregistre dans la BDD
		.then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
		.catch((error) => res.status(400).json({ message: error }))
}

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }) // trouve la Sauce avec le même _id
		.then((sauce) => {
			res.status(200).json(sauce)
		})
		.catch((error) => {
			res.status(404).json({ error })
		})
}

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body }
	Sauce.updateOne(
		// méthode updateOne() met à jour la sauce
		{ _id: req.params.id }, // l'id de l'élément à modifier
		{ ...sauceObject, _id: req.params.id } // la modification
	)
		.then(() => res.status(200).json({ message: 'Sauce modifié !' }))
		.catch((error) => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split('/images/')[1]
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
					.catch((error) => res.status(400).json({ error }))
			})
		})
		.catch((error) => res.status(500).json({ error }))
}

exports.getAllSauces = (req, res, next) => {
	Sauce.find()
		.then((sauces) => {
			res.status(200).json(sauces)
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			})
		})
}
