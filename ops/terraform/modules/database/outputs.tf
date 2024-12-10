output "postgres_server_id" {
  value = azurerm_postgresql_flexible_server.postgres_flexible_server.id
}

#TODO: Triple Check
output "postgres_fqdn" {
  value       = azurerm_postgresql_flexible_server.postgres_flexible_server.fqdn
  description = "The fully qualified domain name (FQDN) of the PostgreSQL flexible server"
}

output "postgres_user" {
  value       = var.db_username
  description = "User name for the Application's PostgreSQL flexible server database"
}

output "postgres_db_name" {
  value = var.db_username
}

#TODO: DO I NEED THIS
output "db_username" {
  value = azurerm_postgresql_flexible_server.postgres_flexible_server.administrator_login
}
