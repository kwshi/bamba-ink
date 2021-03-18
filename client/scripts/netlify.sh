#!/bin/sh -e

cp -a '__sapper__/build' 'functions/render'
cp -a 'static' 'functions/render/build'
sed -i \
  -e 's:"__sapper__/build":path.join(__dirname, ".."):g' \
  'functions/render/build/server/server.js'
echo '/* /.netlify/functions/render 200' > '__sapper__/build/_redirects'
