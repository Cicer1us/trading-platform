
FROM node:18.12

COPY . /bof-allpay-server

WORKDIR /bof-allpay-server

EXPOSE 1433
EXPOSE 3000

RUN yarn
RUN yarn build

RUN ["chmod", "+x", "/bof-allpay-server/docker_env_init.sh"]

ENTRYPOINT ["./docker_env_init.sh"]