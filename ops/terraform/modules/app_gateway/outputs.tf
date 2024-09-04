output "fqdn" {
  value = azurerm_public_ip.lb-pip.fqdn
}

output "app_gateway_hostname" {
  value     = azurerm_application_gateway.load_balancer.id
  sensitive = true
}

output "app_gateway_ip" {
  value = azurerm_public_ip.lb-pip.ip_address
}