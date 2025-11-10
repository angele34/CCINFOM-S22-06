import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    // TODO: validate credentials against DB
    if (username === "root" && password === "1234") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Something went wrong" });
  }
}
