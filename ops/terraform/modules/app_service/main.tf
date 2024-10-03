locals {
  app_settings = merge(var.app_settings, { WEBSITES_PORT = "8000" })
}

resource "azurerm_service_plan" "asp" {
  name                = "${var.name_ocr}-appserviceplan-${var.env}"
  location            = var.location
  os_type             = "Linux"
  resource_group_name = var.resource_group
  sku_name            = var.sku_name
}

resource "azurerm_linux_web_app" "linux_webapp" {
  name                          = "${var.name_ocr}-${var.env}"
  https_only                    = var.https_only
  location                      = var.location
  resource_group_name           = var.resource_group
  service_plan_id               = azurerm_service_plan.asp.id
  public_network_access_enabled = true

  app_settings = local.app_settings

  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on                         = "true"
    health_check_path                 = "/api"
    health_check_eviction_time_in_min = 5
    scm_minimum_tls_version           = "1.2"
    use_32_bit_worker                 = false
    ftps_state                        = "Disabled"
    vnet_route_all_enabled            = false

    application_stack {
      docker_image_name   = "cdcgov/reportvision-ocr-api:derek-main-dev"
      docker_registry_url = "https://ghcr.io"
    }

    ip_restriction {
      virtual_network_subnet_id = var.app_subnet_id
      action                    = "Allow"
    }
  }
}