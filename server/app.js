const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();

// Import Routes
const townhouses = require('./routes/townhouses');

const bodyParser = require("body-parser");


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser. json( { limit: '50MB' } ) );
// Use Routes
app.use('/api/townhouses', townhouses);



app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: 'Content-type, Authorization, Origin, X-Requested-with, Accept'
}));

app.use(logger('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

module.exports = app;
