resource "azurerm_public_ip" "lb-pip" {
  name                = "${var.name}-pip-lb-${var.env}"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_location
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = var.tags
}

# since these variables are re-used - a locals block makes this more maintainable
locals {
  backend_address_pool_name_static = "${var.name}-${var.env}-beap-static"
  backend_address_pool_name_api_ocr    = "${var.name}-${var.env}-beap-api-ocr"
  backend_address_pool_name_api_middleware    = "${var.name}-${var.env}-beap-api"
  frontend_port_name_api_ocr           = "${var.name}-${var.env}-feport-api-ocr"
  frontend_port_name_api_middleware           = "${var.name}-${var.env}-feport-api"
  frontend_port_name_static        = "${var.name}-${var.env}-feport-static"
  frontend_ip_configuration_name   = "${var.name}-${var.env}-feip"
  http_setting_name_static         = "${var.name}-${var.env}-be-htst-static"
  http_setting_name_api_ocr            = "${var.name}-${var.env}-be-htst-api-ocr"
  http_setting_name_api_middleware            = "${var.name}-${var.env}-be-htst-api"
  listener_name_static             = "${var.name}-${var.env}-httplstn-static"
  listener_name_api_ocr                = "${var.name}-${var.env}-httplstn-api-ocr"
  listener_name_api_middleware                = "${var.name}-${var.env}-httplstn-api"
  request_routing_rule_name_api_ocr    = "${var.name}-${var.env}-rqrt-api-ocr"
  request_routing_rule_name_api_middleware    = "${var.name}-${var.env}-rqrt-api"
  request_routing_rule_name_static = "${var.name}-${var.env}-rqrt-static"
  redirect_configuration_name      = "${var.name}-${var.env}-rdrcfg"
  static_probe_name_app            = "${var.name}-${var.env}-be-probe-app-static"
  api_probe_name_app_ocr               = "${var.name}-${var.env}-be-probe-app-api-ocr"
  api_probe_name_app_middleware               = "${var.name}-${var.env}-be-probe-app-api_middleware"
  redirect_rule                    = "${var.name}-${var.env}-redirect"
}

resource "azurerm_application_gateway" "load_balancer" {
  name                = "${var.name}-appgateway-${var.env}"
  resource_group_name = var.resource_group_name
  location            = var.resource_group_location

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = "${var.name}-gateway-ip-configuration"
    subnet_id = var.lb_subnet
  }

  # ------- Static -------------------------
  backend_address_pool {
    name  = local.backend_address_pool_name_static
    fqdns = [var.blob_endpoint]
  }

  backend_http_settings {
    name                                = local.http_setting_name_static
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 60
    pick_host_name_from_backend_address = true
    probe_name                          = local.static_probe_name_app
  }

  probe {
    name                                      = local.static_probe_name_app
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    protocol                                  = "Https"
    port                                      = 443
    path                                      = "/"
    pick_host_name_from_backend_http_settings = true
  }

  # ------- OCR API -------------------------
  backend_address_pool {
    name         = local.backend_address_pool_name_api_ocr
    fqdns        = [var.fqdns_ocr]
    ip_addresses = var.ip_addresses
  }

  backend_http_settings {
    name                                = local.http_setting_name_api_ocr
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 120
    pick_host_name_from_backend_address = true
    probe_name                          = local.api_probe_name_app_ocr
  }

  probe {
    name                                      = local.api_probe_name_app_ocr
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    protocol                                  = "Https"
    port                                      = 443
    path                                      = "/"
    pick_host_name_from_backend_http_settings = true
    match {
      body        = "UP"
      status_code = [200]
    }
  }

  # ------- Middleware API -------------------------
  backend_address_pool {
    name         = local.backend_address_pool_name_api_middleware
    fqdns        = [var.fqdns_middleware]
    ip_addresses = var.ip_addresses
  }

  backend_http_settings {
    name                                = local.http_setting_name_api_middleware
    cookie_based_affinity               = "Disabled"
    port                                = 443
    protocol                            = "Https"
    request_timeout                     = 120
    pick_host_name_from_backend_address = true
    probe_name                          = local.api_probe_name_app_middleware
  }

  probe {
    name                                      = local.api_probe_name_app_middleware
    interval                                  = 30
    timeout                                   = 30
    unhealthy_threshold                       = 3
    protocol                                  = "Https"
    port                                      = 443
    path                                      = "/api"
    pick_host_name_from_backend_http_settings = true
    match {
      body        = "UP"
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
    name                           = local.listener_name_api_ocr
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name_static
    protocol                       = "Http"
    host_names                     = [var.fqdns_ocr]
  }

  http_listener {
    name                           = local.listener_name_api_middleware
    frontend_ip_configuration_name = local.frontend_ip_configuration_name
    frontend_port_name             = local.frontend_port_name_static
    protocol                       = "Http"
    host_names                     = [var.fqdns_middleware]
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
    name                       = local.request_routing_rule_name_api_ocr
    priority                   = 100
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name_api_ocr
    backend_address_pool_name  = local.backend_address_pool_name_api_ocr
    backend_http_settings_name = local.http_setting_name_api_ocr
  }

  request_routing_rule {
    name                       = local.request_routing_rule_name_api_middleware
    priority                   = 150
    rule_type                  = "Basic"
    http_listener_name         = local.listener_name_api_middleware
    backend_address_pool_name  = local.backend_address_pool_name_api_middleware
    backend_http_settings_name = local.http_setting_name_api_middleware
  }

  url_path_map {
    name                               = "${var.name}-${var.env}-urlmap"
    default_backend_address_pool_name  = local.backend_address_pool_name_static
    default_backend_http_settings_name = local.http_setting_name_static
    default_rewrite_rule_set_name      = "${var.name}-routing"

    path_rule {
      name                       = "ocr"
      paths                      = ["/ocr-api/*", "/ocr-api"]
      backend_address_pool_name  = local.backend_address_pool_name_api_ocr
      backend_http_settings_name = local.http_setting_name_api_ocr
      // this is the default, why would we set it again?
      // because if we don't do this we get 404s on API calls
      rewrite_rule_set_name = "${var.name}-ocr-routing"
    }
    path_rule {
      name                       = "middleware"
      paths                      = ["/middleware-api/*", "/middleware-api"]
      backend_address_pool_name  = local.backend_address_pool_name_api_middleware
      backend_http_settings_name = local.http_setting_name_api_middleware
      rewrite_rule_set_name = "${var.name}-middleware-routing"
    }
  }
  rewrite_rule_set {
    name = "${var.name}-ocr-routing"

    rewrite_rule {
      name          = "ocr-api-wildcard"
      rule_sequence = 101
      condition {
        ignore_case = true
        negate      = false
        pattern     = ".*ocr-api/(.*)"
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

  rewrite_rule_set {
    name = "${var.name}-middleware-routing"

    rewrite_rule {
      name          = "middleware-api-wildcard"
      rule_sequence = 101
      condition {
        ignore_case = true
        negate      = false
        pattern     = ".*middleware-api/(.*)"
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