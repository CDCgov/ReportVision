resource "random_password" "password" {
  length = 24
  special = false
  upper = false
}

resource "azurerm_storage_account" "frontend" {
  account_replication_type   = "GRS"
  account_tier               = "Standard"
  account_kind               = "StorageV2"
  location                   = var.location
  resource_group_name        = var.resource_group
  name                       = "${var.env == "demo" ? random_password.password.result : "${var.name}frontend${var.env}"}"
  https_traffic_only_enabled = true

  static_website {
    index_document     = "index.html"
    error_404_document = "error.html"
  }
  tags = var.management_tags
}

resource "azurerm_storage_account_network_rules" "frontend_rules" {
  storage_account_id = azurerm_storage_account.frontend.id

  default_action             = "Allow"
  ip_rules                   = [var.app_gateway_ip]
  virtual_network_subnet_ids = [var.web_subnet_id]
}