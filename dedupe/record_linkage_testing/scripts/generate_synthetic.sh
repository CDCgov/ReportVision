#!/bin/bash
# generate_synthetic.sh: Script to generate synthetic data using Synthea
#
# Arguments:
# $1: The population size to generate
# $2: The output directory to save the synthetic data
# $3: The location to generate the synthetic data for
set -e

cd "$(dirname "$0")/.."

SIZE=${1:-"10"}
OUTPUT_DIR=${2:-"output/"}
STATE=${3:-"Massachusetts"}
CITY=${4:-""}

mkdir -p "${OUTPUT_DIR}"
rm -rf "${OUTPUT_DIR}"/*
# Run Synthea with parameters for seeding, the population size and the output directory.
# Additionally disable generating hospital and practitioner FHIR resources, as we only
# want patient data and limit the results to only alive patients.
# For a full list of parameters, see the
# [configuration file](https://github.com/synthetichealth/synthea/blob/master/src/main/resources/synthea.properties).
java -jar synthea.jar --exporter.hospital.fhir.export=false \
    --exporter.practitioner.fhir.export=false \
    --generate.only_alive_patients=true \
    --exporter.baseDirectory "${OUTPUT_DIR}" \
    -p "${SIZE}" -s "1" -cs "1" \
    "${STATE}" "${CITY}" | grep -v "Loading" # silence the "Loading..." messages
