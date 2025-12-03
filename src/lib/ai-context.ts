import { getExperiences, getProjects } from "@/lib/data";

export async function getPortfolioContext(): Promise<string> {
  const experiences = await getExperiences();
  const projects = await getProjects();

  const experienceText = experiences
    .map(
      (e) =>
        `- ${e.title} at ${e.company} (${e.startDate} to ${
          e.isCurrent ? "Present" : e.endDate
        }). Description: ${e.description}. Skills: ${e.skills.join(", ")}.`
    )
    .join("\n");

  const projectText = projects
    .map(
      (p) =>
        `- Project: ${p.title}. Description: ${p.description}. Tags: ${p.tags.join(
          ", "
        )}.`
    )
    .join("\n");

  return `
    Experiences:
    ${experienceText}

    Projects:
    ${projectText}
  `;
}

