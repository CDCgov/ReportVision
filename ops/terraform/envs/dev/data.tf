data "azurerm_resource_group" "dev" {
  name = "reportvision-rg-${local.environment}"
}