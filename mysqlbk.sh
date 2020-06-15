#!/bin/bash

BACKUP_DIR=/home/yfwu/mysqlbackup
FILENAME=$(date +%Y-%m-%d_%H:%M:%S)
IP=localhost:3306
USER=apply
PASSWORD=zU84xxwwxx.09
DATABASENAME=applyproject

mysqldump -u$USER -p$PASSWORD DATABASENAME > $BACKUP_DIR/$FILENAME.sql

# 恢复
# mysql -u$USER -p$PASSWORD DATABASENAME < $BACKUP_DIR/$FILENAME.sql

echo "BK_END"
