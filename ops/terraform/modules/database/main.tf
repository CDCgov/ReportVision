# Azure Postgres Single Service (azurerm_postgresql_server) retires in March 2025.  
# As a result we are using Azure Database for PostgreSQL Flexible Server
# with granular control, flexibility and better cost optimization. 
resource "azurerm_postgresql_flexible_server" "postgres_flexible_server" {
  name                  = "reportvisionpostgresql-flexible-server-${var.env}"
  location              = var.location
  resource_group_name   = var.resource_group_name
  sku_name              = var.postgres_sku_name
  version               = var.engine_version
  storage_mb            = 32768 # 32 GiB storage for B_Standard_B1ms
  backup_retention_days = 7

  administrator_login    = var.db_username
  administrator_password = var.postgres_password
  delegated_subnet_id    = var.subnet
  private_dns_zone_id    = var.private_dns_zone_id

  # Disable Public Network Access 
  public_network_access_enabled = false

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "postgres_db" {
  name      = "${azurerm_postgresql_flexible_server.postgres_flexible_server.name}-db"
  server_id = azurerm_postgresql_flexible_server.postgres_flexible_server.id
}
