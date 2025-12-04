import { getExperiences, getProjects } from "@/lib/data";

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
  `;
}
