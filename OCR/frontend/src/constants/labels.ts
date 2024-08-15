export const LABELS = {
  patientInformation: {
    title: "Patient information",
    items: [
      { name: "Date of service", required: true, color: "#0071bc" },
      { name: "Name", required: true, color: "#4c2c92" },
      { name: "Date of birth", required: true, color: "#e31c3d" },
      { name: "Gender", required: false, color: "#2e8540" },
    ],
  },
  organizationInformation: {
    title: "Organization information",
    items: [
      { name: "Name", required: false, color: "#ff7043" },
    ],
  },
  clinicalData: {
    title: "Clinical data",
    items: [
      { name: "Diagnosis", required: false, color: "#ffd54f" },
    ],
  },
};