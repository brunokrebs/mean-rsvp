// Dependencies

//  Modules

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');
// Config
const config = require('./server/config');

// MongoDB
mongoose.connect(config.MONGO_URI);
const monDb = mongoose.connection;

monDb.on('error', function() {
	console.error('MongoDB connection error.  Please make sure that', config.MONGO_URI, 'is running.');
});

monDb.once('open', function callback() {
	console.info('Connection to MongoDB:', config.MONGO_URI);
});

// App
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cors());

// Set port
const port = process.env.PORT || '8083';
app.set('port', port);

// Set static path to angular app in dist
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
	app.use('/', express.static(path.join(__dirname, './dist')));
}

// Routes

require('./server/api')(app, config);

// Pass routing to angular app
// Don't run in dev
if (process.env.NODE_ENV !== 'dev') {
	app.get('*', function(req,res) {
		res.sendFile(path.join(__dirname, '/dist/index.html'));
	});
}

//  Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));
