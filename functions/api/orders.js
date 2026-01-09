import { createClient } from '@supabase/supabase-js'; // If using Supabase for DB

// In-memory storage for demo (use a database in production)
let orders = [];
let orderIdCounter = 1000;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'POST') {
    try {
      const { customerDetails, cart, paymentMethod } = await request.json();
      const orderId = `NG-${orderIdCounter++}`;
      const order = {
        id: orderId,
        customer: customerDetails,
        items: cart,
        paymentMethod,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'pending',
        date: new Date()
      };
      orders.push(order);

      // Here you could send emails or save to DB

      return new Response(JSON.stringify({ success: true, orderId, message: 'Order placed successfully!' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: 'Error processing order' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else if (request.method === 'GET') {
    // For admin, but in production add authentication
    return new Response(JSON.stringify(orders), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}