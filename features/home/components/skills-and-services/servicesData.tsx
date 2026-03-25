import React from 'react'
import FrontendIllustration from './illustrations/FrontendIllustration'
import BackendIllustration from './illustrations/BackendIllustration'
import AndroidIllustration from './illustrations/AndroidIllustration'
import UxIllustration from './illustrations/UxIllustration'
import PmIllustration from './illustrations/PmIllustration'
import DevopsIllustration from './illustrations/DevopsIllustration'

export const services = [
  {
    title: 'Frontend Development',
    description: 'Crafting intuitive, responsive, and engaging user interfaces using modern web technologies like React and Next.js.',
    illustration: <FrontendIllustration />,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Redux'],
    featured: true
  },
  {
    title: 'Backend Development',
    description: 'Developing robust, secure, and scalable server-side APIs and database architectures.',
    illustration: <BackendIllustration />,
    skills: ['Node.js', 'Express', 'PostgreSQL', 'REST API'],
    featured: true
  },
  {
    title: 'UI/UX Design',
    description: 'Designing user-centric, accessible, and aesthetically pleasing digital experiences and wireframes.',
    illustration: <UxIllustration />,
    skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems']
  },
  {
    title: 'Android Development',
    description: 'Creating native, performant, and feature-rich mobile applications for the Android ecosystem.',
    illustration: <AndroidIllustration />,
    skills: ['Kotlin', 'Jetpack Compose', 'Android Studio']
  },
  {
    title: 'Project Management',
    description: 'Planning, organizing, and managing resources to bring about the successful completion of specific project goals.',
    illustration: <PmIllustration />,
    skills: ['Agile', 'Scrum', 'Jira', 'Trello', 'Notion']
  },
  {
    title: 'DevOps & Cloud',
    description: 'Automating deployment pipelines, managing cloud infrastructure, and ensuring scalable system reliability.',
    illustration: <DevopsIllustration />,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'GitHub Actions']
  }
]