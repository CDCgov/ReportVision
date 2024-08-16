export const LABELS = {
  patientInformation: {
    title: "Patient Information",
    items: [
      { name: "First Name", required: true },
      { name: "Last Name", required: true },
      { name: "DOB", required: false },
      { name: "Gender", required: false },
      { name: "Phone Number", required: false },
      { name: "Email", required: false },
      {
        name: "Address",
        required: false,
      },
    ],
  },
  organizationInformation: {
    title: "Organization Information",
    items: [
      { name: "Name", required: true },
      { name: "Email", required: false },
      {
        name: "Address",
        required: false,
      },
    ],
  },
};
