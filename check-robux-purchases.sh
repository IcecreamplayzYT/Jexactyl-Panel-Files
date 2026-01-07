#!/bin/bash
ARTISAN_PATH="/var/www/jexactyl"
LOG_FILE="/var/www/jexactyl/storage/logs/robux-checker.log"

cd $ARTISAN_PATH

echo "Starting Robux purchase checker at $(date)" >> $LOG_FILE

while true; do
    php artisan robux:check-purchases >> $LOG_FILE 2>&1
    sleep 5
done