resource "azurerm_key_vault" "this" {
  name                     = "reportvisionvault"
  location                 = var.location
  resource_group_name      = var.resource_group_name
  sku_name                 = "standard"
  tenant_id                = var.tenant_id
  soft_delete_enabled      = true
  purge_protection_enabled = true
}

resource "azurerm_key_vault_secret" "example_secret" {
  name         = "example-password"
  value        = "mysecretpassword"
  key_vault_id = azurerm_key_vault.example.id
}
