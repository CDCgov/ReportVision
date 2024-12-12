output "postgres_server_id" {
  value = azurerm_postgresql_flexible_server.postgres_flexible_server.id
}

output "postgres_fqdn" {
  value       = azurerm_postgresql_flexible_server.postgres_flexible_server.fqdn
  description = "The fully qualified domain name (FQDN) of the PostgreSQL flexible server"
}

output "postgres_user" {
  value       = var.db_username
  description = "User name for the Application's PostgreSQL flexible server database"
}


output "postgres_db_name" {
  value = azurerm_postgresql_flexible_server.postgres_flexible_server.name
}

# output "postgres_fs_server" {
#   value = azurerm_postgresql_flexible_server.postgres_flexible_server.postgres_flexible_server
# }
