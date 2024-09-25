data "azurerm_resource_group" "dev" {
  name = "reportvision-${local.environment}-rg"
}