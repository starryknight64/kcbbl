-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 10, 2017 at 03:49 AM
-- Server version: 5.5.27
-- PHP Version: 7.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bloodbowl`
--

-- --------------------------------------------------------

--
-- Table structure for table `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `deck_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `aka` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `timing` text COLLATE utf8_unicode_ci NOT NULL,
  `effect` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coach`
--

CREATE TABLE `coach` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deck`
--

CREATE TABLE `deck` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cost` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inducement`
--

CREATE TABLE `inducement` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `max` tinyint(3) UNSIGNED NOT NULL,
  `cost` smallint(6) NOT NULL,
  `race_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match`
--

CREATE TABLE `match` (
  `id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `match_type_id` int(11) NOT NULL,
  `team1_id` int(11) NOT NULL,
  `team2_id` int(11) NOT NULL,
  `team1_score` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `team2_score` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `team1_fame` tinyint(3) UNSIGNED NOT NULL,
  `team2_fame` tinyint(3) UNSIGNED NOT NULL,
  `team1_value` smallint(5) UNSIGNED NOT NULL,
  `team2_value` smallint(5) UNSIGNED NOT NULL,
  `team1_winnings` tinyint(3) UNSIGNED NOT NULL,
  `team2_winnings` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `match_type`
--

CREATE TABLE `match_type` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meta`
--

CREATE TABLE `meta` (
  `id` int(11) NOT NULL,
  `mkey` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE `player` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `team_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `miss_next_game` tinyint(1) NOT NULL DEFAULT '0',
  `niggling_injury` tinyint(1) NOT NULL DEFAULT '0',
  `movement_injuries` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `strength_injuries` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `agility_injuries` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `armor_injuries` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `interceptions` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `completions` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `touchdowns` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `casualties` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `kills` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `mvps` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `dead` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_report`
--

CREATE TABLE `player_report` (
  `id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `miss_next_game` tinyint(1) DEFAULT NULL,
  `niggling_injury` tinyint(1) DEFAULT NULL,
  `movement_injury` tinyint(1) DEFAULT NULL,
  `strength_injury` tinyint(1) DEFAULT NULL,
  `agility_injury` tinyint(1) DEFAULT NULL,
  `armor_injury` tinyint(1) DEFAULT NULL,
  `interceptions` tinyint(3) UNSIGNED DEFAULT NULL,
  `completions` tinyint(3) UNSIGNED DEFAULT NULL,
  `touchdowns` tinyint(3) UNSIGNED DEFAULT NULL,
  `casualties` tinyint(3) UNSIGNED DEFAULT NULL,
  `kills` tinyint(3) UNSIGNED DEFAULT NULL,
  `mvp` tinyint(1) DEFAULT NULL,
  `killed_by_player_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_skill`
--

