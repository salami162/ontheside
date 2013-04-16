#! /bin/bash

WATCH_DIRS='public,.'
WATCH_TYPES='hbs|json|js|css'


cleanupEnvironment() {
  echo "---------------------------------------------------------------------"
  echo "Killing all node processes (sry if you had others :/ )"
  killall node

  # after a keystroke
#  echo "Stopping nginx"
#  sudo nginx -s stop

  echo "Everything Stopped. G2G!"

  exit
}

# echo "Starting up nginx"
# sudo nginx -c $PWD/config/local/nginx.conf

case $1 in
-debug)
  which supervisor
  if [ "$?" -ne "0" ]; then
    echo "FAIL Do --- npm install -g supervisor --- and try again"
  else
    echo "Starting supervisor in debug mode "
    supervisor -p 1000 -n error -e $WATCH_TYPES -w $WATCH_DIRS -- --debug ./server.js &
    node-inspector --web-port=5005 &
  fi
    ;;
-debug-brk)
  which supervisor
  if [ "$?" -ne "0" ]; then
    echo "FAIL Do --- npm install -g supervisor --- and try again"
  else
    echo "Starting supervisor in debug mode waiting for a debugger to connect"
    supervisor -p 1000 -n error -e $WATCH_TYPES -w $WATCH_DIRS -- --debug-brk ./server.js &
    node-inspector --web-port=5005 &
  fi
    ;;
*)
  echo "Starting supervisor"
  supervisor -p 1000 -n error -e $WATCH_TYPES -w $WATCH_DIRS ./server.js &
    ;;
esac

echo "Monitoring Node Changes. Output is below"
echo ""
echo "Everything loaded. Press any key (or CTRL-C) to turn it all off: "
echo ""
trap cleanupEnvironment INT
read -p "---------------------------------------------------------------------"
cleanupEnvironment

