resource "azurerm_network_security_group" "web-nsg" {
  name                = "${var.name}-web-nsg-${var.env}"
  location            = var.location
  resource_group_name = var.resource_group

  # security_rule {
  #   name                       = "ssh-rule-1"
  #   priority                   = 121
  #   direction                  = "Inbound"
  #   access                     = "Allow"
  #   protocol                   = "*"
  #   source_address_prefix      = "*"
  #   source_port_range          = "*"
  #   destination_address_prefix = "*"
  #   destination_port_range     = "*"
  # }

  # security_rule {
  #   name                       = "ssh-rule-2"
  #   priority                   = 120
  #   direction                  = "Inbound"
  #   access                     = "Allow"
  #   protocol                   = "*"
  #   source_address_prefix      = "192.168.3.0/24"
  #   source_port_range          = "*"
  #   destination_address_prefix = "*"
  #   destination_port_range     = "*"
  # }
}

resource "azurerm_subnet_network_security_group_association" "web-nsg-subnet" {
  depends_on                = [azurerm_network_security_rule.ag_nsg_rule_inbound]
  subnet_id                 = var.lb_subnet_id
  network_security_group_id = azurerm_network_security_group.web-nsg.id
}

locals {
  ag_inbound_ports_map = {
    "100" : "80", # If the key starts with a number, you must use the colon syntax ":" instead of "="
    "110" : "443",
    "130" : "65200-65535",
    "140" : "8080"
  }
}

resource "azurerm_network_security_rule" "ag_nsg_rule_inbound" {
  for_each                    = local.ag_inbound_ports_map
  name                        = "Rule-Port-${each.value}"
  priority                    = each.key
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = each.value
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group
  network_security_group_name = azurerm_network_security_group.web-nsg.name
}


# resource "azurerm_network_security_group" "app-nsg" {
#     name = "app-nsg"
#     location = var.location
#     resource_group_name = var.resource_group

#     security_rule {
#         name = "ssh-rule-1"
#         priority = 100
#         direction = "Inbound"
#         access = "Allow"
#         protocol = "Tcp"
#         source_address_prefix = "192.168.1.0/24"
#         source_port_range = "*"
#         destination_address_prefix = "*"
#         destination_port_range = "22"
#     }

#     security_rule {
#         name = "ssh-rule-2"
#         priority = 101
#         direction = "Outbound"
#         access = "Allow"
#         protocol = "Tcp"
#         source_address_prefix = "192.168.1.0/24"
#         source_port_range = "*"
#         destination_address_prefix = "*"
#         destination_port_range = "22"
#     }
# }

# resource "azurerm_subnet_network_security_group_association" "app-nsg-subnet" {
#   subnet_id                 = var.app_subnet_id
#   network_security_group_id = azurerm_network_security_group.app-nsg.id
# }


# resource "azurerm_network_security_group" "db-nsg" {
#     name = "db-nsg"
#     location = var.location
#     resource_group_name = var.resource_group

#     security_rule {
#         name = "ssh-rule-1"
#         priority = 101
#         direction = "Inbound"
#         access = "Allow"
#         protocol = "Tcp"
#         source_address_prefix = "192.168.2.0/24"
#         source_port_range = "*"
#         destination_address_prefix = "*"
#         destination_port_range = "3306"
#     }

#     security_rule {
#         name = "ssh-rule-2"
#         priority = 102
#         direction = "Outbound"
#         access = "Allow"
#         protocol = "Tcp"
#         source_address_prefix = "192.168.2.0/24"
#         source_port_range = "*"
#         destination_address_prefix = "*"
#         destination_port_range = "3306"
#     }

#     security_rule {
#         name = "ssh-rule-3"
#         priority = 100
#         direction = "Outbound"
#         access = "Deny"
#         protocol = "Tcp"
#         source_address_prefix = "192.168.1.0/24"
#         source_port_range = "*"
#         destination_address_prefix = "*"
#         destination_port_range = "3306"
#     }
# }

# resource "azurerm_subnet_network_security_group_association" "db-nsg-subnet" {
#   subnet_id                 = var.db_subnet_id
#   network_security_group_id = azurerm_network_security_group.db-nsg.id
# }