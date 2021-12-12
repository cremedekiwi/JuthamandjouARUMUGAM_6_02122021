const multer = require('multer')

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
}

const storage = multer.diskStorage({
	// dossier images
	destination: (req, file, callback) => {
		callback(null, 'images')
	},
	// fichier
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_') // remplace les espaces par des _
		const extension = MIME_TYPES[file.mimetype] // change les extensions
		callback(null, name)
	},
})

module.exports = multer({ storage: storage }).single('image')
