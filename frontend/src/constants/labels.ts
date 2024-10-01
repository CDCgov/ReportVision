export const LABELS = {
  patientInformation: {
    title: "Patient Information",
    items: [
      { name: "First Name", required: true, color: '#FF0000' }, // red with 50% transparency
      { name: "Last Name", required: true, color: '#00FF00' },  // green with 50% transparency
      { name: "DOB", required: false, color: '#0000FF' },       // blue with 50% transparency
      { name: "Gender", required: false, color: '#00FFFF' },    // cyan with 50% transparency
      { name: "Phone Number", required: false, color: '#FF00FF' }, // magenta with 50% transparency
      { name: "Email", required: false, color: '#FFFF00' },      // yellow with 50% transparency
      {
        name: "Address",
        required: false,
        color: '#EE82EE' // violet with 50% transparency
      },
    ],
  },
  organizationInformation: {
    title: "Organization Information",
    items: [
      { name: "Name", required: true, color: '#00FF00' },        // lime with 50% transparency
      { name: "Email", required: false, color: '#FF2400' },      // scarlet with 50% transparency
      {
        name: "Address",
        required: false,
        color: '#4B0082'  // indigo with 50% transparency
      },
    ],
  },
};
