import { getExperiences, getProjects } from "@/lib/data";

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
`;

export async function getPortfolioContext(): Promise<string> {
  const experiences = await getExperiences();
  const projects = await getProjects();

  // Defensive mapping to handle missing fields
  const experienceText = experiences
    .map((e) => {
      const skills = e.skills && Array.isArray(e.skills) ? e.skills.join(", ") : "General";
      const endDate = e.isCurrent ? "Present" : e.endDate || "Unknown";
      return `- ${e.title} at ${e.company} (${e.startDate} to ${endDate}). Description: ${e.description || "No description"}. Skills: ${skills}.`;
    })
    .join("\n");

  const projectText = projects
    .map((p) => {
      const tags = p.tags && Array.isArray(p.tags) ? p.tags.join(", ") : "General";
      return `- Project: ${p.title}. Description: ${p.description || "No description"}. Tags: ${tags}.`;
    })
    .join("\n");

  return `
    Experiences:
    ${experienceText}

    Projects:
    ${projectText}

    ${PERSONAL_FACTS}
  `;
}
