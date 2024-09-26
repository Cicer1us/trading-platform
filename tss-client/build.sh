#!/usr/bin/env bash

git clone https://github.com/bitoftrade/multi-party-ecdsa.git

mkdir target 

cd multi-party-ecdsa

# build multi-party-ecdsa bash scripts

# for MacOs use 
# cargo build --release --examples --no-default-features --features curv-kzen/num-bigint

cargo build --release --examples

# move files from current repo to project target folder 
mv ./target/release/examples/* ../target/

cd .. 

# remove unused multi-party-ecdsa repo
rm -rf multi-party-ecdsa

