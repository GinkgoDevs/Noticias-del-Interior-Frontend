import { fetchApi } from "@/lib/api-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await fetchApi("/news?featured=true&limit=5");
    return NextResponse.json(data.items || []);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    return NextResponse.json([]);
  }
}
