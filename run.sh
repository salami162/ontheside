#! /bin/bash
echo "Starting Supervisor"
supervisor -e 'hbs|json|js' -- --debug ./server.js &
node-inspector --web-port=5005 &
