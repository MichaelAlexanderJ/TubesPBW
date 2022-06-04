import express from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import flash from 'connect-flash'

var route = express.Router();

// Connect Database

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DATATUBES'
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

route.get('/home', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('home', {
            
    });
});
route.get('/homeAdmin', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('homeAdmin', {
            
    });
});

route.get('/', async(req,res) => {
    const conn = await dbConnect();
    const message = req.flash('message')
    conn.release();
    res.render('login', { message})
    });


route.get('/unggahTopik', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('unggahTopik',{

    });
});

route.get('/skripsiSaya', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('topikSkripsiSaya',{

    });
});

route.get('/kelolaAKun', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('kelolaAkun',{

    });
});

// route.post('/',express.urlencoded(),async(req,res) => {
//     const conn = await dbConnect();
//     conn.release();
//     res.redirect('homeAdmin');
//     console.log(req.body);
// })

route.post('/',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    var username = req.body.user;
    var password = req.body.pass;
    var sql = 'SELECT username, pwd FROM dosen WHERE username =? AND pwd =?';
    conn.query(sql, [username,password], (err, results, fields)=>{
        if(results.length>0){
            res.redirect('/homeAdmin')
        }
        else{
            req.flash('message', 'Username atau Password anda salah!');
            res.redirect('/')
        }
    })
})

export {route};