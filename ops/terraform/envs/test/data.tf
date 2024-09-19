data "azurerm_resource_group" "test" {
  name = "idwa-rv-${local.environment}-rg"
}