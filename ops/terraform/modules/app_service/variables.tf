variable "env" {}
variable "name" {}
variable "resource_group" {}
variable "location" {}

variable "app_subnet_id" {}
variable "sku_name" {
  default = "S2"
}
variable "service" {}

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
variable "health_path" {
  default = "/"
}
