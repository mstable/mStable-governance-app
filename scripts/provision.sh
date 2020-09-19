#!/bin/bash

echo "Provisioning submodules"
git submodule update --init --recursive

echo "Installing contracts"

cd ./lib/mStable-governance-subgraph/lib/mStable-contracts
yarn
yarn run test-prep
