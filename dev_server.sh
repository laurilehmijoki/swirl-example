#!/bin/bash -e

npm install

node_modules/nodemon/bin/nodemon.js \
  --quiet \
  --exec "node_modules/node-sass/bin/node-sass client/css/style.scss --output client/css/gen" \
  --include-path="client" \
  --source-map=true \
  --ext scss &

node_modules/watchify/bin/cmd.js client/js/app.js \
  --debug \
  -o client/js/gen/bundle.js \
  -v \
  &

node_modules/supervisor/lib/cli-wrapper.js --quiet --ignore node_modules --watch server server/bootstrap.js
