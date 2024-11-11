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
  use_oidc = true
  features {}
}

# Note: Only lowercase and alphanumeric characters allowed for name
resource "azurerm_storage_account" "storage_account" {
  name                      = "${var.project}tfstate${var.env}"
  resource_group_name       = var.resource_group_name
  location                  = var.location
  account_kind              = var.account_kind
  account_tier              = var.account_tier
  account_replication_type  = var.account_replication_type
  enable_https_traffic_only = true

  lifecycle {
    prevent_destroy = true
  }
}

# Enable advanced threat protection for azurerm_storage_account
resource "azurerm_advanced_threat_protection" "advanced_threat_protection" {
  target_resource_id = azurerm_storage_account.storage_account.id
  enabled            = true
}
