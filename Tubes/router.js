import express from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';

var route = express.Router();

// query
const getUsers = conn => {
    return new Promise((resolve,reject) => {
        conn.query('SELECT * FROM dosen', (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getNameF = (conn,getName) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM dosen WHERE namad LIKE '%${getName}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

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
    conn.release();
    res.render('login', {
            
    });
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

route.get('/kelolaAKun',express.urlencoded(), async(req,res) => {
    const getName = req.query.filter;
    const conn = await dbConnect();
    let results = await getUsers(conn);
    if(getName != undefined && getName.length > 0){
        results = await getNameF(conn,getName);
    }
    conn.release();
    res.render('kelolaAkun',{
        results
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
        if(err) throw err;
        if(results.length>0){
            res.redirect('/homeAdmin')
        }
        else{
            res.send('Username atau Password anda salah!')
        }
    })
    conn.release();
})

export {route};