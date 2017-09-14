-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.27 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             8.3.0.4694
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for bloodbowl
CREATE DATABASE IF NOT EXISTS `bloodbowl` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `bloodbowl`;


-- Dumping structure for table bloodbowl.card
CREATE TABLE IF NOT EXISTS `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deck_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `aka` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `timing` text COLLATE utf8_unicode_ci NOT NULL,
  `effect` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_card` (`name`,`aka`,`deck_id`) USING BTREE,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.coach
CREATE TABLE IF NOT EXISTS `coach` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`email`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.deck
CREATE TABLE IF NOT EXISTS `deck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cost` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.inducement
CREATE TABLE IF NOT EXISTS `inducement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `max` tinyint(3) unsigned NOT NULL,
  `cost` smallint(6) NOT NULL,
  `race_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `race_id` (`race_id`),
  KEY `id` (`id`),
  CONSTRAINT `inducement_ibfk_1` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.match
CREATE TABLE IF NOT EXISTS `match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `season_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `team1_match_type_id` int(11) NOT NULL,
  `team2_match_type_id` int(11) NOT NULL,
  `team1_id` int(11) NOT NULL,
  `team2_id` int(11) NOT NULL,
  `team1_tv` smallint(5) unsigned NOT NULL,
  `team2_tv` smallint(5) unsigned NOT NULL,
  `team1_inducements` smallint(5) unsigned NOT NULL,
  `team2_inducements` smallint(5) unsigned NOT NULL,
  `team1_gate` tinyint(3) unsigned NOT NULL,
  `team2_gate` tinyint(3) unsigned NOT NULL,
  `team1_fame` tinyint(3) unsigned NOT NULL,
  `team2_fame` tinyint(3) unsigned NOT NULL,
  `team1_tds` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team2_tds` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team1_cas` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team2_cas` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team1_kills` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team2_kills` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `team1_winnings` tinyint(3) unsigned NOT NULL,
  `team2_winnings` tinyint(3) unsigned NOT NULL,
  `team1_exp_mistakes` tinyint(3) unsigned NOT NULL,
  `team2_exp_mistakes` tinyint(3) unsigned NOT NULL,
  `team1_ff` tinyint(3) unsigned NOT NULL,
  `team2_ff` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `season_id` (`season_id`),
  KEY `team1_id` (`team1_id`),
  KEY `team2_id` (`team2_id`),
  KEY `FK_match_match_type` (`team1_match_type_id`),
  KEY `FK_match_match_type_2` (`team2_match_type_id`),
  CONSTRAINT `FK_match_match_type` FOREIGN KEY (`team1_match_type_id`) REFERENCES `match_type` (`id`),
  CONSTRAINT `FK_match_match_type_2` FOREIGN KEY (`team2_match_type_id`) REFERENCES `match_type` (`id`),
  CONSTRAINT `match_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`),
  CONSTRAINT `match_ibfk_4` FOREIGN KEY (`team1_id`) REFERENCES `team` (`id`),
  CONSTRAINT `match_ibfk_5` FOREIGN KEY (`team2_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.match_inducement
CREATE TABLE IF NOT EXISTS `match_inducement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `inducement_id` int(11) NOT NULL,
  `amount` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_match_inducement` (`match_id`,`team_id`,`inducement_id`),
  KEY `id` (`id`),
  KEY `team_id` (`team_id`),
  KEY `inducement_id` (`inducement_id`),
  KEY `match_id` (`match_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.match_player
CREATE TABLE IF NOT EXISTS `match_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `match_id` int(11) NOT NULL,
  `miss_next_game` tinyint(1) unsigned DEFAULT NULL,
  `niggling_injury` tinyint(1) unsigned DEFAULT NULL,
  `movement_injury` tinyint(1) unsigned DEFAULT NULL,
  `strength_injury` tinyint(1) unsigned DEFAULT NULL,
  `agility_injury` tinyint(1) unsigned DEFAULT NULL,
  `armor_injury` tinyint(1) unsigned DEFAULT NULL,
  `interceptions` tinyint(3) unsigned DEFAULT NULL,
  `completions` tinyint(3) unsigned DEFAULT NULL,
  `touchdowns` tinyint(3) unsigned DEFAULT NULL,
  `casualties` tinyint(3) unsigned DEFAULT NULL,
  `kills` tinyint(3) unsigned DEFAULT NULL,
  `mvp` tinyint(1) unsigned DEFAULT NULL,
  `killed_by_player_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `match_id` (`match_id`),
  KEY `killed_by_player_id` (`killed_by_player_id`),
  KEY `id` (`id`),
  CONSTRAINT `match_player_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  CONSTRAINT `match_player_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`),
  CONSTRAINT `match_player_ibfk_3` FOREIGN KEY (`killed_by_player_id`) REFERENCES `player` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.match_purchase
