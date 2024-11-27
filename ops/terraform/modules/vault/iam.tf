# Assuming you have a resource (e.g., VM) with a system-assigned managed identity
resource "azurerm_role_assignment" "key_vault_access" {
  scope                = azurerm_key_vault.this.id
  role_definition_name = "Postgres Key Vault Secrets User"                                 
  principal_id         = 
}
