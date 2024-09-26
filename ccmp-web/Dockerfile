FROM node:16.13

ARG NPM_TOKEN

COPY . /ccmp-web

WORKDIR /ccmp-web

EXPOSE 3002

RUN npm ci
RUN npm run build

RUN ["chmod", "+x", "/ccmp-web/docker_env_init.sh"]

ENTRYPOINT ["./docker_env_init.sh"]