resource "azurerm_key_vault" "key_vault" {
  name                = "reportvisionkeyvault"
  location            = "eastus"
  resource_group_name = var.resource_group_name
  sku_name            = "standard"
  tenant_id           = var.azure_tenant_id

  access_policy {
    object_id = var.object_id
    tenant_id = var.azure_tenant_id

    key_permissions = [
      "Get",   # Ensure the service principal can get secrets
      "Update" # Allow updating secrets
    ]

    secret_permissions = [
      "Get"
    ]
  }
}

# Stores and saves the PostgreSQL random password in Key Vault
resource "azurerm_key_vault_secret" "postgres_password" {
  name         = "postgres-password"
  value        = var.postgres_password
  key_vault_id = azurerm_key_vault.key_vault.id
}
