resource "azurerm_key_vault" "this" {
  name                     = "reportvisionvault"
  location                 = var.location
  resource_group_name      = var.resource_group_name
  sku_name                 = "standard"
  tenant_id                = data.azurerm_client_config.current.tenant_id
  purge_protection_enabled = true

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
      "List",
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Recover",
      "List",
    ]
  }

}

# Random string resource for the postgres password
resource "random_string" "postgres_password" {
  length           = 16
  override_special = "_!@#-$%^&*()[]{}" # excluded characters
}

resource "azurerm_key_vault_secret" "postgres_db_password" {
  name         = "reportvision-postgres-db-password"
  value        = random_string.postgres_password.result
  key_vault_id = azurerm_key_vault.this.id

  depends_on = [azurerm_key_vault.this]
}
