#!/bin/bash

function pgrep() {
    ps aux | grep $1 | grep -v grep
}


function pkill() {
    local pid
    pid=$(ps ax | grep $1 | grep -v grep | awk '{ print $1 }')
    if [ "$pid" != "" ]; then
    	kill -9 $pid
    	echo "Killed $1 (process $pid)"
    else 
    	echo "$1 process not found"
    fi
}

function start_profiler() {
	local server_proc
	server_proc=$(pgrep $1)
	if [ "$server_proc" != "" ]; then
		echo "$1 already started"
	else
		node "$(dirname $0)/../$1" 1>/dev/null &
		echo "$1 started"
		open "http://localhost:9876/client/index.html"
	fi
}

function stop_profiler() {
	pkill $1
}

SERVER="server.js"

if [ "$1" == "start" ]; then
	start_profiler $SERVER
elif [ "$1" == "stop" ]; then
	stop_profiler $SERVER
fi


