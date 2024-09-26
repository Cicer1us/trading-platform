
FROM node:16.13

COPY . /bof-server-v2

WORKDIR /bof-server-v2

EXPOSE 1433
EXPOSE 3000

RUN npm ci
RUN npm run build

RUN ["chmod", "+x", "/bof-server-v2/docker_env_init.sh"]

ENTRYPOINT ["./docker_env_init.sh"]