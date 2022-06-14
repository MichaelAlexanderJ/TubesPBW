-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2022 at 10:58 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datatubes`
--

-- --------------------------------------------------------

--
-- Table structure for table `dosen`
--

CREATE TABLE `dosen` (
  `namaD` varchar(100) DEFAULT NULL,
  `noDosen` int(10) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `pwd` varchar(50) DEFAULT NULL,
  `roles` varchar(5) DEFAULT NULL,
  `statusSkripsi` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `dosen`
--

INSERT INTO `dosen` (`namaD`, `noDosen`, `username`, `pwd`, `roles`, `statusSkripsi`) VALUES
('Husnul Hakim', 1181988001, 'husnul', '8001', 'Admin', NULL),
('Elisati Hulu', 1181988002, 'elisati', '8002', 'Dosen', NULL),
('Keenan Adiwijaya Leman', 1181988003, 'keenan', '8003', 'Dosen', NULL),
('Maria Veronica', 1181988004, 'maria', '8004', 'Dosen', NULL),
('Raymond Chandra Putra', 1181988005, 'raymond', '8005', 'Admin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mahasiswa`
--

CREATE TABLE `mahasiswa` (
  `namaM` varchar(100) DEFAULT NULL,
  `NPM` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mahasiswa`
--

INSERT INTO `mahasiswa` (`namaM`, `NPM`) VALUES
('Michael Alexander', '6181901014'),
('Daffa Irham Atharazka', '6181901021'),
('Vincentius Daryl Kurniawan', '6181901023'),
('Jose Feliksilda', '6181901051'),
('Mohammad Dustin Trinanda Susilo', '6181901052');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `reviewID` int(11) NOT NULL,
  `noDosen` int(10) NOT NULL,
  `idTopik` int(11) NOT NULL,
  `komentar` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `semester`
--

CREATE TABLE `semester` (
  `periode` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `semester`
--

INSERT INTO `semester` (`periode`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `statuss`
--

CREATE TABLE `statuss` (
  `statusSkripsi` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `statuss`
--

INSERT INTO `statuss` (`statusSkripsi`) VALUES
('OPEN'),
('NULL'),
('INQ'),
('DECLINED'),
('TAKEN'),
('OK');

-- --------------------------------------------------------

--
-- Table structure for table `topik`
--

CREATE TABLE `topik` (
  `idTopik` int(11) NOT NULL,
  `judulTopik` varchar(500) DEFAULT NULL,
  `peminatan` varchar(50) DEFAULT NULL,
  `tipe` varchar(20) NOT NULL,
  `noDosen` varchar(10) DEFAULT NULL,
  `tahunAjaran` varchar(9) NOT NULL,
  `statusSkripsi` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `topik`
--

INSERT INTO `topik` (`idTopik`, `judulTopik`, `peminatan`, `tipe`, `noDosen`, `tahunAjaran`, `statusSkripsi`) VALUES
(1, 'Topik 1', 'Computing Science', 'Reguler', '1181988001', '2021/2022', 'OK'),
(2, 'Topik 2', 'Computing Science', 'Bintang', '1181988003', '2021/2022', 'NULL'),
(3, 'Judul Skripsi 1', 'Computing Science', 'Reguler', '1181988002', '2020/2021', 'OPEN');

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `noDosen` char(10) DEFAULT NULL,
  `roles` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`noDosen`, `roles`) VALUES
('1181988001', 'Admin'),
('1181988002', 'Dosen'),
('1181988003', 'Dosen'),
('1181988004', 'Dosen'),
('1181988005', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dosen`
--
ALTER TABLE `dosen`
  ADD PRIMARY KEY (`noDosen`);

--
-- Indexes for table `mahasiswa`
--
ALTER TABLE `mahasiswa`
  ADD PRIMARY KEY (`NPM`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`reviewID`);

--
-- Indexes for table `semester`
--
ALTER TABLE `semester`
  ADD PRIMARY KEY (`periode`);

--
-- Indexes for table `topik`
--
ALTER TABLE `topik`
  ADD PRIMARY KEY (`idTopik`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `reviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `topik`
--
ALTER TABLE `topik`
  MODIFY `idTopik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
