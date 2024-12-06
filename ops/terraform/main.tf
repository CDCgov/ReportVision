locals {
  workspaces = merge(local.dev, local.demo)
  workspace  = local.workspaces[terraform.workspace]

  management_tags = {
    environment    = local.environment
    resource_group = data.azurerm_resource_group.rg.name
  }
}

module "networking" {
  source               = "./modules/network"
  name                 = var.name
  location             = data.azurerm_resource_group.rg.location
  resource_group       = data.azurerm_resource_group.rg.name
  vnetcidr             = local.workspace["vnetcidr"]
  websubnetcidr        = local.workspace["websubnetcidr"]
  lbsubnetcidr         = local.workspace["lbsubnetcidr"]
  ocrsubnetcidr        = local.workspace["ocrsubnetcidr"]
  middlewaresubnetcidr = local.workspace["middlewaresubnetcidr"]
  dbsubnetcidr         = local.workspace["dbsubnetcidr"]
  env                  = local.environment
}

module "securitygroup" {
  source         = "./modules/security"
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  web_subnet_id  = module.networking.websubnet_id
  db_subnet_id   = module.networking.dbsubnet_id
  lb_subnet_id   = module.networking.lbsubnet_id
  env            = local.environment
}

module "app_gateway" {
  source                  = "./modules/app_gateway"
  name                    = var.name
  resource_group_location = data.azurerm_resource_group.rg.location
  resource_group_name     = data.azurerm_resource_group.rg.name

  blob_endpoint = module.storage.primary_web_host
  lb_subnet     = module.networking.lbsubnet_id
  tags          = local.management_tags
  env           = local.environment

  fqdns_ocr        = module.ocr_api.app_hostname
  fqdns_middleware = module.middleware_api.app_hostname
  depends_on       = [module.networking, module.ocr_api, module.middleware_api]
}

module "storage" {
  source          = "./modules/storage"
  name            = var.name
  location        = data.azurerm_resource_group.rg.location
  resource_group  = data.azurerm_resource_group.rg.name
  env             = local.environment
  management_tags = local.management_tags
  app_gateway_ip  = module.app_gateway.app_gateway_ip
  web_subnet_id   = module.networking.websubnet_id
}

module "middleware_api" {
  source         = "./modules/app_service"
  service        = local.middleware-api
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  app_subnet_id  = module.networking.middlewaresubnet_id

  app_settings = {
    WEBSITES_PORT = "8081"
  }

  lb_subnet_id = module.networking.lbsubnet_id
  health_path = "/actuator/health"
  env          = local.environment
  vnet         = module.networking.network_name
  sku_name     = var.sku_name
  https_only   = true
  depends_on   = [module.networking.middlewaresubnet_id, module.networking.lbsubnet_id]
}

module "ocr_api" {
  source         = "./modules/app_service"
  service        = local.ocr-api
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  app_subnet_id  = module.networking.ocrsubnet_id

  app_settings = {
    WEBSITES_PORT = "8000"
  }

  lb_subnet_id   = module.networking.middlewaresubnet_id
  env            = local.environment
  vnet           = module.networking.network_name
  sku_name       = var.sku_name
  https_only     = true
  depends_on     = [module.networking.ocrsubnet_id, module.networking.middlewaresubnet_id]
}

module "ocr_autoscale" {
  source             = "./modules/app_service_autoscale"
  service            = local.ocr-api
  name               = var.name
  location           = data.azurerm_resource_group.rg.location
  env                = local.environment
  resource_group     = data.azurerm_resource_group.rg.name
  target_resource_id = module.ocr_api.service_plan_id

  peak_capacity_instances    = 2
  weekend_capacity_instances = 1
}

module "database" {
  source              = "./modules/database"
  env                 = local.environment
  resource_group_name = data.azurerm_resource_group.rg.name
  subnet              = module.networking.dbsubnet_id
  private_dns_zone_id = module.networking.private_dns_zone_id
}
