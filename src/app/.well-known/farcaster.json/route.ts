export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  const config = {
    "accountAssociation": {
      header: "eyJmaWQiOjI2ODQzOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDIxODA4RUUzMjBlREY2NGMwMTlBNmJiMEY3RTRiRkIzZDYyRjA2RWMifQ",
      payload: "eyJkb21haW4iOiJoYWNrYXRob24tYmF5LXNldmVuLnZlcmNlbC5hcHAifQ",
      signature: "MHhhYzVlZGU1MjFhY2Y5OWE4MGRjNmJlZDNkYTNiNzJmNjVlM2U4NzQxNTEzYTkyYzUwYThiNDlmMjcyNTRhMGZkMGRiOGJlYWU5YWZkYmEyNDFkNDY0YWQ2ZWFkYTk5ZjI1MDVlY2QyNzg5NGFiY2E2Njc4MmU2N2NkODNmN2Y2YTFj"
    },
    frame: {
      version: "1",
      name: "Frames v2 Demo",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image`,
      buttonTitle: "Launch",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
