locals {
  workspaces = merge(local.dev, local.demo)
  workspace  = local.workspaces[terraform.workspace]

  management_tags = {
    environment    = local.environment
    resource_group = data.azurerm_resource_group.rg.name
  }
}

module "networking" {
  source         = "./modules/network"
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  vnetcidr       = local.workspace["vnetcidr"]
  websubnetcidr  = local.workspace["websubnetcidr"]
  lbsubnetcidr   = local.workspace["lbsubnetcidr"]
  appsubnetcidr  = local.workspace["appsubnetcidr"]
  dbsubnetcidr   = local.workspace["dbsubnetcidr"]
  env            = local.environment
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

  fqdns      = module.ocr_api.app_hostname
  depends_on = [module.networking, module.ocr_api]
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

module "ocr_api" {
  source         = "./modules/app_service"
  name           = var.name
  location       = data.azurerm_resource_group.rg.location
  resource_group = data.azurerm_resource_group.rg.name
  app_subnet_id  = module.networking.appsubnet_id
  lb_subnet_id   = module.networking.lbsubnet_id
  env            = local.environment
  vnet           = module.networking.network_name
  sku_name       = var.sku_name
  https_only     = true
}

module "ocr_autoscale" {
  source             = "./modules/app_service_autoscale"
  service            = "ocr"
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
  resource_group_name = data.azurerm_resource_group.rg.name
  subnet              = module.networking.dbsubnet_id
  private_dns_zone_id = module.networking.private_dns_zone_id
}

## TODO: Complete in separate ticket
# module "vault" {
#   source              = "./modules/vault"
#   resource_group_name = data.azurerm_resource_group.rg.name
#   azure_tenant_id     = var.azure_tenant_id
#   object_id           = var.object_id
#   vite_api_url        = var.vite_api_url
#   postgres_password   = module.database.postgres_db_password
# }
