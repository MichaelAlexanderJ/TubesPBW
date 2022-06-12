import express, { query } from 'express';
import path, { resolve } from 'path';
import mysql from 'mysql';
import { flash } from 'express-flash-message';
import { get } from 'http';

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
        conn.query(`UPDATE Dosen SET username = '%${usernameDiganti}%' WHERE username = '%${results[0].username}%'`,(err,result) =>{
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
    let results = await getStatus(conn)
    conn.release();
    res.render('topikSkripsiSaya',{
        results
    });
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
    conn.release();
    res.redirect('kelolaAkun');
})


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

// DropDown Status DaftarSkirpsi