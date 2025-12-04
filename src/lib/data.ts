import { client } from "./sanity";
import { Project, Experience } from "@/types";

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await client.fetch(`*[_type == "project"] | order(publishedAt desc)`);
    console.log(`[getProjects] Fetched ${data.length} projects`);
    return data;
  } catch (error) {
    console.error("[getProjects] Failed:", error);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const data = await client.fetch(`*[_type == "experience"] | order(startDate desc)`);
    console.log(`[getExperiences] Fetched ${data.length} experiences`);
    return data;
  } catch (error) {
    console.error("[getExperiences] Failed:", error);
    return [];
  }
}
