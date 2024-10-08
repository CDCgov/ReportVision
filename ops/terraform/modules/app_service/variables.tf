variable "env" {}
variable "resource_group" {}
variable "location" {}
variable "name_ocr" {
  default = "reportvision-ocr-api"
}
variable "app_subnet_id" {}
variable "sku_name" {
  default = "P1v3"
}

variable "az_account" {
  default = "reportvision"
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