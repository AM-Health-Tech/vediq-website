# Vediq website on Azure

This configuration exports the website as static HTML, CSS, and JavaScript,
serves it from a small Nginx container, and deploys it to Azure Container Apps in
`vediq-websit-rg`. It uses the same Azure subscription and `eastus` region as the
existing Vediq deployment, while keeping all website resources isolated in their
own resource group.

## Prerequisites

- Terraform 1.8 or newer
- Azure CLI authenticated to the Vediq subscription
- Docker Desktop running with Linux containers

## Deploy

```powershell
az account set --subscription 6214bb47-3d8d-489d-ba82-a8d893a7aeab
terraform -chdir=infra init
terraform -chdir=infra plan -out=tfplan
terraform -chdir=infra apply tfplan
terraform -chdir=infra output -raw website_url
```

Terraform creates the resource group, a Basic Azure Container Registry, a Log
Analytics workspace, a Container Apps environment, and the public Container App.
The registry name receives a random suffix because Azure registry names are
globally unique.

The first apply builds and pushes the image through Docker. Later applies build a
new immutable image tag whenever website source files change.

## Custom domain

The configuration is prepared for the apex domain `vediq.net`. Domain setup uses
two applies because Azure must see the GoDaddy validation records before it can
bind the hostname and issue a managed certificate.

1. Run the normal apply with `enable_custom_domain = false`.
2. Read the exact DNS values:

   ```powershell
   terraform -chdir=infra output godaddy_apex_a_record
   terraform -chdir=infra output godaddy_domain_verification_record
   ```

3. In GoDaddy DNS, create or replace the `@` A record with the first output and
   add the `asuid` TXT record with the second output. Preserve MX, SPF, DKIM,
   DMARC, and other email-related records.
4. Wait until both records resolve publicly.
5. Apply the custom-domain binding:

   ```powershell
   terraform -chdir=infra apply -var="enable_custom_domain=true"
   ```

Azure then validates `vediq.net` and provisions an automatically renewed managed
certificate. Keep the A and TXT records in place for certificate renewal.
