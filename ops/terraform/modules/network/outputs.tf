output "network_name" {
  value       = azurerm_virtual_network.vnet.name
  description = "Name of the Virtual network"
}

output "websubnet_id" {
  value       = azurerm_subnet.web-subnet.id
  description = "Id of websubnet in the network"
}

# output "dbsubnet_id" {
#   value       = azurerm_subnet.db-subnet.id
#   description = "Id of dbsubnet in the network"
# }

output "lbsubnet_id" {
  value       = azurerm_subnet.lb-subnet.id
  description = "Id of lbsubnet in the network"
}

output "ocrsubnet_id" {
  value       = azurerm_subnet.ocr-subnet.id
  description = "Id of lbsubnet in the network"
}

output "backendsubnet_id" {
  value       = azurerm_subnet.backend-subnet.id
  description = "Id of lbsubnet in the network"
}