locals {
  environment = terraform.workspace

  # Explicitly get object_id from the environment variable (e.g., in GitHub Actions)
  azure_object_id = getenv("ARM_OBJECT_ID", var.object_id)
  vite_api_url    = getenv("VITE_API_URL", "") # Default to an empty string if not set

  init = {
    environment = local.environment
    location    = "eastus2"
  }
  dev = {
    dev = {
      vnetcidr      = "10.0.0.0/16"
      appsubnetcidr = "10.0.1.0/24"
      websubnetcidr = "10.0.2.0/24"
      lbsubnetcidr  = "10.0.3.0/24"
    }
  }
  demo = {
    demo = {
      vnetcidr      = "10.1.0.0/16"
      appsubnetcidr = "10.1.1.0/24"
      websubnetcidr = "10.1.2.0/24"
      lbsubnetcidr  = "10.1.3.0/24"
    }
  }
}
