# 📚 Acervo Digital - Sistema de Gestão de Biblioteca em Cluster

Este projeto é um sistema de gestão de biblioteca desenvolvido como trabalho acadêmico para a disciplina de **Serviços de Redes para Internet**[cite: 5]. 

Nesta etapa, a aplicação (originalmente em Docker Compose) foi portada e adaptada para rodar em um **cluster com múltiplas VMs**, aplicando restrições de posicionamento, separação de camadas e coleta centralizada de logs[cite: 5].

## 👥 Integrantes do Grupo
* André Mendonça Valane

## ⚙️ Orquestrador Utilizado: Uncloud
Para a orquestração do cluster, optamos pelo **[Uncloud](https://uncloud.run/)**. Trata-se de um orquestrador de containers *open source* minimalista e declarativo, excelente para gerenciar serviços em múltiplos hosts de forma distribuída, sem a sobrecarga e complexidade de ferramentas maiores como o Kubernetes[cite: 5]. Ele gerencia a rede interna, os *deploys* e o roteamento entre as máquinas de forma simplificada.

## 🗺️ Diagrama da Topologia do Cluster

A arquitetura foi dividida rigorosamente em duas camadas, rodando em duas Máquinas Virtuais distintas gerenciadas via Vagrant[cite: 5]. Os serviços de dados não expõem portas para a rede externa[cite: 5].

    ┌──────────────────────────────────┐      ┌──────────────────────────────────┐
    │       VM1  —  Camada de Dados    │      │    VM2  —  Camada de Aplicação   │
    │           (192.168.56.11)        │      │          (192.168.56.12)         │
    │                                  │      │                                  │
    │   ┌────────────┐  ┌───────────┐  │      │  ┌─────────┐   ┌─────────────┐  │
    │   │ PostgreSQL │  │   Loki    │  │      │  │  NGINX  │   │   FastAPI   │  │
    │   │  porta     │  │  porta    │  │      │  │porta 80 │   │  porta 8080 │  │
    │   │  5432      │  │  3100     │  │      │  │  / 443  │   │  (interno)  │  │
    │   └────────────┘  └───────────┘  │      │  └─────────┘   └─────────────┘  │
    │                                  │      │                                  │
    │   (sem portas expostas ao host)  │      │   (NGINX exposto ao host)        │
    └──────────────┬───────────────────┘      └──────────────┬───────────────────┘
                   │                                         │
                   └──────────── rede interna do cluster ────┘
                              (overlay / wireguard network)

## 🚀 Instruções de Implantação

### Pré-requisitos
* [VirtualBox](https://www.virtualbox.org/) e [Vagrant](https://www.vagrantup.com/) instalados na máquina hospedeira.
* Git para clonar o repositório.

### Passo a Passo

**1. Clone o repositório e suba as Máquinas Virtuais:**
`bash
git clone https://github.com/AndreVaIane/Trabalho_Servicos_de_Rede.git
cd Trabalho_Servicos_de_Rede
vagrant up
`
*O comando `vagrant up` irá provisionar a `vm1-dados` e a `vm2-app` e instalar o Docker Engine em ambas.*

**2. Acesse o Nó Controlador (VM1):**
`bash
vagrant ssh vm1
`

**3. Execute o script de Automação de Deploy:**
Dentro da VM1, o diretório do projeto está espelhado em `/vagrant`. Execute o script que configura o cluster Uncloud, realiza o build da imagem e sobe os serviços respeitando as restrições de máquina:
`bash
bash /vagrant/deploy.sh
`

**4. Acesse a Aplicação:**
Assim que o script finalizar com sucesso, a interface web estará disponível pelo NGINX na VM2:
* **Frontend:** [http://192.168.56.12/](http://192.168.56.12/)

## 🩺 Verificação de Estado e Logs (Observabilidade)

### Verificando o Estado dos Serviços
Para conferir se os containers estão rodando e alocados nas máquinas corretas, execute dentro da `vm1-dados`[cite: 5]:
`bash
# Ver as máquinas ativas no cluster
uc machine ls

# Ver o status de todos os serviços implantados
uc service ls

# Ver os containers rodando (réplicas)
uc ps
`
### Consultando Logs no Grafana Loki

Atendendo aos requisitos de segurança e isolamento de rede da atividade, os serviços da Camada de Dados (PostgreSQL e Loki) **não expõem portas diretamente para a máquina hospedeira** (`127.0.0.1` ou `localhost`)[cite: 5]. Eles operam exclusivamente na rede interna do cluster[cite: 5].

Portanto, uma tentativa direta de acesso via `curl` no `localhost:3100` resultará de propósito em `Connection refused`, provando que o isolamento de segurança está funcionando corretamente[cite: 5].

Para demonstrar a consulta de logs via API HTTP do Loki[cite: 5], precisamos descobrir o IP interno que o orquestrador atribuiu ao container e acessá-lo diretamente pela rede isolada.

Copie e cole o bloco de comandos abaixo no terminal da **VM1**:

```bash
# 1. Captura o IP interno da rede isolada do container do Loki
LOKI_IP=$(sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(sudo docker ps -qf "name=loki-service"))

# 2. Realiza a consulta de logs do serviço FastAPI (últimos 10 minutos) usando o IP interno
curl -G "http://$LOKI_IP:3100/loki/api/v1/query_range" \
  --data-urlencode 'query={service="fastapi"}' \
  --data-urlencode 'start='"$(date -d '10 minutes ago' +%s000000000)"'' \
  --data-urlencode 'end='"$(date +%s000000000)"''