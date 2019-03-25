#!/bin/bash
# 启动本地 mongo和redis
echo "创建本地mongo文件";
mkdir -p db;
cd ./db;
mkdir -p data;mkdir -p log;
echo "启动mongo";
mongod --dbpath=./data --logpath=./log/log.log --fork;
cd ..;
echo "启动redis";
redis-server --daemonize yes;
