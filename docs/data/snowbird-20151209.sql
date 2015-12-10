CREATE DATABASE  IF NOT EXISTS `redbone1_snowbird` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `redbone1_snowbird`;
-- MySQL dump 10.13  Distrib 5.6.17, for osx10.6 (i386)
--
-- Host: localhost    Database: redbone1_snowbird
-- ------------------------------------------------------
-- Server version	5.6.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  `gps_latitude` varchar(45) DEFAULT NULL,
  `gps_longitude` varchar(45) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Jungle Habitat','Jungle Habitat Main Entrace','PRIMARY','0','162-198 Airport Rd','West Milford','NJ','07480','41.130092','-74.340940',1),(2,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Ringwood State Park','Ringwood Lot C','PRIMARY','0','1304 Sloatsburg Rd','Ringwood','NJ','07456','41.119109','-74.238765',2),(3,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Ringwood State Park','Ryerson Middle School','ALTERNATE','0','130 Valley Rd','Ringwood','NJ','07456','41.107848','-74.243995',2),(4,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Ramapo State Forest','Top of Skyline','PRIMARY','0','174-194 Skyline Dr','Oakland','NJ','07436','41.047523','-74.251516',3);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ads`
--

DROP TABLE IF EXISTS `ads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `priority` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ads`
--

LOCK TABLES `ads` WRITE;
/*!40000 ALTER TABLE `ads` DISABLE KEYS */;
INSERT INTO `ads` VALUES (1,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,1,'DT Swiss','DT Swiss','https://www.dtswiss.com','DT Swiss','/images/ads/dtswiss.jpg','Standard',0,0,0),(2,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,2,'ENVE','ENVE','http://enve.com','ENVE','/images/ads/enve.jpg','Standard',0,0,1),(3,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,3,'e*thirteen','e*thirteen','http://bythehive.com/e-thirteen/','e*thirteen','/images/ads/ethirteen.jpg','Standard',0,0,2),(4,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,4,'Fox','Fox','http://www.ridefox.com','Fox','/images/ads/fox.jpg','Standard',0,0,3),(5,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,5,'Marin','Marin','https://www.marinbikes.com','Marin','/images/ads/marin.jpg','Standard',0,1,0),(6,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,6,'MRP','MRP','http://www.mrpbike.com','MRP','/images/ads/mrp.jpg','Standard',0,1,1),(7,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,7,'Norco','Norco','https://www.norco.com','Norco','/images/ads/norco.jpg','Standard',0,1,2),(8,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,8,'Pivot','Pivot','https://www.pivotcycles.com','Pivot','/images/ads/pivot.jpg','Standard',0,1,3),(9,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,9,'Bell','Bell','https://www.bellhelmets.com/cycling/','Bell','/images/ads/bell.jpg','Standard',0,0,4),(10,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,10,'Boa','Boa','http://www.boatechnology.com/products/cycling','Boa','/images/ads/boa.jpg','Standard',0,0,5),(11,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,11,'Clubride','Clubride','http://www.clubrideapparel.com','Clubride','/images/ads/clubride.jpg','Standard',0,0,6),(12,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,12,'Canari','Canari','http://www.canari.com','Canari','/images/ads/canari.jpg','Standard',0,0,7),(13,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,13,'Ergon','Ergon','http://www.ergon-bike.com/us/en/home','Ergon','/images/ads/ergon.jpg','Standard',0,0,8),(14,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,14,'Evoc','Evoc','http://www.evocsports.com','Evoc','/images/ads/evoc.jpg','Standard',0,0,9),(15,'2015-11-23 00:00:00','2015-11-23 00:00:00',1,15,'Kali','Kali','http://www.kaliprotectives.com','Kali','/images/ads/kali.jpg','Standard',0,0,10),(16,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,16,'Leatt','Leatt','http://www.leatt.com','Leatt','/images/ads/leatt.jpg','Standard',0,1,4),(17,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,17,'Lizard Skins','Lizard Skins','http://lizardskins.com','Lizard Skins','/images/ads/lizardskins.jpg','Standard',0,1,5),(18,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,18,'Lupine','Lupine','http://www.lupinenorthamerica.com','Lupine','/images/ads/lupine.jpg','Standard',0,1,6),(19,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,19,'Magura','Magura','http://www.magura.com/en/bike/bike.html','Magura','/images/ads/magura.jpg','Standard',0,1,7),(20,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,20,'Nox Composites','Nox Composites','http://www.noxcomposites.com','Nox Composites','/images/ads/nox.jpg','Standard',0,1,8),(21,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,21,'Rotor Components','Rotor Components','http://rotorbike.com','Rotor Coponents','/images/ads/rotor.jpg','Standard',0,1,9),(22,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,22,'SKS Germany','SKS Germany','http://www.sks-germany.com/en/','SKS Germany','/images/ads/sks.jpg','Standard',0,1,10),(23,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,23,'Surface 604','Surface 604','https://www.surface604.com','Surface 604','/images/ads/surface604.jpg','Standard',0,1,11),(24,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,24,'Swagman','Swagman','http://www.swagman.net','Swagman','/images/ads/swagman.jpg','Standard',0,0,11),(25,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,25,'Vittoria Off Road','Vittoria Off Road','http://www.vittoria.com/tires/off-road-tire/','Vittoria Off Road','/images/ads/vittoria-mtb.jpg','Standard',0,0,12),(26,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,25,'Vittoria Road','Vittoria Road','http://www.vittoria.com/tires/road-tire/','Vittoria Road','/images/ads/vittoria-rbr.jpg','Standard',0,1,12),(27,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,26,'Voler','Voler','http://www.voler.com','Voler','/images/ads/voler.jpg','Standard',0,1,13),(28,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,27,'White Lightning','White Lightning','http://www.whitelightningco.com','White Lightning','/images/ads/whitelightning.jpg','Standard',0,0,13),(29,'2015-11-24 00:00:00','2015-11-24 00:00:00',1,28,'X Fusion','X Fusion','http://www.xfusionshox.com','X Fusion','/images/ads/xfusion.jpg','Standard',0,0,NULL);
/*!40000 ALTER TABLE `ads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `contact_primary` int(11) DEFAULT NULL,
  `contact_secondary` int(11) DEFAULT NULL,
  `contact_initiated` datetime DEFAULT NULL,
  `contact_last` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `clique_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (1,'2015-11-25 00:00:00','2015-11-25 00:00:00',1,1,4,0),(2,'2015-11-25 00:00:00','2015-11-25 00:00:00',1,1,5,0),(3,'2015-11-25 00:00:00','2015-11-25 00:00:00',1,1,6,0);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (1,'2015-11-04 00:00:00','2015-11-04 00:00:00',1,1,1,'OWNER'),(2,'2015-11-04 00:00:00','2015-11-04 00:00:00',1,1,2,'DEPUTY'),(3,'2015-11-04 00:00:00','2015-11-04 00:00:00',1,1,5,'MEMBER');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `deputy` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `join` varchar(45) DEFAULT NULL,
  `locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'2015-11-03 00:00:00','2015-11-03 00:00:00',1,'The Boys','Grateful Dead 70\'s line up',1,2,'PRIVATE','0',1);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_resources`
--

DROP TABLE IF EXISTS `location_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `url` varchar(45) DEFAULT NULL,
  `locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_resources`
