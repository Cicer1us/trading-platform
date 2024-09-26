FROM rust:1.63 as target

WORKDIR multi-party-ecdsa

RUN git clone https://github.com/bitoftrade/multi-party-ecdsa.git . 

RUN cargo build --release --examples


FROM node:16.13

COPY . /tss-server
WORKDIR /tss-server

ARG NPM_TOKEN

RUN npm ci
RUN npm run build

COPY --from=target /multi-party-ecdsa/target/release/examples/  /tss-server/target/

EXPOSE 4000
EXPOSE 8001
EXPOSE 8002
EXPOSE 8003

RUN ["chmod", "+x", "/tss-server/docker_env_init.sh"]

ENTRYPOINT ["/tss-server/docker_env_init.sh"]