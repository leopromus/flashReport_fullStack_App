import type { CreateReportFormData } from '../types';

export const dummyUsers = [
  {
    firstname: 'Admin',
    lastname: 'User',
    email: 'admin@flashreport.com',
    phoneNumber: '+254722000000',
    username: 'admin',
    password: 'Admin@123',
    role: 'ADMIN'
  }
];

export const createDummyReport = (isAdmin: boolean = false): CreateReportFormData => {
  const locations = [
    '-1.2921,36.8219', // Nairobi CBD
    '-1.2833,36.8172', // Westlands
    '-1.3031,36.7073', // Karen
    '-1.2359,36.8800'  // Kasarani
  ];

  const titles = [
    'Corruption in Road Construction',
    'Police Bribery Incident',
    'Public Funds Misuse',
    'Electoral Malpractice',
    'Water Supply Infrastructure'
  ];

  const comments = [
    'Contractor using substandard materials and inflating costs',
    'Officer demanding bribes at checkpoint',
    'Suspicious tender allocation in county office',
    'Vote buying activities observed in local ward',
    'Broken water pipes need urgent repair'
  ];

  const randomIndex = Math.floor(Math.random() * 4);
  const reportType = Math.random() > 0.5 ? 'RED_FLAG' : 'INTERVENTION';
  const statuses = ['DRAFT', 'UNDER_INVESTIGATION', 'RESOLVED', 'REJECTED'];
  const randomStatus = isAdmin ? statuses[Math.floor(Math.random() * statuses.length)] : 'DRAFT';

  return {
    title: titles[randomIndex],
    type: reportType,
    location: locations[randomIndex],
    comment: comments[randomIndex],
    status: randomStatus,
    user_id: isAdmin ? 1 : Math.floor(Math.random() * 2) + 2, // Admin is ID 1, others are 2-3
    images: [],
    videos: []
  };
};

export const generateAdminReports = (count: number = 5): CreateReportFormData[] => {
  return Array(count).fill(null).map(() => createDummyReport(true));
};

export const generateUserReports = (count: number = 5): CreateReportFormData[] => {
  return Array(count).fill(null).map(() => createDummyReport(false));
};

// Helper function to convert base64 to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeType });
}; 