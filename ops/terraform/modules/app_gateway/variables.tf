variable "name" {}
variable "resource_group_name" {}
variable "resource_group_location" {}
variable "appgw_subnet_id" {}
# variable "lb_subnet" {}
variable "blob_endpoint" {}
variable "tags" {}

variable "zones" {
  type    = list(string)
  default = ["1", "2", "3"]
}

variable "fqdns_middleware" {
}
variable "fqdns_ocr" {
}

variable "ip_addresses" {
  type    = list(string)
  default = []
}
variable "env" {}
