# arsaludin.my.id

A personal portfolio website that documents my journey, experiences, and work in a comprehensive way, and represents my skills, character, and approach to building digital solutions.

Feel free to explore the project and take a look around. If you find it interesting or useful, consider giving it a star ⭐

Have feedback, ideas, or questions? I’d love to hear from you.

<div align="center">
  <img 
    src="https://kzuvyclbkbaftxolvnik.supabase.co/storage/v1/object/public/arsaludin-portfolio/projects/personal-portfolio-website-v1.webp" 
    alt="Personal Portfolio Website" 
    width="100%" 
    style="aspect-ratio: 4/3; object-fit: cover; border-radius: 8px;"
  />
</div>

## ✨ Features

### Product Features

- **Profile Overview:** A concise personal overview highlighting background, experience, skills, and services.
- **Content Showcase:** Curated selection of projects, articles, and achievements with detailed breakdowns and insights.
- **Interactive Experience**: Engagement features including comments, reactions, a community lounge, and a roadmap for feedback, feature requests, and development tracking.
- **Bilingual Support (ID/EN):** Content strategy designed for both local and global audiences.
- **Responsive Experience:** Optimized for desktop, tablet, and mobile devices.
- **Theme Support:** Seamless dark, light, and system-based theme switching with persistent user preference.
- **Content System:** Flexible article and documentation system powered by MDX for rich content authoring.
- **Secure Authentication**: Simple and secure sign-in using Google OAuth.

### Technical Features

- **Modern Architecture:** Built with Next.js App Router, TypeScript, Zustand, and TanStack Query for scalable frontend architecture and state management.
- **Backend Integration:** Uses Supabase for authentication, database management, realtime features, and file storage.
- **Design System Driven:** Built with a growing internal design system focused on reusable components and consistent user experiences.
- **SEO & Performance Optimized:** Built with semantic metadata, structured data, and optimized Core Web Vitals for strong search visibility and performance.
- **Web Analytics:** Integrated with Google Analytics and Google Tag Manager to track user behavior and engagement insights.
- **CI/CD Pipeline:** Automated build verification and deployment workflow using GitHub Actions.

## 📄 Pages

| Page                     | Description                                                                                                                                                         |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **/**                    | Home page providing a concise personal overview with key highlights of background, experience, skills, services, featured projects, achievements, and testimonials. |
| **/projects**            | A curated showcase of projects that represent my technical expertise.                                                                                               |
| **/projects/[slug]**     | Individual project page with project details and information.                                                                                                       |
| **/achievements**        | A curated collection of certifications and awards that reflect my learning journey and professional growth.                                                         |
| **/articles**            | Collection of articles, insights, and writings.                                                                                                                     |
| **/articles/[slug]**     | Full article with deeper thoughts and reflections.                                                                                                                  |
| **/roadmap**             | Interactive board for feature ideas, bug reports, and development tracking.                                                                                         |
| **/lounge**              | Real-time community space to chat, share ideas, and explore topics together.                                                                                        |
| **/changelog**           | See what's new, including new features, improvements, and bug fixes.                                                                                                |
| **/gear-and-setup**      | A collection of devices, workspace setup, essentials, and tools that support my daily work and productivity.                                                        |
| **/inspiration-website** | Collection of websites that inspire and serve as references for this project.                                                                                       |
| **/privacy-policy**      | Explanation of how user data is handled and protected.                                                                                                              |

## 🛠️ Tech Stack

- [**Next.js**](https://nextjs.org)
- [**TypeScript**](https://www.typescriptlang.org)
- [**Tailwind CSS**](https://tailwindcss.com)
- [**Motion**](https://motion.dev)
- [**Supabase**](https://supabase.com)
- [**TanStack Query**](https://tanstack.com/query)
- [**Zustand**](https://zustand-demo.pmnd.rs)
- [**Zod**](https://zod.dev)
- [**Next-intl**](https://next-intl-docs.vercel.app)
- [**MDX**](https://mdxjs.com)
- [**React Icons**](https://react-icons.github.io/react-icons/)
- [**ESLint**](https://eslint.org)
- [**Prettier**](https://prettier.io)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js (v18.x or later)
- npm / yarn / pnpm / bun

### Installation

1. Clone this repository

**Using HTTPS**

```bash
  git clone https://github.com/muhamadarsaludin/arsaludin-portfolio.git
```

**Using SSH**

```bash
  git clone git@github.com:muhamadarsaludin/arsaludin-portfolio.git
```

2. Navigate to the project directory:

```bash
  cd arsaludin-portfolio
```

3. Install Dependencies using your preferred package manager:

```bash
  # npm
  npm install
  # yarn
  yarn install
  # pnpm
  pnpm install
  # bun
  bun install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL= http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL= your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY= your_supabase_anon_public_key

# Web Analytics & Tracking
NEXT_PUBLIC_GTM_ID= your_gtm_id
NEXT_PUBLIC_GA_ID= your_ga_id
```

### Usage

Start the development server:

```bash
  # npm
  npm run dev
  # yarn
  yarn dev
  # pnpm
  pnpm dev
  # bun
  bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```text
src/
├── app/             # Next.js App Router (pages, layouts, and routing)
├── components/      # Reusable UI components & Miracle UI Design System
├── configs/         # App Configuration
├── features/        # Feature-based modules
├── hooks/           # Global Custom React Hooks
├── i18n/            # Internationalization (i18n) configuration
├── lib/             # Third-party integrations and configurations
├── messages/        # Localization Messages
├── providers/       # Context Providers
├── public/          # Static Assets
├── types/           # Global TypeScript type definitions
└── utils/           # Reusable Utility Functions
```

## 🤝 Contributing

This project is continuously evolving, and community feedback plays an important role in its direction.

Feel free to contribute via GitHub Issues, Pull Requests, or the [Roadmap](https://arsaludin.my.id/en/roadmap) to suggest ideas, report bugs, and track progress.

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this project with proper attribution. See the `LICENSE` file for more details.

## 📬 Contact

Let's connect, collaborate, or discuss building great digital solutions together:

- Website: https://arsaludin.my.id
- GitHub: https://github.com/muhamadarsaludin
- LinkedIn: https://linkedin.com/in/muhamadarsaludin
