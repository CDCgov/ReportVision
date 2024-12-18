terraform {
  backend "azurerm" {
    resource_group_name = "reportvision-rg"
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
    # azuread = {
    #   source = "hashicorp/azuread"
    # }
  }
}

provider "azurerm" {
  features {}
}

