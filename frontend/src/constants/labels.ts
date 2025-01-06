// Helper function to create label items
const createLabelItem = (
  id: string,
  originalName: string,
  isRequired: boolean,
  color: string,
  orgPrefix: string,
) => {
  const name = `${orgPrefix} - ${originalName}`;

  return {
    id,
    name,
    displayedName: originalName,
    required: isRequired,
    color,
  };
};

// Function to create label configuration
export const createLabels = () => {
  return {
    patientInformation: {
      title: "Patient Information",
      items: [
        createLabelItem("1", "First Name", true, "#00008B", "Patient"),
        createLabelItem("2", "Last Name", true, "#228B22", "Patient"),
        createLabelItem("3", "DOB", false, "#DC143C", "Patient"),
        createLabelItem("4", "Gender", false, "#9400D3", "Patient"),
        createLabelItem("5", "Phone Number", false, "#8B4513", "Patient"),
        createLabelItem("6", "Email", false, "#008080", "Patient"),
        createLabelItem("7", "Address", false, "#191970", "Patient"),
      ],
    },
    organizationInformation: {
      title: "Organization Information",
      items: [
        createLabelItem("8", "Name", true, "#556B2F", "Organization"),
        createLabelItem("9", "Email", false, "#4B0082", "Organization"),
        createLabelItem("10", "Address", false, "#B22222", "Organization"),
      ],
    },
  };
};

// Export LABELS using the createLabels function
export const LABELS = createLabels();
