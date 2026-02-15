export async function GET() {
  const htmlContent = `<!DOCTYPE html>
<html>
    <head>
        <meta name="yandex-verification" content="106587f3338e6756" />
    </head>
    <body>Verification: 106587f3338e6756</body>
</html>`;

  return new Response(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}