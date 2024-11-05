# Current state of building and deploying ReportVision

## Complete e2e ReportVision build and deploy

If you would like to build and deploy ReporVsion all at once `deploy-dev.yml` will do the trick specifically for dev and demo environments within Azure only. There are secrets for Azure authentication from Github Action's located within the Github Settings. At the time of reading this, you may need to create new federated secrets and Resource Groups in your Azure account and update the AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID secrets in Github Settings.

When you deploy a `demo` environment specifically, note that the the `.github/actions/deploy-frontend/` Github Actions job will be skipped because for terraform will name the Azure Storage Account very uniquely. We decided to do this for demo environments because we are currently not using any type of DNS/custom domain names and wanted to make sure the user's could never return back to the specific url. Once the `dev-deploy.yml` run for a demo, just make sure to use the `build-deploy-frontend.yml` with the newly created Storage Account name from Azure.

## Helm Install

``` bash
helm install gitlab gitlab/gitlab -f values.yaml --namespace gitlab
```

## Sign into Gitlab

To sign in, you must collect the password for the root user. This is automatically generated at installation time and stored in a Kubernetes Secret. Let’s fetch that password from the secret and decode it:

```bash
kubectl get secret gitlab-gitlab-initial-root-password -ojsonpath='{.data.password}' | base64 --decode ; echo
```