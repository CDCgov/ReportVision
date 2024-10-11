locals {
  environment = terraform.workspace
  init = {
    environment         = local.environment
    location            = "eastus2"
  }
  network = {
    config = {
      vnetcidr      = "10.0.0.0/16"
      websubnetcidr = "10.0.1.0/24"
      appsubnetcidr = "10.0.2.0/24"
      dbsubnetcidr  = "10.0.3.0/24"
      lbsubnetcidr  = "10.0.4.0/24"
    }
  }
  app = {
    web_host_name   = "webserver"
    web_username    = "web_user"
    web_os_password = "@Webuser1"
    app_host_name   = "appserver"
    app_username    = "app_user"
    app_os_password = "@Appuser1"
  }
}