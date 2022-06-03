import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import {route} from './router.js'


const PORT = 8080;
const app = express();
app.use(route)

const publicPath = path.resolve('public');
app.use(express.static(publicPath));

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})