FROM rust:1.63 as target

WORKDIR multi-party-ecdsa

RUN git clone https://github.com/bitoftrade/multi-party-ecdsa.git . 

RUN cargo build --release --examples


FROM node:16.13

COPY . /tss-client
WORKDIR /tss-client

ARG NPM_TOKEN

RUN npm ci
RUN npm run build

COPY --from=target /multi-party-ecdsa/target/release/examples/  /tss-client/target/

ENTRYPOINT ["npm", "run", "start"]