output "postgres_db_admin_password" {
  value = azurerm_postgresql_server.postgres_server.administrator_login_password
}
