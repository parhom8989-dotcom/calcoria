export async function GET() {
  const htmlContent = `<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: 106587f3338e6756</body>
</html>`;

  return new Response(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}