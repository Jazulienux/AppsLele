-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 22, 2020 at 04:25 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `apps_lele`
--

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `email`, `password`) VALUES
(1, 'jazulienux@gmail.com', '270698');

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `id_training` int(11) NOT NULL,
  `nama_video` varchar(255) DEFAULT NULL,
  `rata_rata` double DEFAULT NULL,
  `banyak_box` double DEFAULT NULL,
  `total_nilai_nol` double DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`id_training`, `nama_video`, `rata_rata`, `banyak_box`, `total_nilai_nol`, `label`) VALUES
(1, 'lambat_2.mp4', 0.00087, 6, 39.437, 'lambat'),
(2, 'lambat_3.mp4', 0.00129, 2, 24.088, 'lambat'),
(3, 'lambat_4.mp4', 0.00071, 5, 29.775, 'lambat'),
(4, 'lambat_5.mp4', 0.00137, 3, 30.719, 'lambat'),
(5, 'lambat_6.mp4', 0.00126, 5, 35.329, 'lambat'),
(6, 'lambat_7.mp4', 0.00159, 2, 29.747, 'lambat'),
(7, 'lambat_8.mp4', 0.0025, 3, 16.867, 'lambat'),
(8, 'lambat_9.mp4', 0.00207, 3, 21.739, 'lambat'),
(9, 'lambat_10.mp4', 0.00214, 2, 18.947, 'lambat'),
(10, 'cepat_1.mp4', 0.0005, 8, 27.5, 'cepat'),
(11, 'cepat_2.mp4', 0.00035, 16, 47.186, 'cepat'),
(12, 'cepat_3.mp4', 0.00059, 10, 33.597, 'cepat'),
(13, 'cepat_4.mp4', 0.00054, 9, 37.778, 'cepat'),
(14, 'cepat_5.mp4', 0.00066, 16, 39.224, 'cepat'),
(15, 'cepat_6.mp4', 0.00071, 9, 32, 'cepat'),
(16, 'cepat_7.mp4', 0.0006, 14, 35.784, 'cepat'),
(17, 'cepat_8.mp4', 0.00046, 16, 44.348, 'cepat'),
(18, 'cepat_9.mp4', 0.00072, 15, 30.8, 'cepat'),
(19, 'cepat_10.mp4', 0.00054, 15, 35.545, 'cepat'),
(20, 'lambat_1.mp4', 0.00139, 9, 29.577, 'lambat');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`id_training`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `id_training` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
