variable "resource_group" {}
variable "name" {}
variable "vnetcidr" {}
variable "websubnetcidr" {}
variable "lbsubnetcidr" {}
variable "ocrsubnetcidr" {}
variable "env" {}
variable "middlewaresubnetcidr" {}
variable "dbsubnetcidr" {}

variable "location" {
  default = "eastus2"
}
