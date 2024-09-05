resource "azurerm_virtual_network" "vnet1" {
  name                = "vnet01"
  resource_group_name = var.resource_group
  location            = var.location
  address_space       = [var.vnetcidr]
}

resource "azurerm_subnet" "web-subnet" {
  name                 = "web-subnet"
  virtual_network_name = azurerm_virtual_network.vnet1.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.websubnetcidr]
  service_endpoints    = ["Microsoft.Storage"]
  depends_on           = [azurerm_virtual_network.vnet1]
}

resource "azurerm_subnet" "app-subnet" {
  name                 = "app-subnet"
  virtual_network_name = azurerm_virtual_network.vnet1.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.appsubnetcidr]

  delegation {
    name = "delegation"

    service_delegation {
      name    = "Microsoft.ContainerInstance/containerGroups"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_subnet" "lb-subnet" {
  name                 = "lb-subnet"
  virtual_network_name = azurerm_virtual_network.vnet1.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.lbsubnetcidr]
  depends_on           = [azurerm_virtual_network.vnet1]
}

resource "azurerm_subnet" "db-subnet" {
  name                 = "db-subnet"
  virtual_network_name = azurerm_virtual_network.vnet1.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.dbsubnetcidr]
}