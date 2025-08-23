// app/api/captcha/route.ts
export const runtime = "edge"; // Using Edge runtime for better performance

function generateCaptchaText(length = 5) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

export async function GET() {
  try {
    const text = generateCaptchaText();

    // Using SVG for captcha instead of canvas for better compatibility
    const svg = `
      <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        ${Array.from(
          { length: 30 },
          () =>
            `<circle cx="${Math.random() * 120}" cy="${
              Math.random() * 40
            }" r="1" fill="rgb(${Math.random() * 255},${Math.random() * 255},${
              Math.random() * 255
            })"/>`
        ).join("")}
        <text x="15" y="28" font-family="Arial" font-size="24" fill="#333">${text}</text>
      </svg>
    `;

    const headers = new Headers({
      "Content-Type": "image/svg+xml",
      "Set-Cookie": `captcha=${text}; HttpOnly; Max-Age=300; Path=/`,
    });

    return new Response(svg, { status: 200, headers });
  } catch (error) {
    console.error("Captcha generation error:", error);
    return Response.json(
      { error: "Failed to generate captcha" },
      { status: 500 }
    );
  }
}
