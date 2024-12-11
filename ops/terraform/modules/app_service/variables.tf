variable "env" {}
variable "name" {}
variable "resource_group" {}
variable "location" {}
variable "lb_subnet_id" {}
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

variable "postgres_db_name" {
  description = "The name of the PostgreSQL database"
  type        = string
}

variable "postgres_password" {
  description = "The password for the PostgreSQL database"
  type        = string
  sensitive   = true # This ensures Terraform treats the password as sensitive
}

variable "postgres_user" {
  description = "The username for the PostgreSQL database"
  type        = string
}
