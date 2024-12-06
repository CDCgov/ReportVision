output "postgres_server_id" {
  value = azurerm_postgresql_flexible_server.postgres_flexible_server
}

output "postgres_fqdn" {
  value       = azurerm_postgresql_flexible_server.postgres_flexible_server
  description = "The fully qualified domain name (FQDN) of the PostgreSQL flexible server"
}

output "postgres_user" {
  value       = var.db_username
  description = "User name for the Application's PostgreSQL flexible server database"
}

output "postgres_db_name" {
  value = var.db_username
}
