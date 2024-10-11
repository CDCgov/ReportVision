locals {
  management_tags = {
    environment    = local.environment
    resource_group = data.azurerm_resource_group.dev.name
  }
}

##########
## 02-network
##########
module "networking" {
  source         = "./modules/network"
  name           = var.name
  location       = data.azurerm_resource_group.dev.location
  resource_group = data.azurerm_resource_group.dev.name
  vnetcidr       = local.network.config.vnetcidr
  websubnetcidr  = local.network.config.websubnetcidr
  appsubnetcidr  = local.network.config.appsubnetcidr
  lbsubnetcidr   = local.network.config.lbsubnetcidr
  dbsubnetcidr   = local.network.config.dbsubnetcidr
  env            = local.environment
}

##########
## 02-security
##########

module "securitygroup" {
  source         = "./modules/security"
  name           = var.name
  location       = data.azurerm_resource_group.dev.location
  resource_group = data.azurerm_resource_group.dev.name
  web_subnet_id  = module.networking.websubnet_id
  app_subnet_id  = module.networking.appsubnet_id
  db_subnet_id   = module.networking.dbsubnet_id
  lb_subnet_id   = module.networking.lbsubnet_id
  env            = local.environment
}

module "app_gateway" {
  source                  = "./modules/app_gateway"
  name                    = var.name
  resource_group_location = data.azurerm_resource_group.dev.location
  resource_group_name     = data.azurerm_resource_group.dev.name

  blob_endpoint = module.storage.primary_web_host
  web-subnet    = module.networking.lbsubnet_id
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
  location        = data.azurerm_resource_group.dev.location
  resource_group  = data.azurerm_resource_group.dev.name
  env             = local.environment
  management_tags = local.management_tags
  app_gateway_ip  = module.app_gateway.app_gateway_ip
  web_subnet_id   = module.networking.websubnet_id
}

##########
## 06-App
##########

module "ocr_api" {
  source               = "./modules/app_service"
  name                 = var.name
  location             = local.init.location
  resource_group       = data.azurerm_resource_group.dev.name
  docker_tag           = var.docker_tag
  docker_registry_path = var.docker_registry_path
  docker_registry_url  = var.docker_registry_url
  app_subnet_id        = module.networking.lbsubnet_id
  env                  = local.environment
  vnet                 = module.networking.network_name
}

# module "compute" {
#   source         = "./modules/container_instances"
#   location       = data.azurerm_resource_group.test.location
#   resource_group = data.azurerm_resource_group.test.name
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