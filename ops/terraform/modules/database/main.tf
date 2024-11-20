# Azure Postgres Single Service (azurerm_postgresql_server) retires in March 2025.  
# As a result we are using Azure Database for PostgreSQL Flexible Server
# with granular control, flexibility and better cost optimization. 
resource "azurerm_postgresql_flexible_server" "postgres_flexible_server" {
  name                  = "reportvisionpostgresql-flex-server"
  location              = var.location
  resource_group_name   = var.resource_group_name
  sku_name              = var.sku_name
  version               = var.engine_version
  storage_mb            = 32768 # 32 GB, the lowest of the valid options
  backup_retention_days = 7

  high_availability {
    mode = "ZoneRedundant"
  }

  administrator_login    = var.db_username
  administrator_password = random_string.setup_rds_password.result
  delegated_subnet_id    = var.subnet
}

resource "azurerm_postgresql_flexible_server_database" "postgres_db" {
  name      = azurerm_postgresql_flexible_server.postgres_flexible_server.name
  server_id = azurerm_postgresql_flexible_server.postgres_flexible_server.id
}
