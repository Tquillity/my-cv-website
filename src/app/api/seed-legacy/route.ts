import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import legacyData from "@/data/legacy-cv-data.json";

export async function GET() {
  try {
    const token = process.env.SANITY_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Missing SANITY_API_TOKEN" },
        { status: 500 }
      );
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    const { legacyExperience, legacyEducation } = legacyData;
    const results = [];

    // Seed Experience
    for (const exp of legacyExperience) {
      const docId = `experience-legacy-${exp.id}`;
      const doc = {
        _id: docId,
        _type: "experience",
        company: exp.company,
        title: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.description,
        isCurrent: false,
        isProminent: exp.isProminent,
        skills: exp.skills,
      };

      const result = await client.createOrReplace(doc);
      results.push(result);
    }

    // Seed Education
    for (const edu of legacyEducation) {
      // Generate a pseudo-ID for education since the JSON doesn't strictly have one like exp.id
      // Sanitize ID: lowercase, replace special chars, spaces with dashes
      const sanitizedId = edu.institution
        .toLowerCase()
        .replace(/ö/g, "o")
        .replace(/ä/g, "a")
        .replace(/å/g, "a")
        .replace(/[^a-z0-9]+/g, "-") // Replace any non-alphanumeric with dash
        .replace(/^-+|-+$/g, ""); // Trim dashes

      const docId = `education-legacy-${sanitizedId}`;
      const doc = {
        _id: docId,
        _type: "education",
        institution: edu.institution,
        degree: edu.degree,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: edu.description,
        isProminent: edu.isProminent,
      };

      const result = await client.createOrReplace(doc);
      results.push(result);
    }

    return NextResponse.json({
      message: "Legacy data seeded successfully",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
