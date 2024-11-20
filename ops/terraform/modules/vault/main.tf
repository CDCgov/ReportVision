resource "azurerm_key_vault" "key_vault" {
  name                = "reportvisionkeyvault"
  location            = "eastus"
  resource_group_name = var.resource_group_name
  sku_name            = "standard"
  tenant_id           = var.azure_tenant_id

  access_policy {
    object_id = var.object_id
    tenant_id = var.azure_tenant_id

    key_permissions = [
      "Get"
    ]

    secret_permissions = [
      "Get"
    ]
  }
}

# Saves the random password into Azure Key Vault
# resource "azurerm_key_vault_secret" "postgres_password" {
#   name         = "postgres-password"
#   value        = azurerm_postgresql_server.postgres_server.administrator_login_password
#   key_vault_id = azurerm_key_vault.key_vault.id
# }

# Define the Service Principal for which we are granting access
# resource "azurerm_azuread_application" "frontendapp" {
#   name = "frontend-application"
#   # TODO: Ask if the VITE_API_URL is the correct endpoint we are using
#   homepage        = var.vite_api_url
#   identifier_uris = [var.vite_api_url]
# }

# resource "azurerm_azuread_service_principal" "this" {
#   application_id = azurerm_azuread_application.frontendapp.application_id
# }