CREATE TABLE IF NOT EXISTS `match_purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `amount` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_match_purchase` (`match_id`,`team_id`,`purchase_id`),
  KEY `id` (`id`),
  KEY `match_id` (`match_id`),
  KEY `team_id` (`team_id`),
  KEY `purchase_id` (`purchase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.match_type
CREATE TABLE IF NOT EXISTS `match_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.meta
CREATE TABLE IF NOT EXISTS `meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mkey` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_mkey` (`mkey`),
  KEY `id` (`id`),
  KEY `mkey` (`mkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player
CREATE TABLE IF NOT EXISTS `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` tinyint(3) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `team_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `miss_next_game` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `niggling_injury` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `movement_injuries` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `strength_injuries` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `agility_injuries` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `armor_injuries` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `interceptions` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `completions` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `touchdowns` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `casualties` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `kills` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `mvps` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `dead` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_player_name_per_team` (`name`,`team_id`) USING BTREE,
  KEY `id` (`id`),
  KEY `type_id` (`type_id`),
  KEY `team_id` (`team_id`),
  KEY `number` (`number`),
  KEY `name` (`name`),
  CONSTRAINT `player_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `player_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player_skill
CREATE TABLE IF NOT EXISTS `player_skill` (
  `player_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  UNIQUE KEY `unique_player_skill` (`player_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `player_skill_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  CONSTRAINT `player_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player_type
CREATE TABLE IF NOT EXISTS `player_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `movement` tinyint(3) unsigned NOT NULL,
  `strength` tinyint(3) unsigned NOT NULL,
  `agility` tinyint(3) unsigned NOT NULL,
  `armor` tinyint(3) unsigned NOT NULL,
  `star_player` tinyint(1) DEFAULT NULL,
  `race_id` int(11) NOT NULL,
  `value` smallint(6) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`race_id`),
  KEY `id` (`id`),
  KEY `race_id` (`race_id`),
  KEY `star_player` (`star_player`),
  CONSTRAINT `player_type_ibfk_1` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player_type_skill
CREATE TABLE IF NOT EXISTS `player_type_skill` (
  `player_type_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  UNIQUE KEY `player_id` (`player_type_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  KEY `player_type_id` (`player_type_id`),
  CONSTRAINT `player_type_skill_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `player_type_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player_type_skill_type_double
CREATE TABLE IF NOT EXISTS `player_type_skill_type_double` (
  `player_type_id` int(11) NOT NULL,
  `skill_type_id` int(11) NOT NULL,
  UNIQUE KEY `unique_player_type_skill_double` (`player_type_id`,`skill_type_id`),
  KEY `skill_type_id` (`skill_type_id`),
  KEY `player_type_id` (`player_type_id`),
  CONSTRAINT `player_type_skill_type_double_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `player_type_skill_type_double_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.player_type_skill_type_normal
CREATE TABLE IF NOT EXISTS `player_type_skill_type_normal` (
  `player_type_id` int(11) NOT NULL,
  `skill_type_id` int(11) NOT NULL,
  UNIQUE KEY `unique_player_type_skill_normal` (`player_type_id`,`skill_type_id`),
  KEY `skill_type_id` (`skill_type_id`),
  KEY `player_type_id` (`player_type_id`),
  CONSTRAINT `player_type_skill_type_normal_ibfk_1` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `player_type_skill_type_normal_ibfk_2` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.purchase
CREATE TABLE IF NOT EXISTS `purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cost` smallint(6) NOT NULL,
  `race_id` int(11) DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`race_id`) USING BTREE,
  KEY `id` (`id`),
  KEY `race_id` (`race_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.race
CREATE TABLE IF NOT EXISTS `race` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.season
CREATE TABLE IF NOT EXISTS `season` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `winner_team_id` int(11) DEFAULT NULL,
  `trophy_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`),
  KEY `trophy_id` (`trophy_id`),
  KEY `winner_team_id` (`winner_team_id`),
  CONSTRAINT `season_ibfk_1` FOREIGN KEY (`trophy_id`) REFERENCES `trophy` (`id`),
  CONSTRAINT `season_ibfk_2` FOREIGN KEY (`winner_team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.skill
CREATE TABLE IF NOT EXISTS `skill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `skill_type_id` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`),
  KEY `skill_type_id` (`skill_type_id`),
  CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`skill_type_id`) REFERENCES `skill_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.skill_type
CREATE TABLE IF NOT EXISTS `skill_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.team
CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `coach_id` int(11) NOT NULL,
  `race_id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `prev_team_id` int(11) DEFAULT NULL,
  `value` int(10) unsigned NOT NULL DEFAULT '0',
  `treasury` int(10) unsigned NOT NULL DEFAULT '0',
  `rerolls` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `fan_factor` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `assistant_coaches` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cheerleaders` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `apothecary` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_name_per_season` (`name`,`season_id`) USING BTREE,
  UNIQUE KEY `unique_prev_team_id` (`prev_team_id`),
  KEY `id` (`id`),
  KEY `coach_id` (`coach_id`),
  KEY `race_id` (`race_id`),
  KEY `season_id` (`season_id`),
  KEY `prev_team_id` (`prev_team_id`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `coach` (`id`),
  CONSTRAINT `team_ibfk_2` FOREIGN KEY (`race_id`) REFERENCES `race` (`id`),
  CONSTRAINT `team_ibfk_3` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.


-- Dumping structure for table bloodbowl.trophy
CREATE TABLE IF NOT EXISTS `trophy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `img` (`img`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
