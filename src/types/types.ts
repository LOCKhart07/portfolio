// types.ts

export interface ProfileBanner {
  backgroundImage: { url: string };
  headline: string;
  resumeLink: {
    url: string;
  };
  linkedinLink: string;
  profileSummary: string;
}

export interface WorkPermit {
  visaStatus: string;
  expiryDate: Date;
  summary: string;
  additionalInfo: string;
}

export interface TimelineItem {
  timelineType: 'work' | 'education';
  name: string;
  title: string;
  techStack: string;
  summaryPoints: string[];
  dateRange: string;
}

export interface Project {
  title: string;
  description: string;
  techUsed: string;
  image: { url: string };
  link: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issuedDate: string;
  link: string;
  iconName: string;
}

export interface ContactMe {
  profilePicture: { url: string };
  name: string;
  title: string;
  summary: string;
  companyUniversity: string;
  linkedinLink: string;
  email: string;
  phoneNumber: string;
}

export interface Skill { 
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface Recommendation {
  profilePicture: { url: string };
  name: string;
  title: string;
  date: string;
  body: string;
  link: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
}

export interface Song {
  name: string;
  artist: string;
  url: string;
  image: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface BlacklistedMusic {
  name: string;
}
