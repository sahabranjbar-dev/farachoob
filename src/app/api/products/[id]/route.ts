import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const product = await prisma?.product.findUnique({
    where: {
      id,
    },
  });
  return NextResponse.json(product);
}
