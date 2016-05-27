#!/bin/bash
while true
do
	_time=`date`
	
	A=`ps aux | grep sclient.js | grep -v "grep" | wc -l`

	_cnum=15
	_crash=$[$_cnum - $A]

	if [ $_crash -gt 0 ]; then
       	 	echo "$_time ----  $_crash Clients Crashed! Try Restart!" >> /data/danmaku/logs/daemon.log
        	for i in $(seq $_crash);
        	do
                	nohup /usr/local/node/bin/node /data/danmaku/task/sclient.js  >> /data/danmaku/logs/sclient.log 2>&1 &
        	done
	else
        	echo "$_time ---- Clients Exists!" >> /data/danmaku/logs/daemon.log
	fi
	

	A=`ps aux | grep app.js | grep -v "grep" | wc -l`
	
	if [ $A -lt 1 ]; then
		echo "$_time ---- App Crashed! Try Restart!" >> /data/danmaku/logs/daemon.log
		nohup /usr/local/node/bin/node /data/danmaku/app.js  >> /data/danmaku/logs/app.log 2>&1 &
	else
		echo "$_time ---- App Exists!" >> /data/danmaku/logs/daemon.log
	fi



	sleep 3s
done
