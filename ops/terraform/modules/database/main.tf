# PostgreSQL Server
resource "azurerm_postgresql_server" "postgres_server" {
  name                         = "reportvisionpgserver"
  location                     = var.location
  resource_group_name          = var.resource_group_name
  sku_name                     = var.sku_name
  version                      = var.engine_version
  administrator_login          = var.db_username
  administrator_login_password = random_string.setup_rds_password.result
  storage_mb                   = 5120 # 5 GB storage
  backup_retention_days        = 7
  ssl_enforcement_enabled      = true
}

# PostgreSQL Database
resource "azurerm_postgresql_database" "postgres_db" {
  name                = "postgresdb"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_postgresql_server.postgres_server.name
  charset             = "UTF8"
  collation           = "English_United Kingdom.1252"
}

# Azure Postgres Single Service (azurerm_postgresql_server) retires in March 2025.  
# As a result we are using Azure Database for PostgreSQL Flexible Server
# with granular control, flexibility and better cost optimization. 
# resource "azurerm_postgresql_flexible_server" "postgres_flexible_server" {
#   name                  = "reportvisionpostgresql-flex-server"
#   location              = var.location
#   resource_group_name   = var.resource_group_name
#   sku_name              = var.sku_name
#   version               = var.engine_version
#   storage_mb            = 32768 # 32 GB, the lowest of the valid options
#   backup_retention_days = 7

#   high_availability {
#     mode = "ZoneRedundant"
#   }

#   administrator_login    = var.db_username
#   administrator_password = random_string.setup_rds_password.result
#   delegated_subnet_id    = var.subnet
# }

# resource "azurerm_postgresql_flexible_server_database" "postgres_db" {
#   name      = azurerm_postgresql_flexible_server.postgres_flexible_server.name
#   server_id = azurerm_postgresql_flexible_server.postgres_flexible_server.id
# }

# Random string resource for the postgres password
resource "random_string" "setup_rds_password" {
  length = 16 # Length of the password

  # Character set that excludes problematic characters like quotes, backslashes, etc.
  override_special = "_!@#-$%^&*()[]{}"
}
