#!/bin/bash

BACKUP_DIR=/home/yfwu/mysqlbackup
FILENAME=$(date +%Y-%m-%d_%H:%M:%S)
IP=localhost:3306
USER=apply
PASSWORD=zU84xxwwxx.09
DATABASENAME=applyproject

mysqldump -u$USER -p$PASSWORD $DATABASENAME > $BACKUP_DIR/$FILENAME.sql

# Restore
# mysql -u$USER -p$PASSWORD $DATABASENAME < $BACKUP_DIR/$FILENAME.sql

PICFILENAME=avatar-$(date +%Y-%m-%d_%H-%M-%S) # tar does not support : in filename
tar -czvf $BACKUP_DIR/$PICFILENAME.tar.gz -C /home/yfwu/applyProject/.tmp/public/public/avatars/ .

# Uncompress
# tar xvfz <filename>

echo "BK_END"
