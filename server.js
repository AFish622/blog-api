const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const blogRouter = require('./BlogPostRouter');

app.use(morgan('common'));
app.use(jsonParser)
app.use('/blog', blogRouter);

let server;

function runServer() {
	const port = process.env.PORT || 8000;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`listening on port ${port}`);
			resolve(server);
		})
		.on('error', err => {
			reject(err);
		})

	})
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if(err) {
				reject(err);
				return;
			}
			resolve();
		})
	})
}

if (require.main === module) {
	runServer().catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer};