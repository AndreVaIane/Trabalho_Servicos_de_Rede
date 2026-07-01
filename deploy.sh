#!/bin/bash
set -e

echo "🚀 Iniciando automação do cluster uncloud..."

if ! command -v uc &> /dev/null; then
    echo "⬇️ Instalando o CLI do uncloud..."
    curl -fsS https://get.uncloud.run/install.sh | sh
fi

echo "🔑 Configurando chaves de segurança..."
mkdir -p ~/.ssh
cp /vagrant/.vagrant/machines/vm1/virtualbox/private_key ~/.ssh/vm1_key 2>/dev/null || true
cp /vagrant/.vagrant/machines/vm2/virtualbox/private_key ~/.ssh/vm2_key 2>/dev/null || true
chmod 600 ~/.ssh/vm1_key ~/.ssh/vm2_key

echo -e "Host 192.168.56.*\n  StrictHostKeyChecking no\n  UserKnownHostsFile=/dev/null" > ~/.ssh/config
chmod 600 ~/.ssh/config

echo "🌐 Inicializando o nó controlador (VM1)..."
if [ ! -f ~/.config/uncloud/config.yaml ]; then
    # 1ª Tentativa: O "|| true" ignora o erro esperado do DNS do Caddy ou o timeout.
    uc machine init vagrant@192.168.56.11 -i ~/.ssh/vm1_key < /dev/null || true
    
    # Se o arquivo não foi criado, significa que foi o timeout baixando o Docker.
    if [ ! -f ~/.config/uncloud/config.yaml ]; then
        echo "⚠️ Timeout baixando o motor. Aguardando 15s para o Linux consertar o serviço..."
        sleep 15
        # 2ª Tentativa: Agora o Docker já baixou a imagem.
        echo "y" | uc machine init vagrant@192.168.56.11 -i ~/.ssh/vm1_key < /dev/null || true
    fi
else
    echo "✅ Contexto já existe, pulando a inicialização."
fi

echo "🌐 Adicionando o nó operário (VM2)..."
echo "y" | uc machine add vagrant@192.168.56.12 -i ~/.ssh/vm2_key < /dev/null || true

echo "📦 Construindo a imagem do FastAPI na VM2 (Isso pode levar 1 minuto)..."
ssh -n -i ~/.ssh/vm2_key vagrant@192.168.56.12 "sudo docker build -t andrevaiane/fastapi-biblioteca:latest /vagrant/backend"

echo "⚙️ Subindo PostgreSQL e Loki na VM1 (Camada de Dados)..."
uc run --machine vm1-dados --name postgres-db \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_PASSWORD=20241SI041 \
  --env POSTGRES_DB=biblioteca \
  --volume dados-postgres:/var/lib/postgresql/data \
  postgres:15-alpine || true

uc run --machine vm1-dados --name loki-service \
  --volume /vagrant/loki/loki-config.yaml:/etc/loki/local-config.yaml \
  --volume dados-loki:/loki \
  grafana/loki:3.0.0 -- -config.file=/etc/loki/local-config.yaml || true

echo "⚙️ Subindo FastAPI e NGINX na VM2 (Camada de Aplicação)..."
uc run --machine vm2-app --name fastapi \
  --env DATABASE_URL=postgresql://postgres:20241SI041@postgres-db:5432/biblioteca \
  --env LOKI_URL=http://loki-service:3100/loki/api/v1/push \
  andrevaiane/fastapi-biblioteca:latest || true

uc run --machine vm2-app --name nginx \
  --volume /vagrant/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  --volume /vagrant/nginx/html:/usr/share/nginx/html:ro \
  --publish 80:8080@host \
  nginx:alpine || true

echo "✅ Deploy concluído com sucesso! Acesse http://192.168.56.12"