--

LOCK TABLES `location_resources` WRITE;
/*!40000 ALTER TABLE `location_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `location_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `owner` varchar(45) DEFAULT NULL,
  `steward` varchar(45) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Jungle Habitat','Jungle Habitat Mountain Bike Park',NULL,NULL,1,'OPEN'),(2,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Ringwood State Park','Ringwood State Park',NULL,NULL,2,'OPEN'),(3,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'Ramapo State Park','Ramapo State Park',NULL,NULL,4,'OPEN');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ride_resources`
--

DROP TABLE IF EXISTS `ride_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ride_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `url` varchar(45) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ride_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ride_resources`
--

LOCK TABLES `ride_resources` WRITE;
/*!40000 ALTER TABLE `ride_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `ride_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riders`
--

DROP TABLE IF EXISTS `riders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `riders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `ride_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `rsvp` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `complete` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riders`
--

LOCK TABLES `riders` WRITE;
/*!40000 ALTER TABLE `riders` DISABLE KEYS */;
INSERT INTO `riders` VALUES (1,'2015-11-05 00:00:00','2015-11-05 00:00:00',1,1,1,1,1,'ON TIME',0,-1,NULL),(2,'2015-11-05 00:00:00','2015-11-05 00:00:00',1,1,2,1,1,'ON TIME',0,-1,NULL),(3,'2015-11-05 00:00:00','2015-11-05 00:00:00',1,1,5,1,1,'ON TIME',0,-1,NULL),(4,'2015-11-05 00:00:00','2015-11-05 00:00:00',1,1,4,0,0,'N/A',0,-1,NULL),(5,'2015-11-05 00:00:00','2015-11-05 00:00:00',1,1,3,0,0,'N/A',0,-1,NULL);
/*!40000 ALTER TABLE `riders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rides`
--

DROP TABLE IF EXISTS `rides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `location_id` varchar(45) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `join` varchar(45) DEFAULT NULL,
  `tempo` varchar(45) DEFAULT NULL,
  `drop` int(11) DEFAULT NULL,
  `public` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rides`
--

LOCK TABLES `rides` WRITE;
/*!40000 ALTER TABLE `rides` DISABLE KEYS */;
INSERT INTO `rides` VALUES (1,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'White Up and Down','Ride White up and down and as much as possible in 2 hours',1,1,'2',2,'2015-11-06','09:00 AM','ON TIME','0','Medium',0,1),(2,'2015-11-03 00:00:00','2015-11-03 00:00:00',1,'Perimeter Loop','Ride AS -> Warthog -> Otter -> Tanks -> Cages -> Tiger -> Boon -> JYD -> DTH -> Boulderdash -> LS',2,2,'1',1,'2015-11-12','11:15 AM','ON TIME','1','Race',1,NULL);
/*!40000 ALTER TABLE `rides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `user_name_internal` varchar(45) DEFAULT NULL,
  `user_name_external` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `password` char(32) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `skill` varchar(45) DEFAULT NULL,
  `experience` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `guide` int(11) DEFAULT NULL,
  `salt` char(32) DEFAULT NULL,
  `viewable` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'jg','garciaje','Jerry','Garcia','68f085701bc1648c83b6c2cbd74ca439',1,'jg@dead.net','Expert','10','Agressive',0,'Y4vE9hKbaBh8eD3SZtFo3SXsPnrTEMUy',1),(2,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'bw','weirbo','Bob','Weir','fcbf6ca12bf153406d27b7fc7118ecd2',1,'bw@dead.net','Advanced','10','Mellow',0,'RTzZrZf4lKcJffgqnhoLqaCTsrP5/Del',1),(3,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'pl','leshph','Phil','Lesh','test',1,'pl@dead.net','Advanced','15','Mellow',1,NULL,1),(4,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'kg','godcheke','Keith','Godcheaux','test',1,'kg@dead.net','Advanced','8','Moderate',0,NULL,0),(5,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'dg','godchedo','Donna Jean','Godcheaux','test',1,'dg@dead.net','Intermediate','5','Steady',0,NULL,1),(6,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'mh','hartmi','Mickey','Hart','test',1,'mh@dead.net','Intermediate','12','Steady',0,NULL,1),(7,'2015-11-02 00:00:00','2015-11-02 00:00:00',1,'bk','kreutzbi','Bill','Kreutzman','test',1,'bk@dead.net','Advanced','15','Mellow',0,NULL,1),(8,'2015-12-08 00:00:00','2015-12-08 00:00:00',1,NULL,NULL,NULL,NULL,'44c55d5d4eeb642872da7ba80425b615',NULL,'test@test.com',NULL,NULL,NULL,NULL,'pnnhv/7LCqV1bcq2qRaMHCUVMh4DWNJR',1),(9,'2015-12-08 00:00:00','2015-12-08 00:00:00',1,NULL,NULL,NULL,NULL,'ce1af3bf6ed5c1931d447d1060f560bc',NULL,'test1@test.com',NULL,NULL,NULL,NULL,'AVldkYYGbfeoU+QDftUIHI3mAXgHEK9a',1),(10,'2015-12-08 00:00:00','2015-12-08 00:00:00',1,NULL,NULL,NULL,NULL,'9cc60ad001ac320e7b6a2b3325f9ec23',NULL,'test2@test.com',NULL,NULL,NULL,NULL,'BZgZhAt7HsLT0hNwcQDwmCtpWop00NyK',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-12-09  8:00:43
