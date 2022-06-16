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

const getTopikbyNoDosen = (conn,noDosenData) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM topik WHERE noDosen = ${noDosenData} `    , (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

const getKomen = (conn, idTopik) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT dosen.namaD AS namadosen, review.komentar AS komendosen, review.idTopik FROM review JOIN topik ON review.idTopik = topik.idTopik JOIN dosen ON topik.noDosen = dosen.noDosen WHERE review.idTopik ='%${idTopik}%'`, (err, result)=> {
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

const getNamaD = (conn) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT dosen.namaD, review.komentar, review.idTopik FROM dosen JOIN review ON dosen.noDosen = review.noDosen`, (err,result) => {
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

const getNoDosen = (conn,getName) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT noDosen FROM dosen WHERE namad LIKE '%${getName}%' `,(err,result) => {
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
const getMaxRev = conn => {
    return new Promise((resolve, rejects) =>{
        conn.query('SELECT MAX(reviewID) as max FROM review',(err, result) =>{
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

const getPeriode = (conn) => {
    return new Promise((resolve,reject) => {
        conn.query(`SELECT * FROM semester`,(err,result) => {
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


// Get buat search filter DaftarTopikDosen
route.get('/daftarTopikDosen',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const getName = req.query.filter;
    const nama = req.session.name;
    const idTopik = req.body.kTopik

    if(getName != undefined && getName.length > 0){
        let noDosen = await getNoDosen(conn,getName);
        let noDosenData = noDosen[0].noDosen;
        console.log(noDosenData);
        results = await getTopikbyNoDosen(conn,noDosenData);
        console.log(results);
        if(req.session.loggedin){
            res.render('daftarTopikDosen',{
                results,comments, nama, idTopik, namaKomen
            })
        }
        else{
            req.flash('message','anda harus login terlebih dahulu')
            res.redirect('/');
        }
    }
    else if(req.session.loggedin){
        res.render('daftarTopikDosen',{
            results, comments, nama, idTopik, namaKomen
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
    });

    route.post('/daftarTopikDosen2',express.urlencoded(), async(req,res) => {
        const conn = await dbConnect();
        const komen = req.body.komentar;
        const idTopik = req.body.kTopik;
        const noID = req.session.noID;
        var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
        var idx = maxID[0].max+1;
        var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `    
        conn.query(sql, [idx, idTopik, komen], (err)=>{
            if(err) throw err;
            res.redirect('/daftarTopikDosen')
            res.end();
        })
        conn.release();
    });
    

// ambil koneksi Admin

route.get('/homeAdmin',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    conn.release();
    var nama = req.session.name;
    var noID = req.session.noID;
    var roleD = req.session.role;
    const periode = await getPeriode(conn);
    const displayPeriode = JSON.stringify(periode)
    if(req.session.loggedin){
        res.render('homeAdmin', {
            nama, noID, roleD, periode
        });
    } else {
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
});

route.post('/homeAdmin',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const periode = req.body.setPeriode;
    var sql = `SELECT namaPeriode FROM semester WHERE periode ='${periode}'`;
    conn.query(sql, [periode], (err,result)=>{
        if(err) throw err;
        res.redirect('/homeAdmin')
    })
    console.log(periode)
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




route.get('/daftarTopik',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const nama = req.session.name;
    const idTopik = req.body.noTopik
    if(req.session.loggedin){
        res.render('daftarTopik',{
            results, comments, nama, idTopik, namaKomen
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    console.log(idTopik)
    conn.release();
});

route.get('/daftarTopik2',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const nama = req.session.name;
    const idTopik = req.body.plisTopik
    if(req.session.loggedin){
        res.render('daftarTopik',{
            results, comments, nama, idTopik, namaKomen
        });
    }else{
        req.flash('message', 'Anda harus login terlebih dahulu');
        res.redirect('/')
    }
    conn.release();
});
//get delete topik
route.get('/daftarTopik3',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    let results = await getTopik(conn);
    let comments = await getKomen(conn);
    let namaKomen = await getNamaD(conn)
    const nama = req.session.name;
    const idTopik = req.body.kTopik
    if(req.session.loggedin){
        res.render('daftarTopik',{
            results, comments, nama, idTopik, namaKomen
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
    const komen = req.body.komentar;
    const idTopik = req.body.noTopik;
    const nama = req.session.name;
    var sql = `UPDATE topik SET statusSkripsi = '${ubahStat}' WHERE idTopik ='${idTopik}'`
    conn.query(sql, [ubahStat,idTopik], ()=>{
        res.redirect('/daftarTopik')
        res.end();
    })
});

//delete topik
route.post('/daftarTopik3',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const ubahStat = req.body.gantiStat;
    const komen = req.body.komentar;
    const idTopik = req.body.noTopik;
    const nama = req.session.name;
    var sql = `DELETE FROM topik WHERE idTopik ='${idTopik}'`
    conn.query(sql, [idTopik], ()=>{
        res.redirect('/daftarTopik')
        res.end();
    })
});

route.post('/daftarTopik2',express.urlencoded(), async(req,res) => {
    const conn = await dbConnect();
    const komen = req.body.komentar;
    const idTopik = req.body.kTopik;
    const noID = req.session.noID;
    var maxID = await getMaxRev(conn); //Buat dapetin IdTopik terbesar di DB
    var idx = maxID[0].max+1;
    var sql = `INSERT INTO review (reviewID, noDosen, idTopik, komentar) VALUES ('${idx}','${noID}','${idTopik}','${komen}') `    
    conn.query(sql, [idx, idTopik, komen], (err)=>{
        if(err) throw err;
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