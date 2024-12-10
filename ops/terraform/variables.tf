variable "client_id" {}
variable "name" {}
variable "postgres_server_id" {}
variable "object_id" {}
variable "tenant_id" {}
variable "sku_name" {
  type        = string
  description = "The Azure Stock Keep Unit (SKU) version"
}
variable "subscription_id" {}
variable "resource_group_name" {
  description = "value of the Azure resource group to deploy to"
}
