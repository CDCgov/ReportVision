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
  default     = "eastus"
}

variable "resource_group_name" {
  type        = string
  description = "The Azure Resource Group to deploy to"
}

variable "sku_name" {
  type        = string
  description = "value"
  default     = "B_Gen5_1" # Basic SKU, Gen5, 1 vCore
}

variable "subnet" {
  type        = string
  description = "The subnet ID to associate with the PostgreSQL server"
}
