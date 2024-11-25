data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

data "azurerm_resource_group" "rg_global" {
  name = "${var.name}-rg-management"
}

data "azurerm_key_vault" "global" {
  name                = "simple-report-global"
  resource_group_name = data.azurerm_resource_group.rg_global.name
}

data "azurerm_key_vault_secret" "rv_db_jdbc" {
  name         = "reportvision-${terraform.workspace}-db-jdbc"
  key_vault_id = data.azurerm_key_vault.global.id
}

data "azurerm_key_vault_secret" "postgres_password" {
  name         = "reportvision-${terraform.workspace}-db-password"
  key_vault_id = data.azurerm_key_vault.global.id
}