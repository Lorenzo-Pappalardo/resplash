# Azure

1. Followed [this guide](https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-azure-kubernetes-service)
2. Created a Resource Group
3. Created a Container Registry
4. Requested the "Microsoft.Compute" provider under "Resource providers" for the specific Subscription
5. Created an Azure Kubernetes Service
6. Followed [this guide](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect) and opted for the first option
7. Authenticated the pipeline following [this guide](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure)
8. Created the pipeline using [this starter workflow](https://github.com/actions/starter-workflows/blob/main/deployments/azure-kubernetes-service-helm.yml)
9. Configured the NGINX ingress via Helm as indicated by [the official guide](https://kubernetes.github.io/ingress-nginx/deploy/#azure)
10. Created the ingress based on [this guide](https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/load-bal-ingress-c/create-unmanaged-ingress-controller?tabs=azure-cli#create-an-ingress-controller)
