data "azurerm_resource_group" "test" {
  name = "idwa-${local.environment}-rg"
}