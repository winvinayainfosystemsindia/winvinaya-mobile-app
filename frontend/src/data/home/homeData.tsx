import {
  Architecture,
  DataObject,
  AccountBalance,
  Biotech,
  School
} from '@mui/icons-material';
import { designTokens } from '../../theme/designTokens';

export const CATEGORIES = [
  {
    title: 'Design & Arts',
    desc: 'Master visual communication and architectural theory.',
    courses: '124 Courses',
    icon: <Architecture />,
    color: '#0055d1',
    bgColor: 'rgba(0, 85, 209, 0.08)',
    order: 1
  },
  {
    title: 'Data Science',
    desc: 'Advanced analytics, AI, and statistical modeling.',
    courses: '256 Courses',
    icon: <DataObject />,
    color: '#006b4f',
    bgColor: 'rgba(0, 107, 79, 0.08)',
    order: 2
  },
  {
    title: 'Economics',
    desc: 'Macroeconomics and modern financial systems.',
    courses: '89 Courses',
    icon: <AccountBalance />,
    color: '#4f6073',
    bgColor: 'rgba(79, 96, 115, 0.08)',
    order: 3
  },
  {
    title: 'Engineering',
    desc: 'From civil structural integrity to aerospace.',
    courses: '167 Courses',
    icon: <Biotech />,
    color: '#ba1a1a',
    bgColor: 'rgba(186, 26, 26, 0.08)',
    order: 4
  },
  {
    title: 'Humanities & Social Science',
    desc: 'Deep dive into psychology, history, and philosophy.',
    courses: 'Explore Field',
    icon: <School sx={{ fontSize: 140, opacity: 0.1, position: 'absolute', bottom: -20, right: -20, transform: 'rotate(12deg)' }} />,
    color: '#ffffff',
    bgColor: designTokens.colors.primary,
    isFeature: true,
    order: 5
  }
];

export const TRENDING_COURSES = [
  {
    category: 'Science & Biotech',
    title: 'Molecular Biology: Advanced CRISPR Gene Editing',
    instructor: 'Dr. Sarah Jenkins • Stanford University',
    rating: 4.9,
    reviews: '12,402',
    price: '$89.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCwcxr3_UzGEkDibf7yeRCGuejmYbwGu5DJ2TQCV8gN-uIz1OuSa2RZtDQU4k0xv9YaCUkesh2tHXRAOyvXPUIe9fz4qKaaohQdv0S7gji5nG6kBPJnRzj3R4sq3-h2URrIjEVfeYwUfQuXOTHm1mBgJJ3tkeO4u0AmvLZW2u_JtJ7YpHC3RrDUCLPYhfBmpVFz3aEfdnEACxHxikqcngYopHsnL9m4POS0aNgWbd8hvO45wAM6LsSjBhlyi95jEWVnZPjh1iRPsmG',
    bestseller: true,
  },
  {
    category: 'Finance',
    title: 'Algorithmic Trading & Quantitative Analysis',
    instructor: 'Mark Robertson • CFA Institute',
    rating: 4.7,
    reviews: '8,193',
    price: '$129.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkssxSrM4rIV4x7O_ASdG_olXGV9OvEyU3jmr7oRjM2j92gIoPxLcDFjhAz9mNJnp-uqJ_5s37JouAxooPREz1-a-fa9Y6VrmVEq7wtn-NJmn9bchgnKnd0WqLzDqoULzNuCYXl53YxIXjwFemeNt394tAirXQ3ALecQW4zw51-1AUN6C0TRcnlfvMbtf5vPa-elXT6IQUKLe7LiVQL2iZ7Ncql4Cwl7qOv9Xd20NEpAmqbFb3gDRC2ZykbElfSbVVHxRAVgv68dED',
  },
  {
    category: 'Architecture',
    title: 'Sustainable Urban Design for Future Cities',
    instructor: 'Prof. Elena Rossi • Milano Politecnico',
    rating: 4.8,
    reviews: '5,502',
    price: '$94.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv1KK_LOvFG3rGuNPiAzNrJGeTlJDdsLaTKSDyH3uJ1-brPOnB4mAjiS3KZ6-FU4apkXcQxcZfRxEhtkmIMdeVCZvTo2dSJDCyFz1UGsdUUfBLn2ETc9uN2tVuXr5pAE-Q_D7asid1WbtdWZUSBMLfoJsVWnhVZBH33UvUJIKNbIWb2Jg7f-dRJ0lqgZ7cu6Ev05tAT_PGDmazeNIefoUWVUhfQGCyGeLKDIZvdTj0CveesOhLwwHbjbru2MFHxdCryqm4dySSvrBZ',
  },
  {
    category: 'IT & Cloud',
    title: 'Mastering Cybersecurity: Network Defense',
    instructor: 'David Chen • Google Cybersecurity',
    rating: 5.0,
    reviews: '18,221',
    price: '$114.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfbMzrYMmpZ49qbQWGqieKIGpqTmD8OF-MP5o9fdiT-xMUN0bKpzjt0cYHA1QwADSZ_nZIAIq0fa7oYmrtf2T2L3Zuo3Z3CgQwB5u5iqUNHnbbc6WyT7KmA0aIXDkVWd5sK6anMWe49R8Sfe6xq-uNCbTTnXgwtovbt7RLk5a--mrV1X4HntBLJVcUR1Wk2QXFFcSOQXnzTSu2sfJkN2VTE_C9uINZUGd6-nl9t_ODjjTUVhG52p5PI9C6uileExD5uT96mMnRVnt0',
  }
];

