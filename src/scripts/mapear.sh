#!/bin/bash

echo "criando a pasta"

if [ -d "/mnt/dmrep" ]; then
    echo "a pasta existe mapeando"
        umount /mnt/dmrep
        mount -t cifs //10.110.170.14/dmrep /mnt/dmrep -o username=integracao@pinheiro.local,password=abc@123
else
    echo "a pasta nao existe criando!"
    mkdir /mnt/dmrep

    mount -t cifs //10.110.170.14/dmrep /mnt/dmrep -o username=integracao@pinheiro.local,password=abc@123
fi

