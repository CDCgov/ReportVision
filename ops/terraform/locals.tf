locals {
  environment = terraform.workspace
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
  dev2 = {
    dev2 = {
      vnetcidr      = "10.2.0.0/16"
      appsubnetcidr = "10.2.1.0/24"
      websubnetcidr = "10.2.2.0/24"
      lbsubnetcidr  = "10.2.3.0/24"
    }
  }
  dev3 = {
    dev3 = {
      vnetcidr      = "10.3.0.0/16"
      appsubnetcidr = "10.3.1.0/24"
      websubnetcidr = "10.3.2.0/24"
      lbsubnetcidr  = "10.3.3.0/24"
    }
  }
  dev4 = {
    dev4 = {
      vnetcidr      = "10.4.0.0/16"
      appsubnetcidr = "10.4.1.0/24"
      websubnetcidr = "10.4.2.0/24"
      lbsubnetcidr  = "10.4.3.0/24"
    }
  }
  dev5 = {
    dev5 = {
      vnetcidr      = "10.5.0.0/16"
      appsubnetcidr = "10.5.1.0/24"
      websubnetcidr = "10.5.2.0/24"
      lbsubnetcidr  = "10.5.3.0/24"
    }
  }
  dev6 = {
    dev6 = {
      vnetcidr      = "10.6.0.0/16"
      appsubnetcidr = "10.6.1.0/24"
      websubnetcidr = "10.6.2.0/24"
      lbsubnetcidr  = "10.6.3.0/24"
    }
  }
}