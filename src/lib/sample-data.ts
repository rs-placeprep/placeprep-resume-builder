import type { ResumeData } from '@/types'

export const emptyResume: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: '',
  experience: [],
  projects: [],
  education: [],
  skills: [],
  certifications: [],
  achievements: [],
}

// Shown on first load so the preview never looks empty. Users can clear it with one click.
export const sampleResume: ResumeData = {
  personal: {
    name: 'Rohan Sharma',
    title: '',
    email: 'rohansrma3@gmail.com',
    phone: '',
    location: '',
    linkedin: '',
    github: 'github.com/RS-labhub',
    website: 'rohansrma.me',
  },
  summary:
    'Developer Relations Engineer with 2+ years building developer education, technical content, and communities for venture-backed AI startups, including a company valued at $500M+ on $125M raised and a $2M-funded open-source platform. Delivered 800K+ impressions in under 60 days, grew an open-source project from 7K to 15K+ GitHub stars, added 4,000+ Discord members, and lifted website traffic 60%. Engineer first, building production applications alongside the docs, tooling, and content that drive adoption.',
  experience: [
    {
      id: crypto.randomUUID(),
      title: 'Developer Relations Engineer',
      company: 'LLMWare.ai',
      location: 'Remote',
      period: 'Jan, 2025 - Present',
      duties: [
        'Grew the open-source framework from ~7K to 15K+ GitHub stars and 1.5K to 3K forks organically, while adding 4,000+ Discord members through outreach programs, hackathons, and developer events',
        'Lifted website traffic 60% and social following 80% by authoring blogs, tutorials, and docs on RAG, agents, and private small-language-model deployment',
        "Shipped the company website plus Model HQ's full documentation and API reference solo in 2 months, supporting enterprise product adoption",
        'Designed and delivered a new UI/UX for Model HQ, the enterprise SLM platform serving Silicon Valley clients, improving usability and accessibility',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Developer Relations Engineer',
      company: 'Tessl',
      location: 'Remote',
      period: 'Aug, 2025 - Aug, 2026',
      duties: [
        'Generated 800K+ impressions across 72 posts in under 60 days at a startup valued $500M+ on $125M raised, driving 1.5K+ reactions, 600+ comments, and ~10K visits',
        'Built content automation tooling for cross-posting, analytics, and GTM workflows, saving 20+ hours of manual work per week',
        'Owned Reddit GTM and community strategy across Tessl and AI Native Dev, and revamped a 50K+ subscriber YouTube channel with new playlists and 400+ rewritten descriptions',
        'Drove marketing and community operations for AI DevCon end to end, and catalogued 250+ tools for the AI Native Dev landscape',
      ],
    },
    {
      id: crypto.randomUUID(),
      title: 'Developer Advocate',
      company: 'Quira',
      location: 'Remote',
      period: 'Apr, 2024 - Aug, 2025',
      duties: [
        'Joined a $2M-funded open-source monetisation platform as a community moderator and was promoted into developer advocacy after driving the highest Discord engagement',
        "Grew and moderated Quira's 6K+ member Discord, mobilising developers for open-source Quests and weekly participation",
        'Published technical content and Quest write-ups on sustainable open-source funding, and proposed community programs that measurably improved retention',
      ],
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: "R's PlacePrep",
      tech: 'Next.js · PostgreSQL · Permit.io',
      link: '',
      desc: 'Placement-prep and secure online exam platform for universities. Reached 500+ active users, 120K visits and page views, and 1M+ requests within 60 days. Solved the problem of training and placement management.',
    },
    {
      id: crypto.randomUUID(),
      name: 'RsOpsHub',
      tech: 'Next.js · PostgreSQL · Integrations',
      link: '',
      desc: 'Self-hosted operations hub unifying content, tasks, documents, analytics, work logs, and hours tracking. Integrates Linear, Notion, Google Workspace, Reddit, Hacker News, dev.to, and PostHog behind a single AI assistant, with workspace-level data isolation.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: 'B.Tech · Computer Science & Engineering',
      institution: 'Nalanda College of Engineering, Chandi',
      period: '2022-2026',
      detail: 'CGPA 8.3',
    },
  ],
  skills: [
    { id: crypto.randomUUID(), label: 'Languages', items: 'C/C++, Go, Python, TypeScript, SQL' },
    { id: crypto.randomUUID(), label: 'Frameworks', items: 'React, Next.js, Node.js, Tailwind, Astro' },
    { id: crypto.randomUUID(), label: 'Tools', items: 'Git, Docker, PostgreSQL, Redis, Azure, Figma, Sanity' },
  ],
  certifications: [
    { id: crypto.randomUUID(), name: 'Azure AI Fundamentals', year: '2023' },
    { id: crypto.randomUUID(), name: 'GCD Leader Training Specialization', year: '2023' },
    { id: crypto.randomUUID(), name: 'Rust & Solana Dev Training', year: '2023' },
    { id: crypto.randomUUID(), name: 'Python Essentials 1 & 2', year: '2023' },
    { id: crypto.randomUUID(), name: 'Programming Essentials in C++', year: '2023' },
  ],
  achievements: [
    'Winner, Permit.io Authorization Challenge (May 2025)',
    'Mattermost MVP, Hall of Fame contributor (Jan 2025)',
    '3rd globally, DevFest AI open-source competition (Nov 2024)',
    'Winner, Arcjet Security Challenge (Sep 2024)',
    "8th globally, HackSquad'23 (Oct 2023)",
  ],
}
