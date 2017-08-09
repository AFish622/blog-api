const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');
const router = require('../BlogPostRouter');


chai.use(chaiHttp);

describe('Blog API', function() {
	before(function() {
		return runServer();
	})

	after(function() {
		return closeServer();
	})

	it('should get blog post on GET', function() {
		return chai.request(app)
			.get('/blog')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.should.be.a('object');
				res.body.length.should.be.at.least(1)
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys('title', 'content', 'author');
				})
			})
	})

	it('should post new blogs on POST', function() {
		const newRecipe = {title: 'The Meaning of life', content: 'HAPPINESS', author: 'Austin'}
		return chai.request(app)
			.post('/blog')
			.send(newRecipe)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.forEach(function(post) {
					post.should.include.keys('title', 'content', 'author');		
				})

				const { id, publishDate } = res.body[0]

				res.body[0].should.be.deep.equal(Object.assign(newRecipe, {id, publishDate}))
			})
	})

	it('should update recipes on PUT', function() {
		const updatedRecipe = {title: 'The Real Meaning of Life', content: 'LOVE', author: 'Fisher'}
		return chai.request(app)
		.get('/blog')
		.then(function(res) {
			updatedRecipe.id = res.body[0].id;
		})
		
		return chai.request(app)
		.put(`/blog/${updatedRecipe.id}`)
		.send('updatedRecipe')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json
			res.body.should.be.a('object');
			res.body.should.deep.equal(updatedRecipe);
		})
	})

	it('should delete recipes on DELETE', function() {
		return chai.request(app)
			.get('/blog')
			.then(function(res) {
				return chai.request(app)
				.delete(`/blog/${res.body[0].id}`)
				.then(function(res) {
					res.should.have.status(204);
				})
			})
	})
})
