import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';



const PORT = 8080;
const app = express();

const publicPath = path.resolve('public');
app.use(express.static(publicPath));

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));


// ambil koneksi

app.get('/home', async(req,res) => {
    res.render('home', {
            
    });
});

app.get('/', async(req,res) => {
    res.render('login', {
            
    });
});


app.get('/unggahTopik', async(req,res) => {
    res.render('unggahTopik',{

    });
});

app.get('/skripsiSaya', async(req,res) => {
    res.render('topikSkripsiSaya',{

    });
});

app.post('/', async(req,res) => {
    res.redirect('home');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})