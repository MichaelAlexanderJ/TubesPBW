CREATE TABLE Dosen(
	namaDosen varchar(100),
	noDosen char(10),
	username varchar(50),
	pwd varchar(50),
	roles varchar(5),
	statusSkripsi varchar(50)
)

CREATE TABLE usertype(
	noDosen char(10),
	roles varchar(5)
)

CREATE TABLE Review(
	reviewID int,
	tanggal date,
	komentar varchar(500)
)

CREATE TABLE Semester(
	tahunAjaran varchar(9),
	ganjilGenap varchar(10)
)

CREATE TABLE statusS(
	statusSkripsi varchar(50)
)

CREATE TABLE Mahasiswa(
	namaM varchar(100),
	NPM char(10)
)

CREATE TABLE Topik(
	idTopik int NOT NULL,
	judulTopik varchar(500),
	noDosen varchar(10),
	statusSkripsi varchar(50)
)

INSERT INTO Dosen (namaD, noDosen, username, pwd, roles, statusSkripsi)
VALUES ('Husnul Hakim', '1181988001', 'husnul', '12345', 'Admin', NULL),
('Elisati Hulu', '1181988002', 'elisati', '12345', 'Dosen', NULL),
('Keenan Adiwijaya Leman', '1181988003', 'keenan', '12345', 'Dosen', NULL),
('Maria Veronica', '1181988004', 'maria', '12345', 'Dosen', NULL),
('Raymond Chandra Putra', '1181988005', 'raymond', '12345', 'Admin', NULL)

INSERT INTO usertype
VALUES('1181988001', 'Admin'),
('1181988002', 'Dosen'),
('1181988003', 'Dosen'),
('1181988004', 'Dosen'),
('1181988005', 'Admin')


INSERT INTO Review
VALUES('001', '2020-05-30', 'Topik-nya sudah bagus, wow keren')

INSERT INTO Semester
VALUES('2021/2022', 'Genap'),
('2020/2021', 'Ganjil')

INSERT INTO statusS
VALUES('OPEN'),
('NULL'),
('INQ'),
('DECLINED'),
('TAKEN'),
('OK')

INSERT INTO Mahasiswa
VALUES('Jose Feliksilda', '6181901051'),
('Michael Alexander', '6181901014'),
('Daffa Irham Atharazka', '6181901021'),
('Vincentius Daryl Kurniawan', '6181901023'),
('Mohammad Dustin Trinanda Susilo', '6181901052')


INSERT INTO Topik
VALUES('201', 'Pengaruh Big Data pada Teknologi', '1181988001', NULL),
('101', 'Aplikasi Java pada Kehidupan Sehari-hari', '1181988002', NULL),
('202', 'Aplikasi Data Mining Untuk Menampilkan Informasi Tingkat Kelulusan Mahasiswa', '1181988003', NULL),
('102', 'Penerapan Algoritma Differential Evolution untuk Penyelesaian Permasalahan Vehicle Routing Problem with Delivery and Pick-up
', '1181988004', NULL),
('203', 'Penerapan Metode Asosiasi Data Mining Menggunakan Algoritma Apriori Untuk Mengetahui Kombinasi Antar Itemset Pada Pondok KOPI', '1181988005', NULL)




