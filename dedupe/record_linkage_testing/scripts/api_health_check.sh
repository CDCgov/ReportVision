#!/bin/bash
# api_health_check.sh: Script to perform a health check on the API

# Path to a file that indicates the health check has already passed
HEALTH_CHECK_DONE_FILE="/tmp/health_check_done"

if [ -f "$HEALTH_CHECK_DONE_FILE" ]; then
    # Health check has already been performed successfully
    exit 0
else
    # Perform the health check logic here
    # For example, check if a web server is responding
    if curl -sS http://localhost:8080 | grep '\"mpi_connection_status\":\"OK\"'; then
        # Mark this container as having passed the initial health check
        touch "$HEALTH_CHECK_DONE_FILE"
        exit 0
    else
        exit 1
    fi
fi
