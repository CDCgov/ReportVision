resource "azurerm_role_assignment" "key_vault_access" {
  principal_id         = var.object_id
  role_definition_name = azurerm_role_definition.postgres_key_vault_role_definition.name # Custom role name
  scope                = azurerm_key_vault.this.id
}

# Where the vault role will be applied to our postgres database
resource "azurerm_role_assignment" "postgres_key_vault_secrets_user_access" {
  #   scope                = azurerm_key_vault.this.id
  scope                = var.postgres_server_id
  role_definition_name = "Postgres Key Vault Secrets User"
  principal_id         = var.object_id
}


resource "azurerm_key_vault_access_policy" "key_vault_db_access_policy" {
  key_vault_id = azurerm_key_vault.this.id
  tenant_id    = var.tenant_id
  object_id    = var.object_id

  secret_permissions = [
    "Get",
    "List",
    "Set", # This allows creating/updating secrets
  ]
}

resource "azurerm_role_definition" "postgres_key_vault_role_definition" {
  name = "Postgres Key Vault Role Definition"
  #   scope       = "/subscriptions/${var.subscription_id}/${azurerm_key_vault.this.id}/resourceGroups/${var.resource_group_name}"
  scope       = "/subscriptions/${var.subscription_id}/resourceGroups/${var.resource_group_name}/providers/Microsoft.KeyVault/vaults/${azurerm_key_vault.this.name}"
  description = "Custom role to allow access to Key Vault secrets for PostgreSQL"
  permissions {
    actions = [
      "Microsoft.KeyVault/vaults/secrets/get",
      "Microsoft.KeyVault/vaults/secrets/list"
    ]
    not_actions = []
  }
  # Scope at which the role will be assigned
  assignable_scopes = [
    azurerm_key_vault.this.id
  ]
  #   assignable_scopes = [
  #     "/subscriptions/${var.subscription_id}/${azurerm_key_vault.this.id}/resourceGroups/${var.resource_group_name}" # Use a direct subscription/resource group scope
  #     # azurerm_key_vault.this.id
  #   ]
}



