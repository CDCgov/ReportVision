resource "azurerm_virtual_network" "vnet" {
  name                = "${var.name}-vnet-${var.env}"
  resource_group_name = var.resource_group
  location            = var.location
  address_space       = [var.vnetcidr]
}

resource "azurerm_subnet" "appgw_subnet" {
  name                 = "${var.name}-appgw-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.appgwsubnetcidr]
  service_endpoints = [
    "Microsoft.Sql",
    "Microsoft.Storage",
  ]
}
resource "azurerm_subnet" "web-subnet" {
  name                 = "${var.name}-web-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.websubnetcidr]
  service_endpoints = [
    "Microsoft.Storage",
    "Microsoft.Web"
  ]
  depends_on = [azurerm_virtual_network.vnet]
}

resource "azurerm_subnet" "ocr-subnet" {
  name                 = "${var.name}-ocr-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.ocrsubnetcidr]

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

resource "azurerm_subnet" "middleware-subnet" {
  name                 = "${var.name}-middleware-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.middlewaresubnetcidr]

  delegation {
    name = "delegation"

    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_subnet" "db-subnet" {
  name                 = "${var.name}-db-subnet-${var.env}"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = var.resource_group
  address_prefixes     = [var.dbsubnetcidr]

  delegation {
    name = "postgresql-fs-delegation"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

resource "azurerm_private_dns_zone" "postgresql_dns_zone" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = var.resource_group
}

# Link Private DNS Zone to Virtual Network
resource "azurerm_private_dns_zone_virtual_network_link" "dns_link" {
  name                  = "postgresql-vnet-link"
  resource_group_name   = var.resource_group
  private_dns_zone_name = azurerm_private_dns_zone.postgresql_dns_zone.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
  depends_on            = [var.postgres_server_id]
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "app_service_firewall_rule" {
  name             = "allow-app-service"
  server_id        = var.postgres_server_id
  start_ip_address = cidrhost(var.middlewaresubnetcidr, 0)   # CIDR block start
  end_ip_address   = cidrhost(var.middlewaresubnetcidr, 255) # CIDR block end 
}

