# Github Action workflows for building and deploying ReportVision in a dev environment



## Prerequisites

You will need to create new App registrations(federated secrets) and Resource Groups in your Azure account for each environment, while also updating the existing `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_OBJECT_ID` ID's in each Github Environment. Most these ID's are found in each environments App Registration Overview page and Subscriptions Overview page in the Azure Portal. To update these secrets in Github go to Settings > Environments > And select the environment you would like to edit.

**NOTE**: Resource Groups were never created from Terraform on purpose to better replicate CDC's Azure setup and requirements for potential future migrations from Skylight's Azure. CDC would manually create Resource Groups for us.

Azure Resource Group naming convention:

- `reportvision-rg-<environment-name>`

With how our Github Action workflows are parametrized, to enable better automation and less user intervention, Azure Resource Groups will need to be named in a strict manor. If you would like to change the convention, you will also need to change how its named and parametrized in the Github Actions workflow files.

## Complete e2e build and deploy for ReportVision

To build and deploy all of ReportVision's services at once, `deploy-dev.yml` will do the trick specifically for dev environments within Azure only.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.

Optional Inputs:

- `ocr-docker-tag`: The OCR Docker Tag. This input is optional because if it is left blank, the workflow will build and publish a new docker image each time. If you would like to deploy a previously built docker image, you can add the tag here.
- `middleware-docker-tag`: The Middleware Docker Tag. This input is optional because if it is left blank, the workflow will build and publish a new docker image each time. If you would like to deploy a previously built docker image, you can add the tag here.


**NOTE**: This workflow is currently failing for a known, valid reason with Terraform. See the Terraform README.md for more details on the error. In the meantime, if you need to setup or update an environments infrastructure, it needs to be done locally with Terraform and then deploy the frontend and the API's from their separate workflows shown below.

## Build and deploy ReportVision's frontend only

We made a separate workflow that builds and deploys the frontend files only, `build-deploy-frontend.yml`. Having to wait for the end-to-end deploy, along with the Terraform setup job to complete, just to refresh the frontend can be a giant waste of time. 

Before running this workflow, just make sure the Azure environment is already up and running from either the `deploy-dev.yml` workflow, your local terraform, or at the very least a Storage Account in is created.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.

## Build and deploy ReportVision's OCR-API and Middleware-API separately

Just like with the frontend, we needed a way to refresh the OCR-API and/or Middleware-API without having to re-apply Terraform and deploying the frontend. With `build-deploy-ocr.yml` or `build-deploy-ocr.yml` we can either build and publish a new docker image or we can use an already registered docker image. Both the OCR-API and Middleware-API docker images are published here: 
- https://github.com/CDCgov/ReportVision/pkgs/container/reportvision-ocr
- https://github.com/CDCgov/ReportVision/pkgs/container/reportvision-middleware. 

Once the workflow builds and publishes the images, it will deploy it to the selected environments Azure App-Service Webapp. 

Again, Just make sure you have already applied the needed resources with Terraform before running this workflow.

Required Inputs:

- `branch`: Any
- `deploy-env`: Drop down of available environments to chose from.

Optional Inputs:

- `ocr-docker-tag`: The OCR Docker Tag. This input is optional because if it is left blank, the workflow will build and publish a new docker image each time. If you would like to deploy a previously built docker image, you can add the tag here.

**Note**: Using an already registered docker image will be a bit faster than waiting for a new one to be built. Also, this is how we quickly rollback versions.

# Github Workflows for building and deploying ReportVision in Staging or Production

Unfortunately we never had the opportunity to pilot our amazing product to actual users which kept us from deploying to any type of Staging or Production environments. We also weren't entirely sure if we'd even be able to deploy to a centrally hosted Azure account like our current one either.

If we were able to deploy to a centrally hosted system. Our thought would have been to create a `deploy-stage.yml` workflow that is structured and functions very similarly to `deploy-dev.yml`, except it would be triggered off of the `main` branch or Github `tags`. If all staging jobs and tests pass, a `deploy-prod.yml` workflow would then get triggered.

If we were required to deploy to STLT-hosted environments, our plan was going to ensure that all services are containerized and deployed as a container orchestrated system with tooling like Kubernetes. This would make it easier for us to be cloud-agnostic and have the ability to quickly "lift-and-shift" our product into different organizations. If this were to happen, we would had to paradigm shift completely.
