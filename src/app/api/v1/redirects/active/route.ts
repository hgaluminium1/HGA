import { NextResponse } from "next/server";

import { listActiveRedirectsCached } from "@/modules/cms";

export async function GET() {
  const items = await listActiveRedirectsCached();
  return NextResponse.json({
    success: true,
    data: items.map((i) => ({
      fromPath: i.fromPath,
      toPath: i.toPath,
      statusCode: i.statusCode,
    })),
  });
}
