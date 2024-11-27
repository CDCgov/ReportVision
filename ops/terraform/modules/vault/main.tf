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

# resource "azurerm_postgresql_flexible_server_vnet_rule" "postgres_middleware_vnet_rule" {
#   name                      = "allow-reportvision-middleware-and-postgres-vnet-access"
#   resource_group_name       = azurerm_postgresql_flexible_server.this.resource_group_name
#   server_name               = azurerm_postgresql_flexible_server.this.name
#   virtual_network_subnet_id = azurerm_subnet.middlewaresubnetcidr.id # Only allow access from the middleware subnet
# }

