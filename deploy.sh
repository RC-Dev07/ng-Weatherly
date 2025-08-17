#!/bin/bash

# Salir si hay un error
set -e

echo "Eliminando carpeta dist/..."
rm -rf dist/

echo "Ejecutando build de Angular (producción)..."
ng build --configuration production

echo "Desplegando a Firebase..."
firebase deploy

echo "¡Proceso completado!"