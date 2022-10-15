CREATE DATABASE IF NOT EXISTS PoeItDB;

USE PoeItDB;

CREATE TABLE IF NOT EXISTS PublicPoem (
  poemID SERIAL,                      -- consecutively enumerated in dataset
  poemTitle VARCHAR(256) NOT NULL,    -- max. length in dataset: 245 char
  poemText VARCHAR(5120) NOT NULL,   -- max. length in dataset: 88699 char -> deleted all longer than the 0.95 quantile now -> max. length: 4177
  poetName VARCHAR(64) NOT NULL,      -- max. length in dataset: 57 char
  PRIMARY KEY(poemID)
);

CREATE TABLE IF NOT EXISTS PublicPoemTags(
  poemID BIGINT UNSIGNED NOT NULL,    -- poemID is of type SERIAL
  tag VARCHAR(32) NOT NULL,           -- max. length in dataset: 27 char
  PRIMARY KEY(poemID, tag),
  FOREIGN KEY(poemID) REFERENCES PublicPoem(poemID)
);

CREATE TABLE IF NOT EXISTS Role(
  roleID SERIAL,
  roleName VARCHAR(32) NOT NULL UNIQUE,  -- 32 characters sufficient?
  PRIMARY KEY(roleID)
);

CREATE TABLE IF NOT EXISTS User(
  userID SERIAL,
  username VARCHAR(20) NOT NULL UNIQUE,                         -- 20 characters sufficient?
  password CHAR(96) NOT NULL,                                   -- argon2di produces 96 char output by using default settings
  -- passwordSalt CHAR(X),                                      -- not needed anymore since argon2 stores the used salt in the password hash
  registrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- automatically adds the current datetime on insert
  roleID BIGINT UNSIGNED NOT NULL,                              -- was missing in our schema statements, but is necessary
  PRIMARY KEY(userID),
  FOREIGN KEY(roleID) REFERENCES Role(roleID)
);

CREATE TABLE IF NOT EXISTS PrivatePoem(
  poemID SERIAL,
  poemText VARCHAR(256) NOT NULL,                         -- 256 characters sufficient?
  userID BIGINT UNSIGNED NOT NULL,                        -- since userID is of type SERIAL this must be BIGINT UNSIGNED NOT NULL
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- automatically adds the current datetime on insert
  PRIMARY KEY(poemID),
  FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE IF NOT EXISTS PrivatePoemRating(
  poemID BIGINT UNSIGNED NOT NULL,                                  -- poemID is of type SERIAL
  userID BIGINT UNSIGNED NOT NULL,                                  -- userID is of type SERIAL
  rating TINYINT(1) NOT NULL,                                       -- allows [-128, 127], only {-1, 1} will be used
  CONSTRAINT c1_rating CHECK(rating = -1 OR rating = 1) ENFORCED,   -- only allow -1 or 1 for the rating
  PRIMARY KEY(poemID, userID),                                      -- was missing in our schema statements, but is necessary
  FOREIGN KEY(poemID) REFERENCES PrivatePoem(poemID),
  FOREIGN KEY(userID) REFERENCES User(userID)
);

-- https://github.com/chill117/express-mysql-session#custom-database-table-schema
-- https://github.com/chill117/express-mysql-session/blob/master/schema.sql
CREATE TABLE IF NOT EXISTS Session(
  sessionID VARCHAR(128) NOT NULL UNIQUE,
  sessionData JSON NOT NULL,
  expires INT(11) UNSIGNED NOT NULL,
  startTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userID BIGINT UNSIGNED NOT NULL,  -- userID is of type SERIAL
  PRIMARY KEY(sessionID),
  FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TRIGGER AddUserID
BEFORE INSERT ON Session
FOR EACH ROW SET New.userID = NEW.sessionData->'$.userID';


CREATE TABLE IF NOT EXISTS UserFollowing(
  userID BIGINT UNSIGNED NOT NULL,          -- userID is of type SERIAL
  followedUserID BIGINT UNSIGNED NOT NULL,  -- userID is of type SERIAL
  PRIMARY KEY(userID, followedUserID),
  FOREIGN KEY(userID) REFERENCES User(userID),
  FOREIGN KEY(followedUserID) REFERENCES User(userID)
);

CREATE TABLE IF NOT EXISTS PrivatePoemFavorites(
  poemID BIGINT UNSIGNED NOT NULL,
  userID BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY(poemID, userID),
  FOREIGN KEY(poemID) REFERENCES PrivatePoem(poemID),
  FOREIGN KEY(userID) REFERENCES User(userID)
);

CREATE TABLE IF NOT EXISTS PrivatePoemReports(
  poemID BIGINT UNSIGNED NOT NULL,
  userID BIGINT UNSIGNED NOT NULL,
  reportText VARCHAR(256) NOT NULL,     -- 256 characters sufficient?
  FOREIGN KEY(poemID) REFERENCES PrivatePoem(poemID),
  FOREIGN KEY(userID) REFERENCES User(userID)
);

-- Initialize roles
INSERT INTO Role(roleID, roleName) VALUES
(1, 'Administrator'),
(2, 'General Poet');

-- Initialize administrative user
INSERT INTO User(userID, username, password, roleID) VALUES
(1, 'admin', '$APP_ADMIN_HASH', 1);
