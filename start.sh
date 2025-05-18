#!/bin/bash

# i'm using this as docker-compose is not installing on my machine (Arch Linux)

docker volume inspect pgdata > /dev/null 2>&1 || docker volume create pgdata
docker network inspect file_network > /dev/null 2>&1 || docker network create file_network

docker run -d \
  --name file_pg \
  --network file_network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fileservice \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15

docker run -d \
  --name file_redis \
  --network file_network \
  -p 6379:6379 \
  redis:7

docker build -t file-upload-service .

docker run -d \
  --name file_app \
  --network file_network \
  -p 3000:3000 \
  -v "$(pwd)/uploads:/app/uploads" \
  -e DATABASE_URL=postgresql://postgres:postgres@file_pg:5432/fileservice \
  -e JWT_SECRET=your_secret_key \
  -e REDIS_URL=redis://file_redis:6379 \
  file-upload-service

echo "App running on http://localhost:3000"
