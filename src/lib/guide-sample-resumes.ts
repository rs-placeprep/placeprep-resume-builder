import type { ResumeData } from '@/types'

export const badExampleResume: ResumeData = {
  personal: {
    name: 'Suraj Kumar',
    title: 'Passionate Software Developer',
    email: 'suraj.dev.contact.me.2024@gmail.com',
    phone: '+91 98765 43210',
    location: 'Patna, Bihar',
    linkedin: 'linkedin.com/in/suraj-kumar-dev-profile-2024',
    github: 'github.com/surajkumar',
    website: '',
  },
  summary:
    'Passionate and hardworking final-year Computer Science student with a strong interest in web development and a good grasp of data structures and algorithms. Eager to learn new technologies and contribute to a dynamic team. Quick learner, detail-oriented, and a great team player who is always ready to take on new challenges.',
  experience: [
    {
      id: 'bad-exp-1',
      title: 'Web Development Intern',
      company: 'A Local IT Company',
      location: 'Patna',
      period: 'Summer 2025',
      duties: [
        'Worked on the frontend team and helped improve website performance',
        'Responsible for writing code and fixing bugs in the application',
        'Helped with other tasks assigned by the manager',
        'Learned a lot about teamwork and communication',
        'Attended daily standup meetings with the team',
      ],
    },
    {
      id: 'bad-exp-2',
      title: 'Campus Ambassador',
      company: 'An Online Learning Platform',
      location: 'Patna',
      period: '2024 - 2025',
      duties: [
        'Promoted the platform among college students',
        'Helped organize a few events on campus',
        'Worked with a team of other ambassadors',
      ],
    },
  ],
  projects: [
    {
      id: 'bad-proj-1',
      name: 'E-commerce Website',
      tech: 'HTML, CSS, JavaScript, PHP, MySQL, Bootstrap, jQuery',
      link: '',
      desc: 'Built a full-stack e-commerce website using the MERN stack with login, cart and payment features. It was a great learning experience.',
    },
    {
      id: 'bad-proj-2',
      name: 'To-Do List App',
      tech: 'React',
      link: '',
      desc: 'A simple to-do list application to manage daily tasks.',
    },
  ],
  education: [
    {
      id: 'bad-edu-1',
      degree: 'B.Tech in Computer Science',
      institution: 'Nalanda College of Engineering, Chandi',
      period: '2022 - 2026',
      detail: '',
    },
  ],
  skills: [
    { id: 'bad-skill-1', label: 'Skills', items: 'HTML, CSS, JavaScript, React, Node.js, Python, Java, C++, MySQL, MongoDB, Git, Figma, Photoshop, MS Office, Communication, Teamwork, Leadership, Problem Solving' },
  ],
  certifications: [
    { id: 'bad-cert-1', name: 'Introduction to Programming (6-hour online course)', year: '2023' },
    { id: 'bad-cert-2', name: 'Web Development Basics Certificate', year: '2023' },
  ],
  achievements: [
    'Participated in college coding club activities',
    'Attended a webinar on web development',
    'Good academic record throughout school',
  ],
}

export const goodExampleResume: ResumeData = {
  personal: {
    name: 'Suraj Kumar',
    title: '',
    email: 'suraj.kumar@gmail.com',
    phone: '+91 98765 43210',
    location: 'Patna, India',
    linkedin: 'linkedin.com/in/surajkumar',
    github: 'github.com/surajkumar',
    website: '',
  },
  summary:
    'Final-year CS student who has shipped two production apps, one used by 500+ students with 1M+ requests in its first 60 days. Solved 400+ DSA problems, currently 1850 on LeetCode. Looking for a backend SDE role.',
  experience: [
    {
      id: 'good-exp-1',
      title: 'Web Development Intern',
      company: 'Ranchi Softworks',
      location: 'Remote',
      period: 'May 2025 - Jul 2025',
      duties: [
        'Cut API p95 latency from 820ms to 210ms by adding Redis caching and eliminating N+1 queries across the 12 highest-traffic endpoints',
        'Raised test coverage from 41% to 78% across 60+ modules, cutting production incidents from roughly 6 to 1 per month',
        'Migrated 40+ components from JavaScript to TypeScript with zero runtime regressions',
      ],
    },
    {
      id: 'good-exp-2',
      title: 'Campus Lead',
      company: 'Codeverse Learning',
      location: 'Remote',
      period: 'Jan 2024 - Apr 2025',
      duties: [
        'Grew campus community from 40 to 300+ members by running 6 workshops on Git, DSA, and web development',
        'Drove 150+ signups for the platform through referral campaigns, ranking in the top 5 ambassadors nationally',
      ],
    },
  ],
  projects: [
    {
      id: 'good-proj-1',
      name: 'PlacePrep Tracker',
      tech: 'Next.js · PostgreSQL · Permit.io',
      link: 'github.com/surajkumar/placeprep',
      desc: 'Placement-prep platform for 500+ students across 3 colleges; handled 1M+ requests in 60 days. Built role-based exam access with Permit.io and cut quiz load times 4x with cursor pagination.',
    },
    {
      id: 'good-proj-2',
      name: 'TaskFlow',
      tech: 'React · Firebase',
      link: 'github.com/surajkumar/taskflow',
      desc: 'Task manager with real-time sync used daily by 80+ classmates; added offline support with a local-first sync queue.',
    },
  ],
  education: [
    {
      id: 'good-edu-1',
      degree: 'B.Tech · Computer Science & Engineering',
      institution: 'Nalanda College of Engineering, Chandi',
      period: '2022 - 2026',
      detail: 'CGPA 8.4',
    },
  ],
  skills: [
    { id: 'good-skill-1', label: 'Languages', items: 'C++, Python, TypeScript, SQL' },
    { id: 'good-skill-2', label: 'Frameworks', items: 'React, Next.js, Node.js, Tailwind' },
    { id: 'good-skill-3', label: 'Tools', items: 'Git, Docker, PostgreSQL, Redis' },
  ],
  certifications: [
    { id: 'good-cert-1', name: 'Azure AI Fundamentals', year: '2024' },
  ],
  achievements: [
    '3rd place, Smart India Hackathon regional round (2025)',
    '1850 rated on LeetCode, 400+ problems solved',
  ],
}
