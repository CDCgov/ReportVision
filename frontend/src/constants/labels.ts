import randomColor from 'randomcolor';

// Function to generate a unique color
export const getUniqueColor = (
  index: number,
  totalColors: number,
  generatedColors: Set<string>
): string => {
  let color;
  const hue = (index * (360 / totalColors)) % 360;
  do {
    color = randomColor({ luminosity: 'dark', format: 'rgb', hue });
  } while (generatedColors.has(color));
  generatedColors.add(color);
  return color;
};

// Function to create label configuration
export const createLabels = (
  totalPatientColors: number,
  totalOrganizationColors: number
) => {
  const generatedColors = new Set<string>();

  return {
    patientInformation: {
      title: 'Patient Information',
      items: [
        {
          name: 'First Name',
          required: true,
          color: getUniqueColor(0, totalPatientColors, generatedColors),
        },
        {
          name: 'Last Name',
          required: true,
          color: getUniqueColor(1, totalPatientColors, generatedColors),
        },
        {
          name: 'DOB',
          required: false,
          color: getUniqueColor(2, totalPatientColors, generatedColors),
        },
        {
          name: 'Gender',
          required: false,
          color: getUniqueColor(3, totalPatientColors, generatedColors),
        },
        {
          name: 'Phone Number',
          required: false,
          color: getUniqueColor(4, totalPatientColors, generatedColors),
        },
        {
          name: 'Email',
          required: false,
          color: getUniqueColor(5, totalPatientColors, generatedColors),
        },
        {
          name: 'Address',
          required: false,
          color: getUniqueColor(6, totalPatientColors, generatedColors),
        },
      ],
    },
    organizationInformation: {
      title: 'Organization Information',
      items: [
        {
          name: 'Name',
          required: true,
          color: getUniqueColor(0, totalOrganizationColors, generatedColors),
        },
        {
          name: 'Email',
          required: false,
          color: getUniqueColor(1, totalOrganizationColors, generatedColors),
        },
        {
          name: 'Address',
          required: false,
          color: getUniqueColor(2, totalOrganizationColors, generatedColors),
        },
      ],
    },
  };
};

// Export LABELS using the createLabels function
export const LABELS = createLabels(7, 3);