CREATE TABLE `player_skill` (
  `player_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_type`
--

CREATE TABLE `player_type` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `movement` tinyint(3) UNSIGNED NOT NULL,
  `strength` tinyint(3) UNSIGNED NOT NULL,
  `agility` tinyint(3) UNSIGNED NOT NULL,
  `armor` tinyint(3) UNSIGNED NOT NULL,
  `star_player` tinyint(1) DEFAULT NULL,
  `race_id` int(11) NOT NULL,
  `value` smallint(6) NOT NULL,
  `description` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_type_skill`
--

CREATE TABLE `player_type_skill` (
  `player_type_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_type_skill_type_double`
--

CREATE TABLE `player_type_skill_type_double` (
  `player_type_id` int(11) NOT NULL,
  `skill_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `player_type_skill_type_normal`
--

CREATE TABLE `player_type_skill_type_normal` (
  `player_type_id` int(11) NOT NULL,
  `skill_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cost` smallint(6) NOT NULL,
  `race_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `race`
--

CREATE TABLE `race` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `season`
--

CREATE TABLE `season` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `winner_team_id` int(11) DEFAULT NULL,
  `trophy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `skill_type_id` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skill_type`
--

CREATE TABLE `skill_type` (
  `id` int(11) NOT NULL,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `coach_id` int(11) NOT NULL,
  `race_id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `prev_team_id` int(11) DEFAULT NULL,
  `value` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `treasury` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `rerolls` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `fan_factor` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `assistant_coaches` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `cheerleaders` tinyint(3) UNSIGNED NOT NULL DEFAULT '0',
  `apothecary` tinyint(1) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trophy`
--

CREATE TABLE `trophy` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`aka`) USING BTREE;

--
-- Indexes for table `coach`
--
ALTER TABLE `coach`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`email`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `deck`
--
ALTER TABLE `deck`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `inducement`
--
ALTER TABLE `inducement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `race_id` (`race_id`);

--
-- Indexes for table `match`
--
ALTER TABLE `match`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `season_id` (`season_id`),
  ADD KEY `match_type_id` (`match_type_id`),
  ADD KEY `team1_id` (`team1_id`),
  ADD KEY `team2_id` (`team2_id`);

--
-- Indexes for table `match_type`
--
ALTER TABLE `match_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `meta`
--
ALTER TABLE `meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mkey` (`mkey`);

--
-- Indexes for table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`type_id`,`team_id`) USING BTREE,
  ADD KEY `id` (`id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `team_id` (`team_id`);

--
-- Indexes for table `player_report`
--
ALTER TABLE `player_report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `player_id` (`player_id`),
  ADD KEY `match_id` (`match_id`),
  ADD KEY `killed_by_player_id` (`killed_by_player_id`);

--
-- Indexes for table `player_skill`
--
ALTER TABLE `player_skill`
  ADD UNIQUE KEY `player_id` (`player_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `player_type`
--
ALTER TABLE `player_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`race_id`),
  ADD KEY `id` (`id`),
  ADD KEY `race_id` (`race_id`);

--
-- Indexes for table `player_type_skill`
--
ALTER TABLE `player_type_skill`
  ADD UNIQUE KEY `player_id` (`player_type_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `player_type_skill_type_double`
--
ALTER TABLE `player_type_skill_type_double`
  ADD UNIQUE KEY `player_type_id` (`player_type_id`,`skill_type_id`),
  ADD KEY `skill_type_id` (`skill_type_id`);

--
-- Indexes for table `player_type_skill_type_normal`
--
ALTER TABLE `player_type_skill_type_normal`
  ADD UNIQUE KEY `player_type_id` (`player_type_id`,`skill_type_id`),
  ADD KEY `skill_type_id` (`skill_type_id`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `race`
--
ALTER TABLE `race`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `season`
--
ALTER TABLE `season`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id` (`id`),
  ADD KEY `trophy_id` (`trophy_id`),
  ADD KEY `winner_team_id` (`winner_team_id`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `id` (`id`),
  ADD KEY `skill_type_id` (`skill_type_id`);

--
-- Indexes for table `skill_type`
--
ALTER TABLE `skill_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`season_id`) USING BTREE,
  ADD KEY `id` (`id`),
  ADD KEY `coach_id` (`coach_id`),
  ADD KEY `race_id` (`race_id`),
  ADD KEY `season_id` (`season_id`);

--
-- Indexes for table `trophy`
--
ALTER TABLE `trophy`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `img` (`img`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;
--
-- AUTO_INCREMENT for table `coach`
--
ALTER TABLE `coach`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `deck`
--
ALTER TABLE `deck`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `inducement`
--
ALTER TABLE `inducement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `match`
--
ALTER TABLE `match`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `match_type`
--
ALTER TABLE `match_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `meta`
--
ALTER TABLE `meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `player`
--
ALTER TABLE `player`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `player_report`
--
ALTER TABLE `player_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `player_type`
--
ALTER TABLE `player_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=274;
--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;
--
-- AUTO_INCREMENT for table `race`
--
ALTER TABLE `race`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `season`
--
ALTER TABLE `season`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
--
-- AUTO_INCREMENT for table `skill_type`
--
ALTER TABLE `skill_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `trophy`
--
ALTER TABLE `trophy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `inducement`
--
ALTER TABLE `inducement`
  ADD CONSTRAINT `inducement_ibfk_1` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`);

--
-- Constraints for table `match`
--
ALTER TABLE `match`
  ADD CONSTRAINT `match_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`),
  ADD CONSTRAINT `match_ibfk_3` FOREIGN KEY (`match_type_id`) REFERENCES `match_type` (`id`),
  ADD CONSTRAINT `match_ibfk_4` FOREIGN KEY (`team1_id`) REFERENCES `team` (`id`),
  ADD CONSTRAINT `match_ibfk_5` FOREIGN KEY (`team2_id`) REFERENCES `team` (`id`);

--
-- Constraints for table `player`
--
ALTER TABLE `player`
  ADD CONSTRAINT `player_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`),
  ADD CONSTRAINT `player_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `player_type` (`id`);

--
-- Constraints for table `player_report`
--
ALTER TABLE `player_report`
  ADD CONSTRAINT `player_report_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  ADD CONSTRAINT `player_report_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`),
  ADD CONSTRAINT `player_report_ibfk_3` FOREIGN KEY (`killed_by_player_id`) REFERENCES `player` (`id`);

--
-- Constraints for table `player_skill`
--
ALTER TABLE `player_skill`
  ADD CONSTRAINT `player_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`),
  ADD CONSTRAINT `player_skill_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`);

--
-- Constraints for table `player_type`
--
ALTER TABLE `player_type`
  ADD CONSTRAINT `player_type_ibfk_1` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`);

--
-- Constraints for table `player_type_skill`
--
ALTER TABLE `player_type_skill`
  ADD CONSTRAINT `player_type_skill_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  ADD CONSTRAINT `player_type_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`);

--
-- Constraints for table `player_type_skill_type_double`
--
ALTER TABLE `player_type_skill_type_double`
  ADD CONSTRAINT `player_type_skill_type_double_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  ADD CONSTRAINT `player_type_skill_type_double_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`);

--
-- Constraints for table `player_type_skill_type_normal`
--
ALTER TABLE `player_type_skill_type_normal`
  ADD CONSTRAINT `player_type_skill_type_normal_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  ADD CONSTRAINT `player_type_skill_type_normal_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`);

--
-- Constraints for table `season`
--
ALTER TABLE `season`
  ADD CONSTRAINT `season_ibfk_1` FOREIGN KEY (`trophy_id`) REFERENCES `trophy` (`id`),
  ADD CONSTRAINT `season_ibfk_2` FOREIGN KEY (`winner_team_id`) REFERENCES `team` (`id`);

--
-- Constraints for table `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`);

--
-- Constraints for table `team`
--
ALTER TABLE `team`
  ADD CONSTRAINT `team_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `coach` (`id`),
  ADD CONSTRAINT `team_ibfk_2` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`),
  ADD CONSTRAINT `team_ibfk_3` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
