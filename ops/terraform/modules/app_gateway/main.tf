resource "azurerm_public_ip" "lb-pip" {
  name                = "pip-idwa-lb"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = var.tags
}

# since these variables are re-used - a locals block makes this more maintainable
locals {
  backend_address_pool_name_static = "${var.vnet-name}-beap-static"
  backend_address_pool_name_api    = "${var.vnet-name}-beap-api"
  frontend_port_name_api           = "${var.vnet-name}-feport-api"
  frontend_port_name_static        = "${var.vnet-name}-feport-static"
  frontend_ip_configuration_name   = "${var.vnet-name}-feip"
  http_setting_name_static         = "${var.vnet-name}-be-htst-static"
  http_setting_name_api            = "${var.vnet-name}-be-htst-api"
  listener_name_static             = "${var.vnet-name}-httplstn-static"
  listener_name_api                = "${var.vnet-name}-httplstn-api"
  request_routing_rule_name_api    = "${var.vnet-name}-rqrt-api"
  request_routing_rule_name_static = "${var.vnet-name}-rqrt-static"
  redirect_configuration_name      = "${var.vnet-name}-rdrcfg"
  static_probe_name_app            = "${var.vnet-name}-be-probe-app-static"
  api_probe_name_app               = "${var.vnet-name}-be-probe-app-api"
  redirect_rule                    = "${var.vnet-name}-redirect"
}

resource "azurerm_application_gateway" "load_balancer" {
  name                = "idwa-appgateway"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "idwa-gateway-ip-configuration"
    subnet_id = var.web-subnet
  }

  # ------- Static -------------------------
  backend_address_pool {
    name  = local.backend_address_pool_name_static
    fqdns = [var.blob_endpoint]
  }

  backend_http_settings {
    name                                = local.http_setting_name_static
    cookie_based_affinity               = "Disabled"
    port                                = 80
    protocol                            = "Http"
    request_timeout                     = 60
    path                                = "/"
    pick_host_name_from_backend_address = true
    probe_name                          = local.static_probe_name_app
  }

  probe {
    name                                      = local.static_probe_name_app
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    protocol                                  = "Http"
    port                                      = 80
    path                                      = "/"
    pick_host_name_from_backend_http_settings = true
  }

  # ------- OCR API -------------------------
  backend_address_pool {
    name         = local.backend_address_pool_name_api
    fqdns        = [var.fqdns]
    ip_addresses = var.ip_addresses
  }

  backend_http_settings {
    name                                = local.http_setting_name_api
    cookie_based_affinity               = "Disabled"
    port                                = 80
    protocol                            = "Http"
    request_timeout                     = 120
    path                                = "/api"
    pick_host_name_from_backend_address = true
    probe_name                          = local.api_probe_name_app
  }

  probe {
    name                                      = local.api_probe_name_app
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    protocol                                  = "Http"
    port                                      = 80
    path                                      = "/"
    pick_host_name_from_backend_http_settings = true
    match {
      body        = "Hello Universe!"
      status_code = [200]
    }
  }

  # ------- Listeners -------------------------
  frontend_ip_configuration {
    name                 = local.frontend_ip_configuration_name
    public_ip_address_id = azurerm_public_ip.lb-pip.id
  }

  # --- HTTP Listener

  frontend_port {
    name = local.frontend_port_name_static
    port = 80
  }

  http_listener {
    name                           = local.listener_name_api
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name_static
    protocol                       = "Http"
    host_names                     = [var.fqdns]
  }

  http_listener {
    name                           = local.listener_name_static
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name_static
    protocol                       = "Http"
    host_names                     = [var.blob_endpoint]
  }

  # ------- Routing -------------------------
  request_routing_rule {
    name                       = local.request_routing_rule_name_static
    priority                   = 200
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name_static
    backend_address_pool_name  = local.backend_address_pool_name_static
    backend_http_settings_name = local.http_setting_name_static
  }

  request_routing_rule {
    name                       = local.request_routing_rule_name_api
    priority                   = 100
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name_api
    backend_address_pool_name  = local.backend_address_pool_name_api
    backend_http_settings_name = local.http_setting_name_api
  }


  url_path_map {
    name                               = "${var.vnet-name}-urlmap"
    default_backend_address_pool_name  = local.backend_address_pool_name_static
    default_backend_http_settings_name = local.http_setting_name_static
    default_rewrite_rule_set_name      = "mde-routing"

    path_rule {
      name                       = "api"
      paths                      = ["/api/*", "/api"]
      backend_address_pool_name  = local.backend_address_pool_name_api
      backend_http_settings_name = local.http_setting_name_api
      // this is the default, why would we set it again?
      // because if we don't do this we get 404s on API calls
      rewrite_rule_set_name = "mde-routing"
    }
  }
  rewrite_rule_set {
    name = "mde-routing"

    rewrite_rule {
      name          = "api-wildcard"
      rule_sequence = 101
      condition {
        ignore_case = true
        negate      = false
        pattern     = ".*api/(.*)"
        variable    = "var_uri_path"
      }

      url {
        path    = "/{var_uri_path_1}"
        reroute = false
        # Per documentation, we should be able to leave this pass-through out. See however
        # https://github.com/terraform-providers/terraform-provider-azurerm/issues/11563
        query_string = "{var_query_string}"
      }
    }
  }
}