const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const blogRouter = require('./BlogPostRouter');

app.use(morgan('common'));
app.use(jsonParser)
app.use('/blog', blogRouter);

app.listen(8000, () => {
	console.log('running on 8080')
})
