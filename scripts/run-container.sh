#!/bin/sh

pip3 install -U awscli

aws configure set default.region ap-northeast-2

docker build -t kidsloop-attribute .

docker run --add-host host.docker.internal:$BITBUCKET_DOCKER_HOST_INTERNAL \
    -d \
    --name=check-startup \
    kidsloop-attribute && sleep 8 && docker logs check-startup && docker top check-startup
    