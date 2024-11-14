variable "resource_group_name" {}
variable "azure_tenant_id" {}
variable "object_id" {}
variable "vite_api_url" {}

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

variable "sku_name" {
  type        = string
  description = "value"
  default     = "B_Gen5_1" # Basic SKU, Gen5, 1 vCore
}
