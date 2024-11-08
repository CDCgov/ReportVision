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
  type = string
}

variable "client_id" {
  description = "value of the Azure App registration ID to use in the tfstate storage account name"
}

variable "env" {
  description = "value of the work environment"
}

variable "location" {
  description = "value of the Azure location to deploy to"
  default     = "Central US"
}

variable "project" {
  description = "value of the project or team name"
  default     = "ReportVision"
}

variable "resource_group_name" {
  description = "value of the Azure resource group to deploy to"
}

variable "subscription_id" {
  description = "value of the Azure Subscription ID to use"
}
