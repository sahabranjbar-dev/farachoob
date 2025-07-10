export async function GET() {
  try {
    const maxPrice = await prisma?.product.aggregate({
      _max: {
        price: true,
      },
    });
    const price = maxPrice && maxPrice._max ? maxPrice._max.price : null;
    return new Response(JSON.stringify({ maxPrice: price }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch max price" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
