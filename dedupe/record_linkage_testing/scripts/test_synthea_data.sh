#!/bin/bash
# test_synthea_data.sh: Script to link synthetic data using the linkage API
#
# Usage: test.sh
set -e

cd "$(dirname "$0")/.."


# TRUNCATE THE DATABASE
scripts/reset_db.sh $DB_URL


# GENERATE SYNTHETIC DATA
scripts/generate_synthetic.sh $POPULATION_SIZE $SYNTHEA_OUTPUT_DIR "${STATE}" "${CITY}"


# SEND SYNTHETIC DATA TO THE LINKAGE API
scripts/send_linkage_requests.sh "${SYNTHEA_OUTPUT_DIR}/fhir" $LINKAGE_API_URL $ITERATIONS


# HANG THE SCRIPT
# This will keep the script running indefinitely, allowing you to inspect the
# database and Jaeger UI for traces. Press CTRL+C to exit.
echo -e "\n\nFinished.  Click CTRL+C to exit."
while true; do sleep 1; done
