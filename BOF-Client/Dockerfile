FROM node:16.13

ARG NPM_TOKEN

COPY . /BOF-Client

WORKDIR /BOF-Client

EXPOSE 3002

RUN npm ci
RUN npm run build

RUN ["chmod", "+x", "/BOF-Client/docker_env_init.sh"]

ENTRYPOINT ["./docker_env_init.sh"]