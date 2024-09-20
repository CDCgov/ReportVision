variable "environment" {}
variable "resource_group" {}
variable "location" {}
variable "name" {
  default = "idwa-app"
}
variable "app_subnet_id" {}
variable "sku_name" {
  default = "P1v3"
}

variable "az_account" {
  default = "idwa"
}

variable "https_only" {
  type    = bool
  default = false
}
variable "vnet" {}
variable "app_settings" {
  type        = map(string)
  default     = {}
  description = "App Settings or environment variables to apply."
}