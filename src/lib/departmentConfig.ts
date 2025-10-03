export interface Department {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  description?: {
    en: string;
    hi: string;
  };
}

export const departments: Department[] = [
  {
    id: 'revenue',
    name: {
      en: 'Education Department of Chhattisgarh',
      hi: 'राजस्व विभाग'
    },
    description: {
      en: 'Land Records and Revenue Administration',
      hi: 'भूमि रिकॉर्ड और राजस्व प्रशासन'
    }
  },
  {
    id: 'forest',
    name: {
      en: 'Forest Department',
      hi: 'वन विभाग'
    },
    description: {
      en: 'Forest Conservation and Wildlife Management',
      hi: 'वन संरक्षण और वन्यजीव प्रबंधन'
    }
  },
  {
    id: 'mining',
    name: {
      en: 'Mining Department',
      hi: 'खनन विभाग'
    },
    description: {
      en: 'Mineral Resources and Mining Operations',
      hi: 'खनिज संसाधन और खनन कार्य'
    }
  },
  {
    id: 'agriculture',
    name: {
      en: 'Agriculture Department',
      hi: 'कृषि विभाग'
    },
    description: {
      en: 'Agricultural Development and Food Security',
      hi: 'कृषि विकास और खाद्य सुरक्षा'
    }
  },
  {
    id: 'water',
    name: {
      en: 'Water Resources Department',
      hi: 'जल संसाधन विभाग'
    },
    description: {
      en: 'Water Management and Irrigation',
      hi: 'जल प्रबंधन और सिंचाई'
    }
  },
  {
    id: 'urban',
    name: {
      en: 'Urban Development Department',
      hi: 'शहरी विकास विभाग'
    },
    description: {
      en: 'Urban Planning and Infrastructure',
      hi: 'शहरी नियोजन और बुनियादी ढांचा'
    }
  },
  {
    id: 'rural',
    name: {
      en: 'Rural Development Department',
      hi: 'ग्रामीण विकास विभाग'
    },
    description: {
      en: 'Rural Infrastructure and Development',
      hi: 'ग्रामीण बुनियादी ढांचा और विकास'
    }
  },
  {
    id: 'environment',
    name: {
      en: 'Environment Department',
      hi: 'पर्यावरण विभाग'
    },
    description: {
      en: 'Environmental Protection and Climate Change',
      hi: 'पर्यावरण संरक्षण और जलवायु परिवर्तन'
    }
  }
];

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(dept => dept.id === id);
};

export const getDepartmentName = (id: string, language: 'en' | 'hi'): string => {
  const department = getDepartmentById(id);
  return department ? department.name[language] : 'Department';
};

