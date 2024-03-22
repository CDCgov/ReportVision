#!/bin/bash
# test.sh: Script to execute the performance tests
#
# Usage: test.sh

set -e

cd "$(dirname "$0")/.."

# This is a simple FHIR example to show the environment is working, this will
# be removed in the future and replaced with a set of scripts that generate data.
EXAMPLE_FHIR=$(cat << EOF
{
    "bundle": {
        "resourceType": "Bundle",
        "identifier": {
            "value": "a very contrived FHIR bundle"
        },
        "entry": [
            {
                "resource": {
                    "resourceType": "Patient",
                    "id": "`uuidgen`",
                    "identifier": [
                        {
                            "value": "0987654321",
                            "type": {
                                "coding": [
                                    {
                                        "code": "MR",
                                        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                        "display": "Medical record number"
                                    }
                                ]
                            }
                        }
                    ],
                    "name": [
                        {
                            "family": "Kent",
                            "given": [
                                "Clark",
                                "Superman"
                            ]
                        }
                    ],
                    "birthDate": "1950-08-04",
                    "gender": "male",
                    "address": [
                        {
                            "line": [
                                "some street"
                            ],
                            "city": "Topeka",
                            "state": "Kansas",
                            "postalCode": "11111",
                            "use": "home"
                        }
                    ]
                }
            }
        ]
    }
}
EOF
)

curl -X POST http://api:8080/link-record -d "${EXAMPLE_FHIR}" --header "Content-Type: application/json"

# Set Synthea location arguments
synthea_args=()
if [ -n "${STATE}" ]; then
    synthea_args+=("${STATE}")
fi
if [ -n "${CITY}" ]; then
    synthea_args+=("${CITY}")
fi

# Run Synthea with parameters for seeding, the population size and the output directory.
# Additionally disable generating hospital and practitioner FHIR resources, as we only
# want patient data and limit the results to only alive patients.
# For a full list of parameters, see the [configuration file](https://github.com/synthetichealth/synthea/blob/master/src/main/resources/synthea.properties).
java -jar synthea.jar --exporter.hospital.fhir.export=false \
    --exporter.practitioner.fhir.export=false \
    --exporter.split_records=true \
    --exporter.split_records.duplicate_data=true \
    --generate.only_alive_patients=true \
    -p "${POPULATION_SIZE}" -s "${SEED}" -cs "${CLINICIAN_SEED}" \
    -o "${SYNTHEA_OUTPUT_DIR}" "${synthea_args[@]}"
