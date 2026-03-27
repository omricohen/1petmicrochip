import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { validateMicrochipId, formatMicrochipId } from "@/lib/utils";
import { lookupAllExternal } from "@/lib/external-lookup";

export async function GET(request: NextRequest) {
  const chip = request.nextUrl.searchParams.get("chip");
  if (!chip || !validateMicrochipId(chip)) {
    return NextResponse.json(
      { error: "Invalid microchip number. Must be 9-15 digits." },
      { status: 400 }
    );
  }

  const microchipId = formatMicrochipId(chip);
  const results = await lookupAllExternal(microchipId);

  return NextResponse.json({ results });
}
