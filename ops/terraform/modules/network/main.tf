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
  depends_on            = [azurerm_subnet.db-subnet]
}

# Create private endpoint for SQL server
resource "azurerm_private_endpoint" "psql_db_pivate_endpoint" {
  name                = "psql-private-endpoint-${var.env}"
  location            = var.location
  resource_group_name = var.resource_group
  subnet_id           = azurerm_subnet.db-subnet.id

  private_service_connection {
    name                           = "psql-private-serviceconnection-${var.env}"
    private_connection_resource_id = var.postgres_server_id
    subresource_names              = ["psqlServer"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.postgresql_dns_zone.id]
  }
}
