#! /bin/bash
echo "Starting up nginx"
cp $PWD/config/local/nginx.conf $PWD/config/local/nginx.conf
sudo nginx -c $PWD/config/local/nginx.conf

echo "Starting Supervisor"
supervisor -e 'hbs|json|js' -- --debug ./server.js &
node-inspector --web-port=5005 &
