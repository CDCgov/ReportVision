variable "name" {}
variable "service" {}
variable "env" {}
variable "resource_group" {}
variable "location" {}
variable "target_resource_id" {
  type = string
}
variable "peak_capacity_instances" {
  default = 1
}
variable "weekend_capacity_instances" {
  default = 1
}