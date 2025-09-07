import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, context: any) {
  const id = context?.params?.id;

  const product = await prisma?.product.findUnique({
    where: {
      id,
    },
  });
  return NextResponse.json(product);
}
