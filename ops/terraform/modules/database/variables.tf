variable "db_username" {
  type        = string
  description = "Username of RDS Instance."
  default     = "reportVisionDbUser"
}

variable "engine_version" {
  description = "Postgres DB engine version."
  default     = "11"
}

variable "location" {
  type        = string
  description = "Location of the resource."
  default     = "eastus2"
}

variable "name" {
  type        = string
  description = "The name of the Project"
}

variable "resource_group_name" {
  type        = string
  description = "The Azure Resource Group to deploy to"
}

variable "postgres_password" {
  description = "The password for the PostgreSQL database"
  type        = string
  sensitive   = true # This ensures Terraform treats the password as sensitive
}

variable "postgres_sku_name" {
  type        = string
  description = "value"
  default     = "B_Standard_B1ms"
}

variable "db_subnet" {
  type        = string
  description = "The subnet ID to associate with the PostgreSQL Flexible Server"
}

variable "private_dns_zone_id" {
  type        = string
  description = "Private DNS Zone for PostgreSQL Flexible Server"
}

variable "env" {
  type        = string
  description = "Environment variable for the environment being provisioned"
}
