# Azure Postgres Single Service (azurerm_postgresql_server) retires in March 2025.  
# As a result we are using Azure Database for PostgreSQL Flexible Server
# with granular control, flexibility and better cost optimization. 
resource "azurerm_postgresql_flexible_server" "postgres_flexible_server" {
  name                  = "reportvisionpostgresql-flexible-server"
  location              = var.location
  resource_group_name   = var.resource_group_name
  sku_name              = var.sku_name
  version               = var.engine_version
  storage_mb            = 32768 # 32 GB, the lowest of the valid options
  backup_retention_days = 7

  administrator_login    = var.db_username
  administrator_password = random_string.setup_rds_password.result
  delegated_subnet_id    = var.subnet
  private_dns_zone_id    = var.private_dns_zone_id

  # Disable Public Network Access 
  public_network_access_enabled = false

  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_postgresql_flexible_server_database" "postgres_db" {
  name      = "${azurerm_postgresql_flexible_server.postgres_flexible_server.name}-db"
  server_id = azurerm_postgresql_flexible_server.postgres_flexible_server.id
}

# Random string resource for the postgres password
resource "random_string" "setup_rds_password" {
  length = 16 # Length of the password

  # Character set that excludes problematic characters like quotes, backslashes, etc.
  override_special = "_!@#-$%^&*()[]{}"
}
