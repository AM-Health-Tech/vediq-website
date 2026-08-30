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
  default     = 0
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
  description = "Create the custom-domain binding after the GoDaddy A and TXT validation records exist."
  type        = bool
  default     = false
}
