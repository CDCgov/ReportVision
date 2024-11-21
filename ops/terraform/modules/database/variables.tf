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

variable "resource_group_name" {
  type        = string
  description = "The Azure Resource Group to deploy to"
}

# Production may be able to scale to GP_Standard_D2ds_v4 (General Purpose Tier) 
# which is designed for medium to high-performance workloads and is scalable.
variable "sku_name" {
  type        = string
  description = "value"
  default     = "Standard_B1ms" # General Purpose tier for low cost virtual machines
}

variable "subnet" {
  type        = string
  description = "The subnet ID to associate with the PostgreSQL Flexible Server"
}

variable "private_dns_zone_id" {
  type        = string
  description = "Private DNS Zone for PostgreSQL Flexible Server"
}
