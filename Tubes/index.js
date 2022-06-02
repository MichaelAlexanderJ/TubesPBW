import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';



const PORT = 8080;
const app = express();

const publicPath = path.resolve('public');
app.use(express.static(publicPath));

app.set('view engine','ejs');
app.use(express.urlencoded({ extended: true }));


// Connect Database

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DATA'
});

const dbConnect = () => {
    return new Promise((resolve,reject) => {
        pool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            else{
                resolve(conn);
                
            }
        })
    })
}


// ambil koneksi

app.get('/home', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('home', {
            
    });
});
app.get('/homeAdmin', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('homeAdmin', {
            
    });
});

app.get('/', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('login', {
            
    });
});


app.get('/unggahTopik', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('unggahTopik',{

    });
});

app.get('/skripsiSaya', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('topikSkripsiSaya',{

    });
});

app.post('/', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.redirect('home');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})