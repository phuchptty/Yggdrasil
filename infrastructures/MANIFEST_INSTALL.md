# Table of content

- Infrastructure prerequisite
- Service deploy

# Step 1: Infrastructure prerequisite

## Install cert manager

```shell
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest

kubectl create namespace cattle-system

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.crds.yaml

helm repo add jetstack https://charts.jetstack.io

helm repo update

# Linux
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.11.0

# Windows Powershell
helm install cert-manager jetstack/cert-manager `
  --namespace cert-manager `
  --create-namespace `
  --version v1.11.0
```

# Install rancher (optinal for fun only)

```shell
# For unix
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.yds.cuterabbit.art \
  --set replicas=1 \
  --set bootstrapPassword=HH223344!@#

# Windows Powershell
helm install rancher rancher-latest/rancher `
  --namespace cattle-system `
  --set hostname=rancher.yds.cuterabbit.art `
  --set replicas=1 `
  --set bootstrapPassword=HH223344!@#
  
```

## Create rancher project (for better orgnize) (optional)
```shell
kubectl apply -f rancher/project-core.yml
kubectl apply -f rancher/project-guest-vm.yml
```

## Apply wildcard cert-manager

```shell
# -k stand for kuztomization
kubectl apply -k cert-manager
```

## Install ingress-nginx

```shell
kubectl apply -f ingress-nginx/helmConfig.yaml
```

## (Optional) Echo server to test certificate and ingress
```shell
helm install echo-server -n echo-server --create-namespace echo-server
```

## Install longhorn

```shell
helm repo add longhorn https://charts.longhorn.io

helm repo update

helm install longhorn longhorn/longhorn --namespace longhorn-system --create-namespace --version 1.5.1

kubectl -n longhorn-system get pod

# Wait for about 5 mins for longhorn process done

# Apply config
kubectl apply -f longhorn/config-storageclass.yml

# UI INGRESS
# Default account admin:HH223344
kubectl -n longhorn-system create secret generic basic-auth --from-file=longhorn/auth

kubectl -n longhorn-system apply -f longhorn/ingress.yml
```

## Install NFS server (Use longhorn to provide 150Gi storage)
```shell
kubectl apply -f csi-nfs/nfs-server.yaml
```

## Install Snapshot CRDs & Common Snapshot Controller
```shell
kubectl kustomize client/config/crd | kubectl create -f -
kubectl -n kube-system kustomize deploy/kubernetes/snapshot-controller | kubectl create -f -
```

## Install NFS client (Run on host server)
```shell
curl -skSL https://raw.githubusercontent.com/kubernetes-csi/csi-driver-nfs/v4.4.0/deploy/install-driver.sh | bash -s v4.4.0 --
```

## Install Storage class
```shell
kubectl apply -f csi-nfs/storage-class.yaml
```

# Step 2: Service Deploy

## Install Keycloak

```shell
helm upgrade keycloak -n keycloak --create-namespace keycloak
```

## Install kubeapi exec proxy
```shell
helm upgrade exec-proxy -n exec-nginx-proxy --create-namespace exec-nginx-proxy
```