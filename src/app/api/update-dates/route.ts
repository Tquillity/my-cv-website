import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

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

    const updates = [
      {
        companyTerm: "Mindconnect",
        startDate: "2015-02-01",
        endDate: "2018-08-01"
      },
      {
        companyTerm: "Vinnova",
        startDate: "2018-11-05",
        endDate: "2021-07-31"
      },
      {
        companyTerm: "Neuro",
        startDate: "2024-09-01",
        endDate: "2024-11-30" // Adjusted from 11-31 (invalid date) to 11-30
      },
      {
        companyTerm: "Action Port", // Might be ActionPort or Action Port
        startDate: "2025-01-01",
        endDate: "2025-03-31"
      }
    ];

    const results = [];

    for (const update of updates) {
      // Find the document
      const query = `*[_type == "experience" && company match "${update.companyTerm}*"][0]._id`;
      const docId = await client.fetch(query);

      if (docId) {
        console.log(`Found ${update.companyTerm} with ID: ${docId}. Updating...`);
        const patch = client.patch(docId).set({
          startDate: update.startDate,
          endDate: update.endDate
        });
        const result = await patch.commit();
        results.push({ company: update.companyTerm, status: "Updated", result });
      } else {
        console.warn(`Could not find document for ${update.companyTerm}`);
        results.push({ company: update.companyTerm, status: "Not Found" });
      }
    }

    return NextResponse.json({
      message: "Date updates processed",
      results,
    });
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Update failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
