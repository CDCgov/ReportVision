output "app_gateway_ip" {
  value = azurerm_public_ip.lb-pip.ip_address
}