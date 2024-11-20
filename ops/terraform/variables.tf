variable "azure_tenant_id" {
  description = "Unique Identifier for the Azure AD tenant for the app"
}

variable "client_id" {}
variable "client_secret" {

}
variable "tenant_id" {

}
variable "name" {}

variable "object_id" {
  type        = string
  description = "The Azure Object ID"
}

variable "sku_name" {
  type        = string
  description = "The Azure Stock Keep Unit (SKU) version"
}

variable "vite_api_url" {
  type        = string
  description = "The application API Url"
}

variable "resource_group_name" {
  description = "value of the Azure resource group to deploy to"
}




