#!/bin/sh

cp -a 'client/__sapper__/build' 'functions/render'
sed -i \
  -e 's:"__sapper__/build":path.join(__dirname, ".."):g' \
  'functions/render/build/server/server.js'
echo '/* /.netlify/functions/render 200' > 'client/__sapper__/build/_redirects'
