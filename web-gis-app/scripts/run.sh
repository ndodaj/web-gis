#!/bin/bash

# build through docker

docker build -t angular-app .
# run app

docker run -p 3000:3000 angular-app
