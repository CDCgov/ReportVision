export const LABELS = {
  patientInformation: {
    title: "Patient Information",
    items: [
      { name: "First Name", required: true, color: '#FF000080' }, // red with 50% transparency
      { name: "Last Name", required: true, color: '#00FF0080' },  // green with 50% transparency
      { name: "DOB", required: false, color: '#0000FF80' },       // blue with 50% transparency
      { name: "Gender", required: false, color: '#00FFFF80' },    // cyan with 50% transparency
      { name: "Phone Number", required: false, color: '#FF00FF80' }, // magenta with 50% transparency
      { name: "Email", required: false, color: '#FFFF0080' },      // yellow with 50% transparency
      {
        name: "Address",
        required: false,
        color: '#EE82EE80' // violet with 50% transparency
      },
    ],
  },
  organizationInformation: {
    title: "Organization Information",
    items: [
      { name: "Name", required: true, color: '#00FF0080' },        // lime with 50% transparency
      { name: "Email", required: false, color: '#FF240080' },      // scarlet with 50% transparency
      {
        name: "Address",
        required: false,
        color: '#4B008280'  // indigo with 50% transparency
      },
    ],
  },
};
