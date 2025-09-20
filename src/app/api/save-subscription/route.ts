import { NextRequest, NextResponse } from "next/server";

let subscriptions: any[] = []; // ⚠️ در عمل باید DB باشه

export async function POST(req: NextRequest) {
  const body = await req.json();
  subscriptions.push(body);

  return NextResponse.json({ success: true });
}

export function getSubscriptions() {
  return subscriptions;
}
