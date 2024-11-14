resource "azurerm_key_vault" "key_vault" {
  name                = "reportvision_keyvault"
  location            = "eastus"
  resource_group_name = data.azurerm_resource_group.rg.name
  sku_name            = "standard"
  tenant_id           = var.azure_tenant_id

  access_policy {

    object_id = data.azurerm_client_config.example.object_id

    key_permissions = [
      "get",
      "list"
    ]

    secret_permissions = [
      "get",
      "list"
    ]
  }
}

# Saves the random password into Azure Key Vault
resource "azurerm_key_vault_secret" "postgres_password" {
  name         = "postgres-password"
  value        = azurerm_postgresql_server.postgres_db.administrator_login_password.result
  key_vault_id = azurerm_key_vault.key_vault.id
}
