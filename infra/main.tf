locals {
  source_files = concat(
    [
      "Dockerfile.azure",
      "next.config.ts",
      "nginx.azure.conf",
      "package-lock.json",
      "package.json",
      "postcss.config.mjs",
      "tsconfig.json",
    ],
    sort(tolist(fileset("${path.module}/..", "app/**"))),
    sort(tolist(fileset("${path.module}/..", "public/**"))),
  )

  source_hash = substr(sha256(join("|", [
    for source_file in local.source_files : filesha256("${path.module}/../${source_file}")
  ])), 0, 12)

  tags = {
    application = "VediqWebsite"
    environment = "production"
    managed-by  = "Terraform"
  }
}

resource "azurerm_resource_group" "website" {
  name     = var.resource_group_name
  location = var.location
  tags     = local.tags
}

resource "random_string" "registry_suffix" {
  length  = 8
  upper   = false
  special = false
}

resource "azurerm_container_registry" "website" {
  name                = "vediqweb${random_string.registry_suffix.result}"
  resource_group_name = azurerm_resource_group.website.name
  location            = azurerm_resource_group.website.location
  sku                 = "Basic"
  admin_enabled       = true
  tags                = local.tags
}

resource "docker_image" "website" {
  name = "${azurerm_container_registry.website.login_server}/vediq-website:${local.source_hash}"

  build {
    context    = abspath("${path.module}/..")
    dockerfile = "Dockerfile.azure"
    platform   = "linux/amd64"
  }
}

resource "docker_registry_image" "website" {
  name          = docker_image.website.name
  keep_remotely = true

  auth_config {
    address  = azurerm_container_registry.website.login_server
    username = azurerm_container_registry.website.admin_username
    password = azurerm_container_registry.website.admin_password
  }
}

resource "azurerm_log_analytics_workspace" "website" {
  name                = "vediq-website-logs-${random_string.registry_suffix.result}"
  resource_group_name = azurerm_resource_group.website.name
  location            = azurerm_resource_group.website.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_container_app_environment" "website" {
  name                       = "vediq-website-env"
  resource_group_name        = azurerm_resource_group.website.name
  location                   = azurerm_resource_group.website.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.website.id
  tags                       = local.tags
}

resource "azurerm_container_app" "website" {
  name                         = var.container_app_name
  container_app_environment_id = azurerm_container_app_environment.website.id
  resource_group_name          = azurerm_resource_group.website.name
  revision_mode                = "Single"
  tags                         = local.tags

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.website.admin_password
  }

  registry {
    server               = azurerm_container_registry.website.login_server
    username             = azurerm_container_registry.website.admin_username
    password_secret_name = "registry-password"
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = "vediq-website"
      image  = docker_registry_image.website.name
      cpu    = 0.25
      memory = "0.5Gi"

      liveness_probe {
        transport = "HTTP"
        port      = 8080
        path      = "/healthz"
      }

      readiness_probe {
        transport = "HTTP"
        port      = 8080
        path      = "/healthz"
      }
    }
  }

  ingress {
    external_enabled           = true
    allow_insecure_connections = false
    target_port                = 8080

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
}

# Custom-domain creation is intentionally a second apply. Azure must be able to
# resolve the GoDaddy A and asuid TXT records before it can validate the apex
# hostname and issue its automatically renewed managed certificate.
resource "azurerm_container_app_custom_domain" "website" {
  count = var.enable_custom_domain ? 1 : 0

  name             = var.custom_domain
  container_app_id = azurerm_container_app.website.id

  lifecycle {
    # Azure assigns these values asynchronously when it provisions the managed
    # certificate. Ignoring them prevents Terraform from recreating the domain.
    ignore_changes = [
      certificate_binding_type,
      container_app_environment_certificate_id,
    ]
  }
}
