output "postgres_password" {
  value     = random_string.postgres_password.result
  sensitive = true
}
