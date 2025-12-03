import { NextResponse } from "next/server";
import { verifyMessage } from "viem";
import { client } from "@/lib/sanity";

export async function POST(request: Request) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify Web3 Signature
    const valid = await verifyMessage({
      address,
      message,
      signature,
    });

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Write to Sanity
    // Note: Writing requires a token with write access.
    // We use a separate client with token for write operations if needed,
    // but for now we assume the main client has token if set in env.
    
    // In a real app, ensure NEXT_PUBLIC_SANITY_TOKEN is NOT exposed to client,
    // and use a separate server-only client for mutations.
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_TOKEN, 
    });

    if (!process.env.SANITY_API_TOKEN) {
      console.warn("SANITY_API_TOKEN is missing. Cannot write to Sanity.");
      // Return success for mock purposes if no token
      return NextResponse.json({ success: true, mock: true });
    }

    await writeClient.create({
      _type: "guestbook",
      address,
      message,
      signature,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guestbook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

