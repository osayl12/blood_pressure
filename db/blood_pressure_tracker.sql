-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2025 at 04:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blood_pressure_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `measurements`
--

CREATE TABLE `measurements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `systolic` int(11) NOT NULL,
  `diastolic` int(11) NOT NULL,
  `pulse` int(11) NOT NULL,
  `measurement_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `measurements`
--
ALTER TABLE `measurements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `measurements`
--
ALTER TABLE `measurements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `measurements`
--
ALTER TABLE `measurements`
  ADD CONSTRAINT `measurements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- --------------------------------------------------------
--
-- Demo data (only applied on first boot, i.e. an empty db_data volume)
--

INSERT INTO `users` (`name`) VALUES
('Amina Farah'),
('David Okoye'),
('Priya Nair'),
('Sofia Reyes');

INSERT INTO `measurements` (`user_id`, `systolic`, `diastolic`, `pulse`, `measurement_date`) VALUES
(1, 118, 76, 68, CURDATE() - INTERVAL 28 DAY),
(1, 122, 79, 71, CURDATE() - INTERVAL 21 DAY),
(1, 124, 80, 70, CURDATE() - INTERVAL 14 DAY),
(1, 119, 77, 66, CURDATE() - INTERVAL 7 DAY),
(1, 121, 78, 69, CURDATE()),

(2, 138, 89, 78, CURDATE() - INTERVAL 28 DAY),
(2, 145, 92, 81, CURDATE() - INTERVAL 21 DAY),
(2, 141, 90, 76, CURDATE() - INTERVAL 14 DAY),
(2, 149, 95, 83, CURDATE() - INTERVAL 7 DAY),
(2, 143, 91, 79, CURDATE()),

(3, 112, 72, 62, CURDATE() - INTERVAL 28 DAY),
(3, 115, 74, 64, CURDATE() - INTERVAL 21 DAY),
(3, 110, 70, 60, CURDATE() - INTERVAL 14 DAY),
(3, 114, 73, 63, CURDATE() - INTERVAL 7 DAY),
(3, 113, 71, 61, CURDATE()),

(4, 126, 81, 74, CURDATE() - INTERVAL 28 DAY),
(4, 131, 84, 77, CURDATE() - INTERVAL 21 DAY),
(4, 128, 82, 75, CURDATE() - INTERVAL 14 DAY),
(4, 133, 85, 79, CURDATE() - INTERVAL 7 DAY),
(4, 129, 83, 76, CURDATE());

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
