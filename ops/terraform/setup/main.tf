###########################################################################################
#
# This file creates the bare minimum infrastructure to start storing remote state.
# It can't store its own remote state, so this file contains only one resource.
#
# In other words, do not apply this file multiple times, as it will fail due to lack of
# state - it won't know it already created the resources.
#
###########################################################################################

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.23.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_storage_account" "tfstate" {
  name                     = "${var.env}-${var.project}tfstate${substr(var.client_id, 0, 8)}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  account_replication_type = "GRS"
  # https_traffic_only_enabled = true

  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_storage_container" "tfstate" {
  name                 = "tfstate"
  storage_account_name = azurerm_storage_account.tfstate.name
}
