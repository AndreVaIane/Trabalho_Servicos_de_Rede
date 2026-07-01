Vagrant.configure("2") do |config|
  # VM1 - Camada de Dados (PostgreSQL + Loki)
  config.vm.define "vm1" do |vm1|
    vm1.vm.box = "ubuntu/jammy64"
    vm1.vm.network "private_network", ip: "192.168.56.11"
    vm1.vm.hostname = "vm1-dados"
    vm1.vm.provision "shell", inline: "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
  end

  # VM2 - Camada de Aplicação (NGINX + FastAPI)
  config.vm.define "vm2" do |vm2|
    vm2.vm.box = "ubuntu/jammy64"
    vm2.vm.network "private_network", ip: "192.168.56.12"
    vm2.vm.hostname = "vm2-app"
    vm2.vm.provision "shell", inline: "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
  end
end