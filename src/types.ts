export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
}

export interface ExperienceItem {
  id: string
  title: string
  company: string
  location: string
  period: string
  duties: string[]
}

export interface ProjectItem {
  id: string
  name: string
  tech: string
  link: string
  desc: string
}

export interface EducationItem {
  id: string
  degree: string
  institution: string
  period: string
  detail: string
}

export interface SkillGroup {
  id: string
  label: string
  items: string
}

export interface CertificationItem {
  id: string
  name: string
  year: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experience: ExperienceItem[]
  projects: ProjectItem[]
  education: EducationItem[]
  skills: SkillGroup[]
  certifications: CertificationItem[]
  achievements: string[]
}

export type ResumeTemplate = 'classic' | 'modern' | 'minimal'

export interface StyleSettings {
  fontFamily: string
  template: ResumeTemplate
  nameSize: number
  headingSize: number
  bodySize: number
  metaSize: number
  lineSpacing: number
}

export type SectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'extras'
  | 'style'
