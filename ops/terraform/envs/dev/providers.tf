terraform {
  backend "azurerm" {
    resource_group_name  = "reportvision-rg-global"
    storage_account_name = "tfstaterv2024"
    container_name       = "rv-tfstate"
    key                  = "dev/terraform.tfstate"
  }
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}