output "website_url" {
  description = "Azure-generated HTTPS URL for the Vediq website."
  value       = "https://${azurerm_container_app.website.ingress[0].fqdn}"
}

output "resource_group_name" {
  description = "Resource group containing the website deployment."
  value       = azurerm_resource_group.website.name
}

output "container_registry" {
  description = "Azure Container Registry holding website images."
  value       = azurerm_container_registry.website.login_server
}

output "godaddy_apex_a_record" {
  description = "GoDaddy A record required to route the apex domain to Azure Container Apps."
  value = {
    type  = "A"
    name  = "@"
    value = azurerm_container_app_environment.website.static_ip_address
  }
}

output "godaddy_domain_verification_record" {
  description = "GoDaddy TXT record Azure uses to verify ownership of the apex domain."
  value = {
    type = "TXT"
    name = "asuid"
    # Azure marks this provider attribute as sensitive, but this value is
    # intentionally published in public DNS to prove domain ownership.
    value = nonsensitive(azurerm_container_app.website.custom_domain_verification_id)
  }
}

output "godaddy_www_cname_record" {
  description = "GoDaddy CNAME record required to route www to Azure Container Apps."
  value = {
    type  = "CNAME"
    name  = "www"
    value = azurerm_container_app.website.ingress[0].fqdn
  }
}

output "godaddy_www_verification_record" {
  description = "GoDaddy TXT record Azure uses to verify ownership of www."
  value = {
    type  = "TXT"
    name  = "asuid.www"
    value = nonsensitive(azurerm_container_app.website.custom_domain_verification_id)
  }
}

output "custom_domain_url" {
  description = "Custom HTTPS URL after DNS validation and the second Terraform apply."
  value       = var.enable_custom_domain ? "https://${var.custom_domain}" : null
}

output "demo_request_recipient" {
  description = "Mailbox receiving server-side demo request notifications."
  value       = var.demo_recipient_email
}

output "demo_email_sender" {
  description = "Azure-managed sender address used for demo request notifications."
  value       = "DoNotReply@${azurerm_email_communication_service_domain.website.from_sender_domain}"
}
