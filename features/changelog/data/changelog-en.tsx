import MiracleBanner from "@/components/miracle/Banner"
import Link from "next/link"
import { LuPartyPopper } from "react-icons/lu"

export const CHANGELOG_EN = [
  {
    version: "1.0.0",
    releaseDate: "2026-06-06",
    banner: (
      <MiracleBanner
        variant="secondary"
        color="blue"
        startIcon={<LuPartyPopper />}
        title="Versi 1.0.0 — Initial Release"
      >
        <p>
          This release marks the starting point of my portfolio, setting the foundation for its
          structure while highlighting the journey, experience, and work I’ve built along the way.
          It will continue to evolve over time, so if you spot any bugs or have ideas to share, feel
          free to leave feedback on the{" "}
          <Link href="/roadmap" className="text-blue :hover:underline font-medium">
            Roadmap
          </Link>{" "}
          page. Enjoy exploring, and thanks for your support!.
        </p>
      </MiracleBanner>
    ),
    changes: `
<MiracleBadge color="green" variant="secondary">Added</MiracleBadge>
<div className="text-sm">
* [Home](/) page as the main entry point, providing a concise overview of profile, selected projects, and key information.  
* [Projects](/projects) page to showcase and explore my work, with search and filter capabilities.  
* [Achievements](/achievements) page to display my accomplishments, with search, filter, and modal-based detail views.  
* [Articles](/articles) page to share my writings and insights, with search and filter features.  
* [Roadmap](/roadmap) page as a kanban board to track development progress and collect bug reports, feature requests, improvements, and changes.  
* [Lounge](/lounge) page as a chat-based discussion space for sharing ideas and communicating with others.
* [Changelog](/changelog) page to document all updates, fixes, and new features across versions.  
* [Gear & Setup](/gear-and-setup) page to showcase tools, devices, and setups that support my workflow.  
* [Inspiration Website](/inspiration-website) page to curate websites used as references in building this portfolio.  
* [Privacy Policy](/privacy-policy) page to explain how user data is collected, used, and protected.  
* **!Download Resume** feature to download my latest resume.
* **!Internationalization (i18n)** feature with English and Indonesian language support.
* **!Theming** feature to switch between light, dark, and system themes for a personalized viewing experience. 
* **!SignIn with Google** feature for user authentication.  
* **!Account Deletion** feature to permanently remove user data and account.  
* **!Comment** feature to provide comments on projects and articles.  
* **!Comment Reply** feature to provide replies to comments.
* **!Reactions** feature to provide reactions to projects, articles, achievements, testimonials, and comments.  
* **!Google Analytics Integration** to analyze user behavior and interactions on the website.  
</div>
    `,
  },
]
