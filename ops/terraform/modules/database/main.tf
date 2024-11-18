# PostgreSQL Server
resource "azurerm_postgresql_server" "postgres_server" {
  name                         = "reportvisionpgserver"
  location                     = data.azurerm_resource_group.rg.location
  resource_group_name          = data.azurerm_resource_group.rg.name
  sku_name                     = var.sku_name
  version                      = var.engine_version
  administrator_login          = var.db_username
  administrator_login_password = random_string.setup_rds_password.result
  storage_mb                   = 5120 # 5 GB storage
  backup_retention_days        = 7
  ssl_enforcement_enabled      = true

  # Enable Virtual Network service endpoint
  virtual_network_subnet_id = var.subnet

}

# PostgreSQL Database
resource "azurerm_postgresql_database" "postgres_db" {
  name                = "postgresdb"
  resource_group_name = data.azurerm_resource_group.rg.name
  server_name         = azurerm_postgresql_server.postgres_server.name
  charset             = "UTF8"
  collation           = "English_United Kingdom.1252"
}

# Firewall rule for the PostgreSQL server, allowing 
# db access to Azure services in same resource group
resource "azurerm_postgresql_firewall_rule" "allow_azure" {
  name                = "AllowAllAzureIps"
  server_name         = azurerm_postgresql_server.postgres_server.name
  resource_group_name = data.azurerm_resource_group.rg.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "random_string" "setup_rds_password" {
  length = 13

  # Character set that excludes problematic characters like quotes, backslashes, etc.
  override_special = "_!@#-$%^&*()[]{}"
}

