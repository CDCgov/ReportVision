resource "azurerm_virtual_network" "vnet" {
  name                = "${var.name}-vnet-${var.env}"
  resource_group_name = var.resource_group
  location            = var.location
  address_space       = [var.vnetcidr]
}

resource "azurerm_subnet" "web-subnet" {
  name                 = "${var.name}-web-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.websubnetcidr]
  service_endpoints    = [
    "Microsoft.Storage",
    "Microsoft.Web"
  ]
  depends_on           = [azurerm_virtual_network.vnet]
}

resource "azurerm_subnet" "app-subnet" {
  name                 = "${var.name}-app-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.appsubnetcidr]

  delegation {
    name = "delegation"

    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_subnet" "lb-subnet" {
  name                 = "${var.name}-lb-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.lbsubnetcidr]
  service_endpoints = [
    "Microsoft.Storage",
    "Microsoft.Web"
  ]
  depends_on = [azurerm_virtual_network.vnet]
}

# resource "azurerm_subnet" "db-subnet" {
#   name                 = "${var.name}-db-subnet-${var.env}"
#   virtual_network_name = azurerm_virtual_network.vnet.name
#   resource_group_name  = var.resource_group
#   address_prefixes     = [var.dbsubnetcidr]
# }