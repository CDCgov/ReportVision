variable "resource_group" {}
variable "name" {}
variable "vnetcidr" {}
variable "websubnetcidr" {}
variable "lbsubnetcidr" {}
variable "ocrsubnetcidr" {}
variable "env" {}
variable "backendsubnetcidr" {}
variable "dbsubnetcidr" {}
variable "env" {}

variable "location" {
  default = "eastus2"
}
