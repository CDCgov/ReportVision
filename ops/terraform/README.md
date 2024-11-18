# ReportVision's Terraform Setup

Currently, our infrastructure is built specifically for Azure, with a traditional cloud architecture hosting our frontend code from blob storage and our OCR-API running in an App Service. Both the frontend and the OCR-API are behind a Virtual Network and load balanced by an App Gateway.


## Prerequisites

When using Terraform, you will need to created a `terraform.tfvars` file in the `ops/terraform` directory with variables:

``` bash
    resource_group_name = "reportvision-rg-<environment-name>"
    name                = "reportvision"
    sku_name            = "S2"
```