import express from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import { flash } from 'express-flash-message';

var route = express.Router();

const resultsPage = 3;
// query

const getRoles = (conn, username) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT roles FROM dosen WHERE username LIKE '%${username}%' `, (err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

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
    var nama = req.session.name;
    var noID = req.session.noID;
    var roleD = req.session.role;
    if(req.session.loggedin){
        res.render('home', {
            nama, noID, roleD
        });
    } else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.get('/homeAdmin', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    var nama = req.session.name;
    var noID = req.session.noID;
    var roleD = req.session.role;
    if(req.session.loggedin){
        res.render('homeAdmin', {
            nama, noID, roleD
        });
    } else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
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

route.get('/daftarTopik', async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    res.render('daftarTopik',{

    });
});

route.get('/kelolaAkun',express.urlencoded(), async(req,res) => {
    const getName = req.query.filter;
    const conn = await dbConnect();
    let sql = 'SELECT * FROM dosen';
    if(getName != undefined && getName.length > 0){
        let results = await getNameF(conn,getName);
        res.render('kelolaAkun',{
            results,
        });
    }
        conn.query(sql, (err,result) => {
            if(err) throw err;
            const numResults = result.length;
            const numPages = Math.ceil(numResults/resultsPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            if(page > numPages){
                res.redirect('/kelolaAkun?page=' +encodeURIComponent(numPages));
            } else if (page<1){
                res.redirect('/kelolaAkun?page=' +encodeURIComponent('1'));
            }
            const startLimit = (page-1) * resultsPage;
    
            sql = `SELECT * FROM dosen LIMIT ${startLimit},${resultsPage}`;
            conn.query(sql,(err,result) => {
                if(err) throw err;
                let iteration = (page-5) < 1 ? 1 : page-5;
                let ending = (iteration+9) <= numPages ? (iteration+9) : page + (numPages-page);
                if(ending < (page+4)){
                    iteration -= (page+4) - numPages;
                }
                res.render('kelolaAkun',{data: result,page,iteration,ending,numPages});
            })
        });
    conn.release();
});


route.post('/',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    var username = req.body.user;
    var password = req.body.pass;
    var roleDosen = getRoles(conn,username);
    var sql = 'SELECT * FROM dosen WHERE username =? AND pwd =?';
    conn.query(sql, [username,password], (err, results)=>{
        if(err) throw err;
        if(results.length > 0){
            req.session.loggedin = true;
            req.session.username = username;
            req.session.name = results[0].namaD;
            req.session.noID = results[0].noDosen;
            req.session.role = results[0].roles;
            if(results[0].roles == "Admin"){
                res.redirect('/homeAdmin')
            }
            else if(results[0].roles == "Dosen"){
                res.redirect('/home')
            }
            console.log(req.session)
        }
        else{
            req.flash('message', 'Username atau Password anda salah!');
            res.redirect('/')
        }
        res.end();
    })
})

export {route};