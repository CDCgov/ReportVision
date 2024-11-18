variable "azure_tenant_id" {
  description = "Unique Identifier for the Azure AD tenant for the app"
}

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

variable "object_id" {
  type        = string
  description = "The Azure Object ID"
}

variable "resource_group_name" {
  type        = string
  description = "The Azure Resource Group to deploy to"
}

variable "sku_name" {
  type        = string
  description = "The Azure Stock Keep Unit (SKU) version"
  default     = "B_Gen5_1" # Basic SKU, Gen5, 1 vCore
}

variable "vite_api_url" {
  type        = string
  description = "The application API Url"
}
