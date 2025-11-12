import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    if (username === "root" && password === "1234") {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
