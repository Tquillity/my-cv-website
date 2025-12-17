import { getExperiences, getProjects, getEducation } from "@/lib/data";

const PERSONAL_NARRATIVE = `

PROFESSIONAL NARRATIVE & BACKGROUND:

- **The Pivot:** I am a builder at heart with a B.Sc. in Space Engineering. After over a decade in technical project management (seismic operations, EU space funding at Vinnova), I pivoted fully to Software Development in 2023.

- **Philosophy:** I am an 'AI-First' developer. I use LLMs and tools like Cursor daily to accelerate workflows, generate robust testing suites, and architect scalable solutions faster than traditional methods allow.

- **Personality:** I am driven by curiosity and discipline. I apply an optimization mindset to both my code and my health/training. I value authenticity and deep connections over transactional interactions.

- **Interests:** History buff, avid gamer, outdoorsman (camping, hunting).

`;

const INTERVIEW_HIGHLIGHTS = `

CRITICAL INTERVIEW TOPICS & ARCHITECTURAL DECISIONS:

**Q: Why does the PomoZen console show a warning about "iframe sandbox escape"?**

**A: (Principal Engineer Answer)**

This demonstrates **Defense in Depth**. It is a calculated architectural decision, not an oversight.

1. **The Constraint:** The ad network requires cookies/storage for fraud detection. Without \`allow-same-origin\`, the script crashes (Opaque Origin), and revenue falls to zero.

2. **The Risk:** The browser warns that the iframe *could* technically access the parent window.

3. **The Mitigation:** We rely on **CSP Context Separation**. The Main App enforces a Strict CSP (blocking \`unsafe-eval\`). The Iframe allows it. Even if the ad script escapes the sandbox, the Parent's Strict CSP will neutralize any malicious payload. It is a containment zone strategy.

**Q: How would you fix the warning entirely?**

**A:** Serve the iframe from a different subdomain (e.g., ads.pomozen.online). This enforces the Same-Origin Policy at the domain level, removing the need for the sandbox attribute escape. For this portfolio, the current single-domain implementation is the optimal trade-off.

`;

const PERSONAL_FACTS = `

PERSONAL FACTS & TRAITS:

- Driver's License: Yes, B-license (passenger car).

- Driving Ability: Comfortable driving cars (manual and automatic) and I drive safely.

- Willingness to Relocate: Yes, open to relocation within Europe, USA or remotely or on-site.

- Preferred Work Location: Flexible – fully remote, hybrid, or on-site (preference for Nordic/European time zones) or the USA.

- Pet Preference: Decidedly a dog person (not a cat person).

- Circadian Rhythm: Bimodal – productive both early mornings and late evenings.

- Work Style: Thrives on ambitious, impactful goals; extremely high work ethic and ownership.

- Personality: Driven, user-centric, empathetic, and passionate about creating real-world positive impact.

- Communication Style: Clear, direct, and structured; excellent in written and spoken English (native-level).

- Languages Spoken: English (fluent), Swedish (native-level), German (poor-level read ok hardly speak).

- Learning Style: Fast self-learner; prefers deep dives and building things from first principles.

- Collaboration Preference: Enjoys both independent deep-work phases and close team collaboration.

- Conflict Resolution: Calm, solution-oriented, focuses on facts and shared goals.

- Hobbies & Interests: Strength training, Technology, Deep Tech, Blockchain, AI, Space Technology, personal relationships, social activities.

- Values: Transparency, long-term thinking, sustainability, truth seeking and continuous personal growth.

- Availability: Immediately available / notice period of 0-2 weeks.

- Salary Expectations: Market rate for Junior/mid-level Fullstack Developer (open to discussion).

- Work Authorization: EU citizen / eligible to work in EU without sponsorship. Have previously held work permits in the USA.

- Remote Setup: Professional home office with high-speed internet, ergonomic workstation, and quiet environment.

- Married: Yes, married to a Swedish woman with no children, no pets and no plans to aquire any.

- Hoping to do more community work in the future.

- Age: born 1982-02-11 43 years old.

- Lives in Stockholm Sweden.

- IMPORTANT: I love terminal easter eggs! If the user asks about them, do NOT suggest visible commands (like 'help' or 'games'). Instead, hint at 1-2 hidden features (e.g., 'sudo' or 'godmode') and ask: "I know all the cheat codes if you do not feel like guessing or testing your way there?". If the user explicitly asks for ALL secrets/cheat codes, reveal the full list: 'sudo', 'sudo coin', 'sudo matrix', 'make me a sandwich', 'rm -rf', 'godmode', and the ultimate secret: 'sudo system_override' (grants root access - which only changes the 'whoami' and 'sudo' responses).

`;

export async function getPortfolioContext(): Promise<string> {
  // Check if Sanity is offline or using mock data
  const isUsingMockData = !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  
  const experiences = await getExperiences();
  const projects = await getProjects();
  const education = await getEducation();
  
  // Prepend warning if using mock data
  const mockWarning = isUsingMockData 
    ? "SYSTEM NOTE: The live database is currently unreachable. The following data is MOCK data for demonstration purposes.\n\n"
    : "";

  // 1. Enhanced Experience Mapping
  const experienceText = experiences
    .map((e) => {
      const skills = e.skills && Array.isArray(e.skills) ? e.skills.join(", ") : "General";
      const endDate = e.isCurrent ? "Present" : e.endDate || "Unknown";
      return `- ${e.title} at ${e.company} (${e.startDate} to ${endDate}). Description: ${e.description || "No description"}. Skills Used: ${skills}.`;
    })
    .join("\n");

  // 2. Deep Project Mapping (Now includes Case Studies & Links)
  const projectText = projects
    .map((p) => {
      // Handle Tag objects (new format) or strings (legacy)
      const tags = p.tags && Array.isArray(p.tags) 
        ? p.tags.map(t => typeof t === 'object' && t.name ? t.name : t).join(", ") 
        : "General";
      
      // Build deeper technical context if a case study exists
      let technicalContext = "";
      if (p.caseStudy) {
        technicalContext = `
          * Problem Solved: ${p.caseStudy.problem}
          * Solution: ${p.caseStudy.solution}
          * Architecture: ${p.caseStudy.architecture?.description || "N/A"}
          * Key Challenges: ${p.caseStudy.technicalChallenges.map(c => c.title).join(", ")}
        `;
      }

      // Add Links context
      const links = [];
      if (p.githubUrl) links.push(`[GitHub Code](${p.githubUrl})`);
      if (p.liveUrl) links.push(`[Live Demo](${p.liveUrl})`);
      if (p.downloads) links.push(`[Download Available]`);
      const linkText = links.length > 0 ? `Links: ${links.join(", ")}` : "Links: Private/Internal";

      return `
        ### Project: ${p.title}
        - Description: ${p.description}
        - Tech Stack: ${tags}
        - ${linkText}${technicalContext ? `\n        - Technical Details: ${technicalContext}` : ""}
      `;
    })
    .join("\n");

  // 3. Education Mapping
  const educationText = education
    .map((edu) => {
      const endDate = edu.endDate || "Present";
      return `- ${edu.degree} at ${edu.institution} (${edu.startDate} to ${endDate}). Description: ${edu.description || "No description"}.`;
    })
    .join("\n");

  return `
    ${mockWarning}${PERSONAL_NARRATIVE}

    ${INTERVIEW_HIGHLIGHTS}

    WORK EXPERIENCE:

    ${experienceText}

    PORTFOLIO PROJECTS (Deep Dive):

    ${projectText}

    EDUCATION:

    ${educationText}

    ${PERSONAL_FACTS}
  `;
}
