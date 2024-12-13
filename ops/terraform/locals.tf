locals {
  environment    = terraform.workspace
  ocr-api        = "ocr"
  middleware-api = "middleware"
  init = {
    environment = local.environment
    location    = "eastus2"
  }
  dev = {
    dev = {
      vnetcidr             = "10.0.0.0/16"
      ocrsubnetcidr        = "10.0.1.0/24"
      middlewaresubnetcidr = "10.0.2.0/24"
      websubnetcidr        = "10.0.3.0/24"
      lbsubnetcidr         = "10.0.4.0/24"
      dbsubnetcidr         = "10.0.5.0/24"
      appgwsubnetcidr      = "10.0.6.0/24"
    }
  }
  demo = {
    demo = {
      vnetcidr             = "10.1.0.0/16"
      ocrsubnetcidr        = "10.1.1.0/24"
      middlewaresubnetcidr = "10.1.2.0/24"
      websubnetcidr        = "10.1.3.0/24"
      lbsubnetcidr         = "10.1.4.0/24"
      dbsubnetcidr         = "10.1.5.0/24"
      appgwsubnetcidr      = "10.1.6.0/24"
    }
  }
}
