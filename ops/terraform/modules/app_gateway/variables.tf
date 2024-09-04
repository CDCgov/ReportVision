variable "vnet-name" {
  type    = string
  default = "idwa-test"
}
variable "resource_group_name" {}
variable "resource_group_location" {}
variable "web-subnet" {}
variable "blob_endpoint" {}
variable "tags" {}

variable "zones" {
  type    = list(string)
  default = ["1", "2", "3"]
}

variable "fqdns" {
}

variable "ip_addresses" {
  type    = list(string)
  default = []
}