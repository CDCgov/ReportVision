variable "account_kind" {
  type    = string
  default = "StorageV2"
}

variable "account_tier" {
  type    = string
  default = "Standard"
}

variable "account_replication_type" {
  type    = string
  default = "GRS"
}

variable "access_tier" {
  type    = string
  default = "Standard"
}

variable "env" {
  description = "value of the work environment"
}

variable "location" {
  description = "value of the Azure location to deploy to"
  default     = "eastus"
}

variable "project" {
  description = "value of the project name"
  default     = "reportvision"
}

variable "resource_group_name" {
  description = "value of the Azure resource group to deploy to"
}

variable "subscription_id" {
  description = "value of the Azure Subscription ID to use"
}
