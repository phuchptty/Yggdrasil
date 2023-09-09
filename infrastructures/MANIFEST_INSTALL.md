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

## Apply wildcard cert-manager

```shell
# -k stand for kuztomization
kubectl apply -k cert-manager
```

## Install ingress-nginx

```shell
kubectl apply -f ingress-nginx/helmConfig.yaml
```