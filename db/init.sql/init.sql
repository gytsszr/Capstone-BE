-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2023 at 11:37 AM
-- Server version: 10.6.14-MariaDB-cll-lve
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u917904281_cp_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `applyments`
--

CREATE TABLE `applyments` (
  `applyId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `batchId` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `batchs`
--

CREATE TABLE `batchs` (
  `batchId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `campaignName` varchar(255) DEFAULT NULL,
  `campaignDesc` text DEFAULT NULL,
  `campaignPeriod` datetime DEFAULT NULL,
  `campaignKeyword` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batchs`
--

INSERT INTO `batchs` (`batchId`, `userId`, `campaignName`, `campaignDesc`, `campaignPeriod`, `campaignKeyword`, `status`, `startDate`, `endDate`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Cloud Computing Campaign', 'Cloud Computing Campaigns are strategic initiatives aimed at promoting the adoption and use of cloud computing technology. These campaigns can take various forms, but they generally include the following elements: 1. Education and Awareness: The campaign seeks to educate potential users about the benefits of cloud computing. This includes explaining what cloud computing is, how it works, and how it can benefit businesses and individuals. This is often done through webinars, workshops, and informational content', '2023-12-06 05:58:18', '#Campagin#ClooudComputing#Tech', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2023-12-06 05:58:18', '2023-12-06 05:58:18');

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('001-create-users.js'),
('002-create-batchs.js'),
('003-create-applyments.js'),
('20231122030306-create-user.js'),
('20231122032127-create-users.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `isCustomer` tinyint(1) DEFAULT 0,
  `isAdmin` tinyint(1) DEFAULT 0,
  `status` tinyint(1) DEFAULT 0,
  `job` varchar(255) DEFAULT NULL,
  `sex` enum('MALE','FEMALE') DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `token`, `resume`, `profile`, `isCustomer`, `isAdmin`, `status`, `job`, `sex`, `address`, `website`, `description`, `phone`, `createdAt`, `updatedAt`) VALUES
(1, 'Samuel', 'Zakaria', 'samuelzakaria3103@outlook.com', 'Jobsterific', NULL, NULL, NULL, NULL, NULL, 0, 'Profesional Cloud Computing', 'MALE', 'Jln Linggarjati no 5A', NULL, NULL, NULL, '2023-12-06 05:58:18', '2023-12-06 05:58:18'),
(2, 'Samsung', 'Company', 'samsung@samsung.co.id', 'budi', NULL, NULL, NULL, 1, NULL, 0, NULL, 'MALE', 'Jln Linggarjati no 5A', 'www.samsung.com', NULL, '+061782828', '2023-12-06 05:58:18', '2023-12-06 05:58:18'),
(3, 'admin', 'admin', 'admin@gmail.com', 'admin', NULL, NULL, NULL, NULL, 1, 0, NULL, 'MALE', NULL, NULL, NULL, NULL, '2023-12-06 05:58:18', '2023-12-06 05:58:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applyments`
--
ALTER TABLE `applyments`
  ADD PRIMARY KEY (`applyId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `batchId` (`batchId`);

--
-- Indexes for table `batchs`
--
ALTER TABLE `batchs`
  ADD PRIMARY KEY (`batchId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applyments`
--
ALTER TABLE `applyments`
  MODIFY `applyId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `batchs`
--
ALTER TABLE `batchs`
  MODIFY `batchId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applyments`
--
ALTER TABLE `applyments`
  ADD CONSTRAINT `applyments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL,
  ADD CONSTRAINT `applyments_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batchs` (`batchId`) ON DELETE SET NULL;

--
-- Constraints for table `batchs`
--
ALTER TABLE `batchs`
  ADD CONSTRAINT `batchs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
