locals {
  workspaces = merge(local.dev, local.demo)
  workspace  = local.workspaces[terraform.workspace]

  management_tags = {
    environment    = local.environment
    resource_group = data.azurerm_resource_group.rg.name
  }
}

##########
## 02-network
##########
module "networking" {
  source            = "./modules/network"
  name              = var.name
  location          = data.azurerm_resource_group.rg.location
  resource_group    = data.azurerm_resource_group.rg.name
  vnetcidr          = local.workspace["vnetcidr"]
  websubnetcidr     = local.workspace["websubnetcidr"]
  lbsubnetcidr      = local.workspace["lbsubnetcidr"]
  ocrsubnetcidr     = local.workspace["ocrsubnetcidr"]
  backendsubnetcidr = local.workspace["backendsubnetcidr"]
  env               = local.environment
}

##########
## 02-security
##########

module "securitygroup" {
  source         = "./modules/security"
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  web_subnet_id  = module.networking.websubnet_id
  # db_subnet_id   = module.networking.dbsubnet_id
  lb_subnet_id = module.networking.lbsubnet_id
  env          = local.environment
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

  fqdns      = module.ocr_api.app_hostname
  depends_on = [module.networking, module.ocr_api]
}

##########
## 05-Persistent
##########

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

##########
## 06-App
##########

module "backend_api" {
  source         = "./modules/app_service"
  service        = local.backend-api
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  app_subnet_id  = module.networking.backendsubnet_id
  lb_subnet_id   = module.networking.lbsubnet_id
  env            = local.environment
  vnet           = module.networking.network_name
  sku_name       = var.sku_name
  https_only     = true
}

module "ocr_api" {
  source         = "./modules/app_service"
  service        = local.ocr-api
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  app_subnet_id  = module.networking.ocrsubnet_id
  lb_subnet_id   = module.networking.backendsubnet_id
  env            = local.environment
  vnet           = module.networking.network_name
  sku_name       = var.sku_name
  https_only     = true
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

# module "compute" {
#   source         = "./modules/container_instances"
#   location       = data.azurerm_resource_group.rg.location
#   resource_group = data.azurerm_resource_group.rg.name
#   environment    = local.environment
#   app_subnet     = module.networking.appsubnet_id
#   # web_subnet_id   = module.networking.websubnet_id
#   # app_subnet_id   = module.networking.appsubnet_id
#   # web_host_name   = local.app.web_host_name
#   # web_username    = local.app.web_username
#   # web_os_password = local.app.web_os_password
#   # app_host_name   = local.app.app_host_name
#   # app_username    = local.app.app_username
#   # app_os_password = local.app.app_os_password
# }

##########
## 04-config
##########

##########
## 07-Monitor
##########