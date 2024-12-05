output "app_hostname" {
  value = azurerm_linux_web_app.linux_webapp.default_hostname
}

output "service_plan_id" {
  value = azurerm_service_plan.asp.id
}

output "webapp_name" {
  value = azurerm_linux_web_app.linux_webapp.name
}

output "webapp_id" {
  value = azurerm_linux_web_app.linux_webapp.identity[0].principal_id
}
