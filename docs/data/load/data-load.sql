USE redbone1_snowbird;

-- TRUNCATE TABLE users;

LOAD DATA INFILE '/Users/jbuckner/Work/redbone/code/nb/mtb/docs/data/load/users-bulk.csv' INTO TABLE `users`
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;
  
COMMIT;
