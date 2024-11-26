resource "azurerm_key_vault" "this" {
  name                     = "reportvisionvault"
  location                 = var.location
  resource_group_name      = var.resource_group_name
  sku_name                 = "standard"
  tenant_id                = var.tenant_id
  purge_protection_enabled = true
}

# Random string resource for the postgres password
resource "random_string" "postgres_password" {
  length           = 16
  override_special = "_!@#-$%^&*()[]{}" # excluded characters
}

resource "azurerm_key_vault_secret" "postgres_db_secret" {
  name         = "reportvision-postgres-db-password"
  value        = random_string.postgres_password.result
  key_vault_id = azurerm_key_vault.this.id
}

