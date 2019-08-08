-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.27 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for kcbbl
DROP DATABASE IF EXISTS `kcbbl`;
CREATE DATABASE IF NOT EXISTS `kcbbl` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `kcbbl`;

-- Dumping structure for table kcbbl.card
DROP TABLE IF EXISTS `card`;
CREATE TABLE IF NOT EXISTS `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deck_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `aka` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `timing` text COLLATE utf8_unicode_ci NOT NULL,
  `effect` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_card` (`name`,`aka`,`deck_id`) USING BTREE,
  KEY `id` (`id`),
  KEY `card_deck_id` (`deck_id`),
  CONSTRAINT `card_deck_id` FOREIGN KEY (`deck_id`) REFERENCES `deck` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.coach
DROP TABLE IF EXISTS `coach`;
CREATE TABLE IF NOT EXISTS `coach` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique name` (`name`),
  UNIQUE KEY `unique email` (`email`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.deck
DROP TABLE IF EXISTS `deck`;
CREATE TABLE IF NOT EXISTS `deck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `cost` smallint(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.inducement
DROP TABLE IF EXISTS `inducement`;
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

-- Dumping structure for table kcbbl.match
DROP TABLE IF EXISTS `match`;
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
  `team1_inducements` smallint(5) unsigned NOT NULL COMMENT 'Not including Petty Cash',
  `team2_inducements` smallint(5) unsigned NOT NULL COMMENT 'Not including Petty Cash',
  `team1_petty_cash` smallint(5) unsigned NOT NULL DEFAULT '0',
  `team2_petty_cash` smallint(5) unsigned NOT NULL DEFAULT '0',
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
  `team1_ff` tinyint(3) NOT NULL,
  `team2_ff` tinyint(3) NOT NULL,
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

-- Dumping structure for table kcbbl.match_inducement
DROP TABLE IF EXISTS `match_inducement`;
CREATE TABLE IF NOT EXISTS `match_inducement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `inducement_id` int(11) DEFAULT NULL,
  `amount` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `player_type_id` int(11) DEFAULT NULL,
  `deck_id` int(11) DEFAULT NULL,
  `card_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_match_inducement` (`match_id`,`team_id`,`inducement_id`),
  UNIQUE KEY `unique_match_player_type` (`match_id`,`team_id`,`player_type_id`),
  UNIQUE KEY `unique_match_deck_card_id` (`match_id`,`team_id`,`deck_id`,`card_id`),
  KEY `id` (`id`),
  KEY `team_id` (`team_id`),
  KEY `inducement_id` (`inducement_id`),
  KEY `match_id` (`match_id`),
  KEY `player_type_id` (`player_type_id`),
  KEY `deck_id` (`deck_id`),
  KEY `card_id` (`card_id`),
  CONSTRAINT `match_inducement_card_id` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`),
  CONSTRAINT `match_inducement_deck_id` FOREIGN KEY (`deck_id`) REFERENCES `deck` (`id`),
  CONSTRAINT `match_inducement_inducement_id` FOREIGN KEY (`inducement_id`) REFERENCES `inducement` (`id`),
  CONSTRAINT `match_inducement_match_id` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`),
  CONSTRAINT `match_inducement_player_type_id` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `match_inducement_team_id` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.match_player
DROP TABLE IF EXISTS `match_player`;
CREATE TABLE IF NOT EXISTS `match_player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
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
  `fouls` tinyint(3) unsigned DEFAULT NULL,
  `mvp` tinyint(1) unsigned DEFAULT NULL,
  `dead` tinyint(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `match_id` (`match_id`),
  KEY `id` (`id`),
  CONSTRAINT `match_player_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  CONSTRAINT `match_player_ibfk_2` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.match_player_skill
DROP TABLE IF EXISTS `match_player_skill`;
CREATE TABLE IF NOT EXISTS `match_player_skill` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `player_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `match` (`match_id`),
  KEY `player` (`player_id`),
  KEY `skill` (`skill_id`),
  KEY `id` (`id`),
  CONSTRAINT `match` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`),
  CONSTRAINT `player` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`),
  CONSTRAINT `skill` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.match_purchase
DROP TABLE IF EXISTS `match_purchase`;
CREATE TABLE IF NOT EXISTS `match_purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `match_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `amount` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `player_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_match_purchase` (`match_id`,`team_id`,`purchase_id`),
  UNIQUE KEY `unique_match_player_type` (`match_id`,`team_id`,`player_type_id`),
  KEY `id` (`id`),
  KEY `match_id` (`match_id`),
  KEY `team_id` (`team_id`),
  KEY `purchase_id` (`purchase_id`),
  KEY `player_type_id` (`player_type_id`),
  CONSTRAINT `match_purchase_match_id` FOREIGN KEY (`match_id`) REFERENCES `match` (`id`),
  CONSTRAINT `match_purchase_player_type_id` FOREIGN KEY (`player_type_id`) REFERENCES `player_type` (`id`),
  CONSTRAINT `match_purchase_purchase_id` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`),
  CONSTRAINT `match_purchase_team_id` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.match_type
DROP TABLE IF EXISTS `match_type`;
CREATE TABLE IF NOT EXISTS `match_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.meta
DROP TABLE IF EXISTS `meta`;
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

-- Dumping structure for table kcbbl.player
DROP TABLE IF EXISTS `player`;
CREATE TABLE IF NOT EXISTS `player` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` tinyint(3) unsigned NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `team_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `prev_player_id` int(11) DEFAULT NULL,
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

-- Dumping structure for table kcbbl.player_skill
DROP TABLE IF EXISTS `player_skill`;
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

-- Dumping structure for table kcbbl.player_type
DROP TABLE IF EXISTS `player_type`;
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

-- Dumping structure for table kcbbl.player_type_skill
DROP TABLE IF EXISTS `player_type_skill`;
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

-- Dumping structure for table kcbbl.player_type_skill_type_double
DROP TABLE IF EXISTS `player_type_skill_type_double`;
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

-- Dumping structure for table kcbbl.player_type_skill_type_normal
DROP TABLE IF EXISTS `player_type_skill_type_normal`;
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

-- Dumping structure for table kcbbl.purchase
DROP TABLE IF EXISTS `purchase`;
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

-- Dumping structure for table kcbbl.race
DROP TABLE IF EXISTS `race`;
CREATE TABLE IF NOT EXISTS `race` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.season
DROP TABLE IF EXISTS `season`;
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

-- Dumping structure for table kcbbl.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.skill
DROP TABLE IF EXISTS `skill`;
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

-- Dumping structure for table kcbbl.skill_type
DROP TABLE IF EXISTS `skill_type`;
CREATE TABLE IF NOT EXISTS `skill_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table kcbbl.team
DROP TABLE IF EXISTS `team`;
CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `coach_id` int(11) NOT NULL,
  `race_id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `prev_team_id` int(11) DEFAULT NULL,
  `value` smallint(5) unsigned NOT NULL DEFAULT '0',
  `treasury` smallint(5) unsigned NOT NULL DEFAULT '0',
  `rerolls` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `fan_factor` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `assistant_coaches` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `cheerleaders` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `apothecary` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `halfling_master_chef` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `bribes` tinyint(3) unsigned NOT NULL DEFAULT '0',
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

-- Dumping structure for table kcbbl.trophy
DROP TABLE IF EXISTS `trophy`;
CREATE TABLE IF NOT EXISTS `trophy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
