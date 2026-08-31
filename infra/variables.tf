variable "subscription_id" {
  description = "Azure subscription used by the existing Vediq deployment."
  type        = string
  default     = "6214bb47-3d8d-489d-ba82-a8d893a7aeab"
}

variable "resource_group_name" {
  description = "Resource group dedicated to the Vediq marketing website."
  type        = string
  default     = "vediq-websit-rg"
}

variable "location" {
  description = "Azure region for the website resources."
  type        = string
  default     = "eastus"
}

variable "container_app_name" {
  description = "Name of the public Azure Container App."
  type        = string
  default     = "vediq-website"
}

variable "min_replicas" {
  description = "Minimum replicas. Zero enables scale-to-zero."
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "Maximum replicas available during traffic spikes."
  type        = number
  default     = 3
}

variable "custom_domain" {
  description = "Apex custom domain served by the Container App."
  type        = string
  default     = "vediq.net"
}

variable "enable_custom_domain" {
  description = "Manage the apex custom-domain binding after the GoDaddy A and TXT validation records exist."
  type        = bool
  default     = true
}

variable "enable_www_custom_domain" {
  description = "Create the www binding after the GoDaddy CNAME and asuid.www TXT records exist."
  type        = bool
  default     = false
}

variable "demo_recipient_email" {
  description = "Mailbox that receives website demo requests."
  type        = string
  default     = "info@vediq.net"
}
