output "network_name" {
  value       = azurerm_virtual_network.vnet.name
  description = "Name of the Virtual network"
}

output "websubnet_id" {
  value       = azurerm_subnet.web-subnet.id
  description = "Id of websubnet in the network"
}

output "appgwsubnet_id" {
  value       = azurerm_subnet.appgw_subnet.id
  description = "ID of the appgwsubnet in the network"
}

output "dbsubnet_id" {
  value       = azurerm_subnet.db-subnet.id
  description = "Id of dbsubnet in the network"
}

output "lbsubnet_id" {
  value       = azurerm_subnet.lb-subnet.id
  description = "Id of lbsubnet in the network"
}

output "ocrsubnet_id" {
  value       = azurerm_subnet.ocr-subnet.id
  description = "Id of lbsubnet in the network"
}

output "middlewaresubnet_id" {
  value       = azurerm_subnet.middleware-subnet.id
  description = "Id of lbsubnet in the network"
}

output "private_dns_zone_id" {
  value       = azurerm_private_dns_zone.postgresql_dns_zone.id
  description = "Private DNS Zone for PostgreSQL Flexible Server"
}
