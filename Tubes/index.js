import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import {route} from './router.js'
import bodyParser from 'body-parser';
import session from 'express-session';

const PORT = 8080;
const app = express();
app.use(route)

const publicPath = path.resolve('public');
app.use(express.static(publicPath));


app.set('view engine','ejs');



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    
})