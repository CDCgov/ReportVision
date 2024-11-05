# Current Github Workflows for building and deploying ReportVision in Dev or Demo

## Prerequisites

There are secrets for Azure authentication from Github Action's located within the Github Settings. At the time of reading this, you may need to create new federated secrets and Resource Groups in your Azure account, while also updating the existing `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` secrets in each Github Environmnet.

**NOTE**: Resource Groups were never created from Terraform on purpose to better replicate CDC's Azure setup and requirements for potential future migrations from Skylight's Azure. CDC would manually create Resource Groups for us.

Azure Resource Group Naming:

- `reportvision-rg-dev`
- `reportvision-rg-demo`

## Complete e2e build and deploy for ReportVision

If you would like to build and deploy all of ReportVision's services at once, `deploy-dev.yml` will do the trick specifically for dev and demo environments within Azure only.

When you deploy a `demo` environment specifically, note that the `.github/actions/deploy-frontend/` Github Action will be skipped because Terraform will name the Azure Storage Account very uniquely. We decided to do this for demo environments to ensure user's could never return back to the specific url. We are currently not using any custom domain names. Once the `deploy-dev.yml` completes for a demo, just make sure to use the `build-deploy-frontend.yml` with the newly created Storage Account from Azure as an input.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.
- `ocr-version`: This will be the Docker Tag. At the moment this caan be uniquely named and does not required any kind of format. We will also check if this tag already exists and if it does the docker build step will be skipped.


## Build and deploy the ReportVision's frontend only

We made a seperate workflow that builds and deploys the frontend files only, `build-deploy-frontend.yml`. The reason for this is because currently the OCR-API docker build takes nearly an hour at times. Having to wait for that along with the Terraform setup job to complete, just to refresh the frontend can be a giant waste of time. Just make sure the Azure environment is already up from the `deploy-dev.yml` workflow or at the very least a Storage Account in is created.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.

Optional Inputs:

- `storage-account-name`: After deploying a demo environment from `deploy-dev.yml`, you will need to use the unique Azure Storage Account name that was created here.

## Build and deploy the ReportVision's OCR-API only

Just like with the frontend, we needed a way to refresh the OCR-API without having to re-apply Terraform and deploying the frontend. With `build-deploy-ocr.yml`, we can either build and publish a new OCR-API Docker image or we can use an already registered OCR-API Docker image. The OCR-API Docker images are located here: https://github.com/CDCgov/ReportVision/pkgs/container/reportvision-ocr-api. Once the Docker image is ready to go it will deploy it to the selected environments Azure App-Service Webapp. 

**Note**: Using an already registered Docker image will be MUCH faster than waiting for a new one to be built.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.
- `ocr-version`: This will be the Docker Tag. At the moment this caan be uniquely named and does not required any kind of format. We will also check if this tag already exists and if it does the docker build step will be skipped.

# Github Workflows for building and deploying ReportVision in Staging or Production

Unfortunately we never had the opportunity to pilot our amazing product to actual users which kept us from deploying to any type of Staging or Production environments. We also weren't entirely sure if we'd even be able to deploy to a centrally hosted Azure account like our current one either.

If we were able to deploy to a centrally hosted system. Our thought would have been to create a `deploy-stage.yml` workflow that is stuctured and functions very similarily to `deploy-dev.yml`, except it would be triggered off of the `main` branch or Github `tags`. If all staging jobs and tests pass, a `deploy-prod.yml` workflow would get triggered.

If we were required to deploy to STLT-hosted environments, our plan was going to ensure that all services are containerized and deployed as a container orchastrated system with tooling like Kubernetes. If this were to happen, we would have to paradigm shift completely. There was also the possibility of needing to do both. 