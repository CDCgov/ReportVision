terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.66.0"
    }

    azuread = {
      source  = "hashicorp/azuread"
      version = "= 2.41.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "= 1.8.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~>3.5.1"
    }
  }

  backend "azurerm" {
    storage_account_name = "tfstaterv2024"
    resource_group_name  = "reportvision-rg"
    container_name       = "rv-tfstate"
    key                  = "dev/terraform.tfstate"
  }
}
