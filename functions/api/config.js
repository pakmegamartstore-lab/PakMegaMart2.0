export async function onRequest(context) {
  const { env } = context;

  const config = {
    emailjsPublicKey: env.EMAILJS_PUBLIC_KEY || null,
    serviceId: env.EMAILJS_SERVICE_ID || null,
    templateAdmin: env.EMAILJS_TEMPLATE_ADMIN || null,
    templateCustomer: env.EMAILJS_TEMPLATE_CUSTOMER || null
  };

  return new Response(JSON.stringify(config), {
    headers: { 'Content-Type': 'application/json' }
  });
}