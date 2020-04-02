-- phpMyAdmin SQL Dump
-- version 4.7.8
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 02, 2020 at 11:52 AM
-- Server version: 5.7.29-0ubuntu0.18.04.1
-- PHP Version: 5.6.40-26+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trader`
--

-- --------------------------------------------------------

--
-- Table structure for table `trade_cumulative`
--

DROP TABLE IF EXISTS `trade_cumulative`;
CREATE TABLE `trade_cumulative` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `quantity` int(11) NOT NULL,
  `avg_price` decimal(10,4) NOT NULL,
  `break_even` decimal(10,4) NOT NULL,
  `cost_per_unit` decimal(10,4) NOT NULL,
  `last_act` varchar(4) DEFAULT NULL,
  `total_cost` decimal(10,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stand-in structure for view `trade_records`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `trade_records`;
CREATE TABLE `trade_records` (
`id` bigint(20)
,`date` datetime
,`action` varchar(4)
,`code` varchar(10)
,`quantity` int(11)
,`action_quantity` int(11)
,`price` decimal(10,4)
,`filled` int(11)
,`order_id` bigint(20)
,`gross_total` decimal(10,4)
,`brokerage` decimal(10,4)
,`total_cost` decimal(10,4)
,`cost_per_unit` decimal(10,4)
,`processed_for_tc` tinyint(1)
,`pnl` decimal(10,4)
);

-- --------------------------------------------------------

--
-- Table structure for table `trade_records_imported`
--

DROP TABLE IF EXISTS `trade_records_imported`;
CREATE TABLE `trade_records_imported` (
  `id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `action` varchar(4) NOT NULL,
  `code` varchar(10) NOT NULL,
  `quantity` int(11) NOT NULL,
  `action_quantity` int(11) NOT NULL,
  `price` decimal(10,4) NOT NULL,
  `filled` int(11) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `gross_total` decimal(10,4) NOT NULL,
  `brokerage` decimal(10,4) NOT NULL,
  `total_cost` decimal(10,4) NOT NULL,
  `cost_per_unit` decimal(10,4) NOT NULL,
  `processed_for_tc` tinyint(1) NOT NULL DEFAULT '0',
  `pnl` decimal(10,4) NOT NULL DEFAULT '0.0000'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure for view `trade_records`
--
DROP TABLE IF EXISTS `trade_records`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `trade_records`  AS  select `trade_records_imported`.`id` AS `id`,`trade_records_imported`.`date` AS `date`,`trade_records_imported`.`action` AS `action`,`trade_records_imported`.`code` AS `code`,`trade_records_imported`.`quantity` AS `quantity`,`trade_records_imported`.`action_quantity` AS `action_quantity`,`trade_records_imported`.`price` AS `price`,`trade_records_imported`.`filled` AS `filled`,`trade_records_imported`.`order_id` AS `order_id`,`trade_records_imported`.`gross_total` AS `gross_total`,`trade_records_imported`.`brokerage` AS `brokerage`,`trade_records_imported`.`total_cost` AS `total_cost`,`trade_records_imported`.`cost_per_unit` AS `cost_per_unit`,`trade_records_imported`.`processed_for_tc` AS `processed_for_tc`,`trade_records_imported`.`pnl` AS `pnl` from `trade_records_imported` order by `trade_records_imported`.`date` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `trade_cumulative`
--
ALTER TABLE `trade_cumulative`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `trade_records_imported`
--
ALTER TABLE `trade_records_imported`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `trade_cumulative`
--
ALTER TABLE `trade_cumulative`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `trade_records_imported`
--
ALTER TABLE `trade_records_imported`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
