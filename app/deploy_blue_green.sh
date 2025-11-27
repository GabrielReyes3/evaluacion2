#!/bin/bash
set -e

NEW_IMAGE="$1"
ENV_FILE="/home/deployer/app/env_file"

# Leer estado actual
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
else
  CURRENT_PRODUCTION="blue"
fi

# Determinar slot inactivo
if [ "$CURRENT_PRODUCTION" = "blue" ]; then
  INACTIVE_SLOT="green"
  INACTIVE_PORT=3001
  INACTIVE_CONF="/home/deployer/app/nginx/green.conf"
else
  INACTIVE_SLOT="blue"
  INACTIVE_PORT=3000
  INACTIVE_CONF="/home/deployer/app/nginx/blue.conf"
fi

echo "Slot inactivo: $INACTIVE_SLOT"

# Detener contenedor anterior si existe
docker stop $INACTIVE_SLOT || true
docker rm $INACTIVE_SLOT || true

# Iniciar nuevo contenedor
docker run -d   --name $INACTIVE_SLOT   --restart unless-stopped   -p $INACTIVE_PORT:80   $NEW_IMAGE

echo "Esperando 10 segundos para iniciar contenedor..."
sleep 10

# Cambiar tráfico de Nginx usando sudo -S
echo "UTEQdeployer123.-" | sudo -S ln -snf $INACTIVE_CONF /etc/nginx/sites-enabled/active.conf
echo "UTEQdeployer123.-" | sudo -S systemctl reload nginx

# Actualizar estado
echo "CURRENT_PRODUCTION=$INACTIVE_SLOT" > $ENV_FILE
echo "Despliegue completado al slot $INACTIVE_SLOT ✅"