export const FACULTY = [
  {
    name: 'Dr. Sophia Martinez',
    title: 'Head of AI Research • MIT',
    desc: 'Specializing in Neural Networks and the ethical implementation of artificial intelligence systems.',
    students: '45k',
    courses: '12',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD71MO9a_qHA_oauaPM22ZA3-U-Umx4xjTJKEqvsXLC83ngASuZu8IYngne2_9Zyw4rDUWya3YloHS2kc-7-ZGhDraBNSpGqbTZUhV7nkxjKAAlda0UJzKsLGSCivj51NlSaYunRJY07VUzttk7L4R4IJ1eW9IcYUot2Dzn5cqf5rzKNXfrf7E_YKe4bcqkZ6uPNyCC3-Ftgj8LD9QLJNwz6bU8EUmKtLU8ME0OKlES4iOtVYlxRBbeBXhCmpzkIz6CLqRQ-DJZdZQ7',
    tagColor: designTokens.colors.success,
  },
  {
    name: 'Marcus Thorne',
    title: 'Investment Strategist • Goldman Sachs',
    desc: 'Over 20 years of experience in market analysis and private equity management for global firms.',
    students: '28k',
    courses: '8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu5dxZO5DS6L9s9H324tK5676aT7-uX3MFrN1J6KOhvk7bWB0TneozESRdFAYSKVnKgWheGC_SIzAA3noBQXFuyCKw209pjyF27iuOJ3lLzN6RZb4VuyZhLiApxZ7wrous9o_EEpamEffwBMvaMSHCbEhqxV2PHRx6z_jPJfQqlasQQtkAzClH2IVOdelOJNnLzUWjNG-S_ZA2MT_ZJRXbPyykj6JImlQuyyYWZFWZgegxkac3V4v0b85u6MlOq5RX-cfCtSr27Duw',
    tagColor: designTokens.colors.primary,
  },
  {
    name: 'Julianne West',
    title: 'Product Design Lead • Adobe',
    desc: 'Award-winning designer focusing on cognitive load theory and accessible interface architectures.',
    students: '52k',
    courses: '15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTZJMy63xxHn9CZX1TSLX0s0VIyovtyVmKBeFoVk4Hki6sgHUx45FS23IAcdhnDxJm-C14AU3aQ-UFetC-eV_J0yyu-QEukCCZvmBOMmWE7uaPmNZ_0L6ciiC4hFuxjAkhP5mgotwvoWbtncbq9t-I1tOgxbE3oRnsmDJtuED16jcIK-U0KVq0xMEJHMvrK4zjjnQSMoILwatjO5pOzSfj5m6d8H31pQ2cTmdAtWJOBFKPpfCsZY_bW1tXtC95Ab2VyvsiwrE3zo5S',
    tagColor: designTokens.colors.secondary,
  }
];
