#!/bin/bash

files=$(grep -rli 'WGCIqXP4v6I46EL5')

for file in ${files}; do
    sed -i -e 's/WGCIqXP4v6I46EL5/<pw removed>/gI' ${file}
done