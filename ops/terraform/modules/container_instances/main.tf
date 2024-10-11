resource "azurerm_container_group" "example" {
  name                = "${var.name}-cg"
  location            = var.location
  resource_group_name = var.resource_group
  ip_address_type     = "Private"
  restart_policy      = "Always"
  os_type             = "Linux"

  container {
    name   = "hello-world"
    image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 443
      protocol = "TCP"
    }
  }

  container {
    name   = "sidecar"
    image  = "mcr.microsoft.com/azuredocs/aci-tutorial-sidecar"
    cpu    = "0.5"
    memory = "1.5"
  }

  subnet_ids = [var.app_subnet]

  tags = {
    environment = var.environment
  }
}