output "network_name" {
  value       = azurerm_virtual_network.vnet.name
  description = "Name of the Virtual network"
}

output "websubnet_id" {
  value       = azurerm_subnet.web-subnet.id
  description = "Id of websubnet in the network"
}

output "dbsubnet_id" {
  value       = azurerm_subnet.db-subnet.id
  description = "Id of dbsubnet in the network"
}

output "lbsubnet_id" {
  value       = azurerm_subnet.lb-subnet.id
  description = "Id of lbsubnet in the network"
}

output "appsubnet_id" {
  value       = azurerm_subnet.app-subnet.id
  description = "Id of lbsubnet in the network"
}

output "private_dns_zone_id" {
  value       = azurerm_private_dns_zone.postgresql_dns_zone.id
  description = "Private DNS Zone for PostgreSQL Flexible Server"
}
