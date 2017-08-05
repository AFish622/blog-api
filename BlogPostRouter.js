const express = require('express');
const router = express.Router();

const {BlogPosts} = require('./models');

BlogPosts.create('The real meaning of life', 'what is the meaning of life', 'Austin Fisher')
BlogPosts.create('2The real meaning of life', '2what is the meaning of life', 'Austin Fisher')

router.get('/', (req, res) => {
	// send our post from DB
	res.send(BlogPosts.get())
})

router.delete('/:id', (req, res) => {
	// delete a post from DB
	BlogPosts.delete(req.params.id)
	res.send(BlogPosts.get())
})

router.post('/', (req, res) => {
	const requiredFields = ['name', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			res.status(400).send(message);
		}
	}
	BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.send(BlogPosts.get())
})

router.put('/', (req, res) => {
	const requiredFields = ['name', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const bodyMessage = `${req.params.id} does not match id`
		res.status(400).send(bodyMessage);
	}

	BlogPosts.update({
		name: req.body.name,
		content: req.body.content,
		author: req.body.author
		res.status(204).end();
	})

	BlogPosts.update(req.body)
	res.send(BlogPosts.get())
})

module.exports = router;