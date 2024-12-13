variable "resource_group" {}
variable "name" {}
variable "vnetcidr" {}
variable "websubnetcidr" {}
variable "lbsubnetcidr" {}
variable "ocrsubnetcidr" {}
variable "env" {}
variable "middlewaresubnetcidr" {}
variable "dbsubnetcidr" {}
variable "appgwsubnetcidr" {}

variable "location" {
  default = "eastus2"
}

variable "postgres_server_id" {
}
