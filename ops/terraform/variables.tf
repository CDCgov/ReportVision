variable "client_id" {}

variable "name" {}

variable "resource_group_name" {
  description = "value of the Azure resource group to deploy to"
}

variable "sku_name" {
  type        = string
  description = "The Azure Stock Keep Unit (SKU) version"
}

variable "tenant_id" {}
