import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import { flash } from 'express-flash-message';
import { get } from 'http';
import alert from 'alert';

var route = express.Router();

// query

const getTopik = conn => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM topik'    , (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getStatus = conn => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM statuss', (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

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

const checkLogin = (conn, username, password) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT username, pwd FROM dosen WHERE username LIKE '%${username}%' AND pwd LIKE '%${password}%'`, (err,result) => {
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

//query kelola akun

const getUsername = (conn,akunDiganti) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM dosen WHERE username LIKE '%${akunDiganti}%' `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const updateNama = (conn,namaDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET namaD = '${namaDiganti}' WHERE namaD LIKE '%${results[0].namaD}%'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const updatePassword = (conn,passwordDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET pwd = '${passwordDiganti}' WHERE pwd = '${results[0].pwd}'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const updateNoDosen = (conn,noDosenDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET noDosen = '${noDosenDiganti}' WHERE noDosen = '${results[0].noDosen}'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const updateUsername = (conn,usernameDiganti,results) => {
    return new Promise((resolve,reject) => {
        conn.query(`UPDATE Dosen SET username = '${usernameDiganti}' WHERE username LIKE '%${results[0].username}%'`,(err,result) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}

const getUsersPage = conn => {
    return new Promise((resolve,reject) =>{
        conn.query('SELECT * FROM dosen',(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}

const getUsersPage2 = (conn,startLimit,resultsPage) => {
    return new Promise((resolve,reject) =>{
        conn.query(`SELECT * FROM dosen LIMIT ${startLimit},${resultsPage}`,(err,result) => {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};
  
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

const tambahTopik = (conn,idx, judul, bidang, tipeS, noID, periode) => {
    return new Promise((resolve,reject) => {
        conn.query(`INSERT INTO topik (idTopik, judulTopik, peminatan, tipe, noDosen, tahunAjaran, statusSkripsi) VALUES (${idx},'${judul}', '${bidang}','${tipeS}', '${noID}', '${periode}', "NULL") `,(err,result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    })
}


const topikDosen = (conn,noID) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT idTopik, judulTopik, peminatan, tipe, statusSkripsi FROM topik WHERE noDosen LIKE '%${noID}%' `,(err,result) => {
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


// ambil koneksi Dosen

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

route.get('/daftarTopikDosen', async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn)
    conn.release();
    res.render('daftarTopikDosen',{
        results
    });
});

// ambil koneksi Admin

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
        res.redirect('/')
    }
});

route.post('/unggahTopik',express.urlencoded(), async(req,res) => {
    
    const noID = req.session.noID; //Buat dapetin noDosen
    const judul = req.body.judulT;
    const bidang = req.body.peminatan;
    const tipeT = req.body.tipeSkripsi;
    const periode = req.body.periode;
    const conn = await dbConnect();
    var maxID = await getMax(conn); //Buat dapetin IdTopik terbesar di DB
    var idx = maxID[0].max+1;
    if(req.session.loggedin){
        res.render('unggahTopik', {
            noID, idx, judul, bidang, tipeT,periode
        });
    }
    else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    if(judul.length > 0 && bidang.length > 0 && tipeT.length > 0 && periode.length>0 ){
        await tambahTopik(conn,idx, judul, bidang, tipeT, noID,periode);
    }
    conn.release();
});

route.get('/skripsiSaya', async(req,res) => {
    const noID = req.session.noID;
    const conn = await dbConnect();
    let results = await getStatus(conn)
    conn.release();
    res.render('topikSkripsiSaya',{
        results
    });
});

route.post('/topikSkripsiSaya',express.urlencoded(), async(req,res) => {
    let results = await topikDosen(conn, noID);
    conn.release();
    if(req.session.loggedin){
        res.render('topikSkripsiSaya', {
            results
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.post('/skripsiSaya',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const idTopik = req.body.noTopik
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    conn.query(sql, [ubahStat,idTopik], ()=>{
        res.redirect('/skripsiSaya')
        res.end();
    })
    conn.release();
});


route.get('/daftarTopik', async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const idTopik = req.body.noTopik
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    conn.query(sql, [ubahStat,idTopik], ()=>{
        res.redirect('/topikSkripsiSaya')
        res.end();
    })
    conn.release();
});

route.get('/daftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn)
    if(req.session.loggedin){
        res.render('daftarTopik',{
            results
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    
    conn.release();
});

route.post('/daftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const idTopik = req.body.noTopik
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    conn.query(sql, [ubahStat,idTopik], ()=>{
        res.redirect('/daftarTopik')
        res.end();
    })
    conn.release();
});

route.get('/kelolaAkun',express.urlencoded(), async(req,res) => {
    const getName = req.query.filter;
    const conn = await dbConnect();
    let results = await getUsersPage(conn);
    const numResults = results.length;
    let resultsPage = 3;
    const numPages = Math.ceil(numResults/resultsPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if(page > numPages){
        res.redirect('/kelolaAkun?page=' +encodeURIComponent(numPages));
    } else if (page<1){
        res.redirect('/kelolaAkun?page=' +encodeURIComponent('1'));
    }
    let startLimit = (page-1) * resultsPage;

    results = await getUsersPage2(conn,startLimit,resultsPage);
        let iteration = (page-3) < 1 ? 1 : page-3;
        let ending = (iteration+7) <= numPages ? (iteration+7) : page + (numPages-page);
        if(ending < (page+1)){
            iteration -= (page+1) - numPages;
        }
        if(req.session.loggedin){
            res.render('kelolaAkun',{
                results : results,page,iteration,ending,numPages
            })
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
    //search filter
    if(getName != undefined && getName.length > 0){
        results = await getNameF(conn,getName);
        console.log(results)
        if(req.session.loggedin){
            res.render('kelolaAkun',{
                results : results,page,iteration,ending,numPages
            })
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
    }
                conn.release();
        });

route.post('/kelolaAkun',express.urlencoded(),async(req,res)=>{
    const conn = await dbConnect();
    if(req.session.loggedin){
        res.redirect('kelolaAkunLanjutan');
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }

});

route.get('/kelolaAkunLanjutan',express.urlencoded(), async(req,res) =>{
    const conn = await dbConnect();
    conn.release();
    if(req.session.loggedin){
        res.render('kelolaAkunLanjutan',{

        })
    }
    else{
        req.flash('message','anda harus login terlebih dahulu')
        res.redirect('/');
    }
});

route.post('/kelolaAkunLanjutan',express.urlencoded(), async(req,res) =>{
    const conn = await dbConnect();
    let akunDiganti = req.body.akunGanti;
    let results = await getUsername(conn,akunDiganti);
    const namaDiganti = req.body.gantiNama
    const usernameDiganti = req.body.gantiUsername;
    const passwordDiganti = req.body.gantiPassword;
    const noDosenDiganti = req.body.gantiNoDosen;
    console.log(results[0].pwd);
    console.log(namaDiganti);
    if(namaDiganti.length > 0){
        await updateNama(conn,namaDiganti,results);
    }
    if(passwordDiganti.length > 0){
        await updatePassword(conn,passwordDiganti,results);
    }
    if(noDosenDiganti.length > 0){
        await updateNoDosen(conn,noDosenDiganti,results);
    }
    if(usernameDiganti.length > 0){
        await updateUsername(conn,usernameDiganti,results);
    }
    console.log(results[0].username);
    conn.release();
    res.redirect('kelolaAkun');
})


route.post('/',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const cekUser = checkLogin(conn,username,password)
    var username = req.body.user;
    var password = req.body.pass;
    var sql = `SELECT * FROM dosen WHERE username ='${username}' AND pwd ='${password}'`;
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
        else if(username = "" || password == ""){
            req.flash('message', 'Username atau Password Tidak Boleh Kosong!');
            res.redirect('/')
        }
        else{
            req.flash('message', 'Username atau Password Anda salah!');
            res.redirect('/')
        }
        res.end();
    })
    
})

export {route};

// DropDown Status DaftarSkirpsi