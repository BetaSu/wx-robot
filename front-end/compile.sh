#!/bin/bash

npm run build
rm -f view/index_index.html
mv -f dist/index.html ../view/index_index.html
rm -rf ../www/static
mv -f dist/static ../www
echo "前端打包完成";