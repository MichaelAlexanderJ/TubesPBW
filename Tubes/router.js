import express from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import { flash } from 'express-flash-message';

var route = express.Router();

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

const getMax = conn => {
    return new Promise((resolve, rejects) =>{
        conn.query('SELECT MAX(idTopik) as max FROM topik',(err, result) =>{
            if(err){
                rejects(err);
            }else{
                resolve(result);
            }
        });
    });
};

const tambahTopik = (conn,idx, judul, bidang, tipeS, noID) => {
    return new Promise((resolve,reject) => {
        conn.query(`INSERT INTO topik (idTopik, judulTopik, peminatan, tipe, noDosen, statusSkripsi) VALUES (${idx},'${judul}', '${bidang}','${tipeS}', '${noID}', NULL) `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const cekJudulTopik = (conn, cekJudul) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT judulTopik FROM dosen WHERE judulTopik = '${cekJudul}' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const cekNomorTopik = (conn,cekID) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT idTopik FROM dosen WHERE idTopik = '${cekID}' `,(err,result) => {
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

route.get('/unggahTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const message = req.flash('message')
    conn.release();
    if(req.session.loggedin){
        res.render('unggahTopik', { message
        });
    }
     else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.post('/unggahTopik',express.urlencoded(), async(req,res) => {
    var idx = req.body.nomor;
    const noID = req.session.noID;
    const judul = req.body.judulT;
    const bidang = req.body.peminatan;
    const tipeT = req.body.tipeSkripsi;
    const conn = await dbConnect();
    const cekJudul = req.query.judulT;
    if(req.session.loggedin){
        res.render('unggahTopik', {
            noID, idx, judul, bidang
        });
    }
     else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
      
    if(idx.length > 0 && judul.length > 0 && bidang.length > 0 && tipeT.length > 0){
        await tambahTopik(conn,idx, judul, bidang, tipeT, noID);
    }
    else{
        req.flash('message', 'Input tidak boleh kosong!');
        res.redirect('/unggahTopik')
    }
    conn.release();
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
    let results = await getUsers(conn);
    if(getName != undefined && getName.length > 0){
        results = await getNameF(conn,getName);
    }
    conn.release();
    res.render('kelolaAkun',{
        results
    });
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
        }
        else{
            req.flash('message', 'Username atau Password anda salah!');
            res.redirect('/')
        }
        res.end();
    })
})

export {route};