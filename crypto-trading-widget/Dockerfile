FROM node:18.12

ARG NPM_TOKEN

COPY ./docker_env_init.sh /docker_env_init.sh
COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 443

RUN ["chmod", "+x", "/docker_env_init.sh"]

ENTRYPOINT ["./docker_env_init.sh"]