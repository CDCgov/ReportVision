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
    azuread = {
      source = "hashicorp/azuread"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }
}

# Provider for Azure Active Directory resources (e.g., service principals)
provider "azuread" {

  client_id = var.client_id
  tenant_id = var.tenant_id

}
