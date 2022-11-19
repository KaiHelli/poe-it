CREATE DATABASE IF NOT EXISTS PoeItDB;

USE PoeItDB;

CREATE TABLE IF NOT EXISTS PublicPoem (
  poemID SERIAL,                      -- consecutively enumerated in dataset
  poemTitle VARCHAR(256) NOT NULL,    -- max. length in dataset: 245 char
  poemText VARCHAR(5120) NOT NULL,    -- max. length in dataset: 88699 char -> deleted all longer than the 0.95 quantil -> max. length: 4177 char
  poetName VARCHAR(64) NOT NULL,      -- max. length in dataset: 57 char
  PRIMARY KEY(poemID)
);

CREATE TABLE IF NOT EXISTS PublicPoemTags(
  poemID BIGINT UNSIGNED NOT NULL,    -- since poemID is of type SERIAL this must be BIGINT UNSIGNED NOT NULL
  tag VARCHAR(32) NOT NULL,           -- max. length in dataset: 27 char
  PRIMARY KEY(poemID, tag),
  FOREIGN KEY(poemID) REFERENCES PublicPoem(poemID)
      ON DELETE CASCADE               -- delete the tags if the corresponding poem is deleted
);

CREATE TABLE IF NOT EXISTS Role(
  roleID SERIAL,
  roleName VARCHAR(32) NOT NULL UNIQUE,  -- 32 characters sufficient?
  PRIMARY KEY(roleID)
);

CREATE TABLE IF NOT EXISTS User(
  userID SERIAL,
  displayname VARCHAR(20) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,                         -- 20 characters sufficient?
  password CHAR(96) NOT NULL,                                   -- argon2di produces 96 char output
  registrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- automatically adds the current datetime on insert
  roleID BIGINT UNSIGNED NOT NULL,                              -- was missing in our schema statements, but is necessary
  PRIMARY KEY(userID),
  FOREIGN KEY(roleID) REFERENCES Role(roleID)                   -- don't delete the user if the role is deleted, needs to be migrated before
);

CREATE TABLE IF NOT EXISTS PrivatePoem(
  poemID SERIAL,
  poemText VARCHAR(256) NOT NULL,                         -- 256 characters sufficient?
  userID BIGINT UNSIGNED NOT NULL,                        -- userID is of type SERIAL
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- automatically adds the current datetime on insert
  PRIMARY KEY(poemID),
  FOREIGN KEY(userID) REFERENCES User(userID)
      ON DELETE CASCADE                                   -- delete the tags if the corresponding user is deleted
);

CREATE TABLE IF NOT EXISTS PrivatePoemRating
(
    poemID BIGINT UNSIGNED NOT NULL,                                 -- poemID is of type SERIAL
    userID BIGINT UNSIGNED NOT NULL,                                 -- userID is of type SERIAL
    rating TINYINT(1)      NOT NULL,                                 -- allows [-128, 127], only {-1, 1} will be used
    CONSTRAINT c1_rating CHECK (rating = -1 OR rating = 1) ENFORCED, -- only allow -1 or 1 for the rating
    PRIMARY KEY (poemID, userID),
    FOREIGN KEY (poemID) REFERENCES PrivatePoem (poemID)
        ON DELETE CASCADE,                                           -- delete the rating if the corresponding poem is deleted
    FOREIGN KEY (userID) REFERENCES User (userID)
        ON DELETE CASCADE                                            -- delete the rating if the corresponding user is deleted
);

-- https://github.com/chill117/express-mysql-session#custom-database-table-schema
-- https://github.com/chill117/express-mysql-session/blob/master/schema.sql
CREATE TABLE IF NOT EXISTS Session(
  sessionID VARCHAR(128) NOT NULL UNIQUE,
  sessionData JSON NOT NULL,
  expires INT(11) UNSIGNED NOT NULL,
  startTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  userID BIGINT UNSIGNED NOT NULL,                         -- userID is of type SERIAL
  PRIMARY KEY(sessionID),
  FOREIGN KEY(userID) REFERENCES User(userID)
      ON DELETE CASCADE                                    -- delete the session if the corresponding user is deleted
);

CREATE TRIGGER AddUserID
BEFORE INSERT ON Session
FOR EACH ROW SET New.userID = NEW.sessionData->'$.userID';

CREATE TABLE IF NOT EXISTS UserFollowing(
  userID BIGINT UNSIGNED NOT NULL,                          -- userID is of type SERIAL
  followedUserID BIGINT UNSIGNED NOT NULL,                  -- userID is of type SERIAL
  PRIMARY KEY(userID, followedUserID),
  FOREIGN KEY(userID) REFERENCES User(userID)
      ON DELETE CASCADE,                                    -- delete the follow if the user following is deleted
  FOREIGN KEY(followedUserID) REFERENCES User(userID)
      ON DELETE CASCADE                                     -- delete the follow if the user that is followed is deleted
);

CREATE TABLE IF NOT EXISTS PrivatePoemFavorites(
  poemID BIGINT UNSIGNED NOT NULL,
  userID BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY(poemID, userID),
  FOREIGN KEY(poemID) REFERENCES PrivatePoem(poemID)
      ON DELETE CASCADE,                                    -- delete the favorite if the corresponding poem is deleted
  FOREIGN KEY(userID) REFERENCES User(userID)
      ON DELETE CASCADE                                     -- delete the favorite if the corresponding user is deleted
);

CREATE TABLE IF NOT EXISTS PrivatePoemReports(
  poemID BIGINT UNSIGNED NOT NULL,
  userID BIGINT UNSIGNED NOT NULL,
  reportText VARCHAR(256) NOT NULL,                         -- 256 characters sufficient?
  FOREIGN KEY(poemID) REFERENCES PrivatePoem(poemID)
      ON DELETE CASCADE,                                    -- delete the report if the reported poem is deleted
  FOREIGN KEY(userID) REFERENCES User(userID)
      ON DELETE CASCADE                                     -- delete the report if the reporting user is deleted
);

-- Initialize roles
INSERT INTO Role(roleID, roleName) VALUES
(1, 'Administrator'),
(2, 'General Poet');

-- Initialize administrative user
INSERT INTO User(userID, username, displayname, password, roleID) VALUES
(1, 'admin', 'admin', '$APP_ADMIN_HASH', 1);

-- Create role for SELECT privileges.
CREATE ROLE 'db_read';

-- Create role for INSERT, UPDATE, DELETE privileges.
CREATE ROLE 'db_write';

-- Grant the the SELECT privileges to its role.
GRANT SELECT
    ON PoeItDB.*
    TO 'db_read';

-- Grant the the INSERT, UPDATE, DELETE privileges to its role.
GRANT INSERT, UPDATE, DELETE
    ON PoeItDB.*
    TO 'db_write';

-- Initialize database backend user that can read and write on all tables.
CREATE USER 'api'@'%' IDENTIFIED BY '$MYSQL_API_PASSWORD';

-- Assign the roles to the backend user.
GRANT 'db_read', 'db_write'
    TO 'api'@'%';

-- Apply all roles by default to the user.
SET DEFAULT ROLE ALL TO
  'api'@'%';

-- Flush privileges so that they are in effect.
FLUSH PRIVILEGES;