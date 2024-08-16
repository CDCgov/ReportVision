export const LABELS = {
  patientInformation: {
    title: "Patient Information",
    items: [
      { name: "First Name", required: true, color: "#0071bc" },
      { name: "Last Name", required: true, color: "#4c2c92" },
      { name: "DOB", required: false, color: "#e31c3d" },
      { name: "Gender", required: false, color: "#2e8540" },
      { name: "Phone Number", required: false, color: "#ff7043" },
      { name: "Email", required: false, color: "#ffd54f" },
      {
        name: "Address",
        required: false,
        color: "#2e8540",
        subItems: [
          { name: "Street Address 1", color: "#0071bc" },
          { name: "Street Address 2", color: "#4c2c92" },
          { name: "City", color: "#e31c3d" },
          { name: "State", color: "#2e8540" },
          { name: "Zip Code", color: "#ff7043" },
        ],
      },
    ],
  },
  organizationInformation: {
    title: "Organization Information",
    items: [
      { name: "Name", required: true, color: "#0071bc" },
      { name: "Email", required: false, color: "#4c2c92" },
      {
        name: "Address",
        required: false,
        color: "#e31c3d",
        subItems: [
          { name: "Street Address 1", color: "#2e8540" },
          { name: "Street Address 2", color: "#ff7043" },
          { name: "City", color: "#ffd54f" },
          { name: "State", color: "#2e8540" },
          { name: "Zip Code", color: "#0071bc" },
        ],
      },
    ],
  },
};