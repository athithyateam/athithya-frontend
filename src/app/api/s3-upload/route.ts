import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const uploadUrl = req.nextUrl.searchParams.get("uploadUrl");
    if (!uploadUrl) {
      return NextResponse.json({ error: "Missing uploadUrl" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await req.arrayBuffer();

    const s3Res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: arrayBuffer,
    });

    if (!s3Res.ok) {
      const errText = await s3Res.text();
      return NextResponse.json(
        { error: `S3 returned ${s3Res.status}`, details: errText },
        { status: s3Res.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Proxy upload failed" },
      { status: 500 }
    );
  }
}

