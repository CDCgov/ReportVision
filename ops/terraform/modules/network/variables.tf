variable "resource_group" {}
variable "name" {}
variable "vnetcidr" {}
variable "websubnetcidr" {}
variable "lbsubnetcidr" {}
variable "dbsubnetcidr" {}
variable "appsubnetcidr" {}
variable "env" {}

variable "location" {
  default = "eastus2"
}
