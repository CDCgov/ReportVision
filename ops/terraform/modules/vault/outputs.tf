output "postgres_password" {
  value       = random_string.postgres_password.result
  sensitive   = true
  description = "The randomly generated password for the PostgreSQL database"
}
