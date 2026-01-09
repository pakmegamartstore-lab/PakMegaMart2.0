import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  if (request.method === 'POST') {
    try {
      const { customerDetails, cart, paymentMethod } = await request.json();
      const orderId = `NG-${Date.now()}`;
      const order = {
        id: orderId,
        customer: customerDetails,
        items: cart,
        paymentMethod,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        status: 'pending',
        date: new Date().toISOString()
      };

      const { error } = await supabase.from('orders').insert(order);
      if (error) throw error;

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
    try {
      const { data: orders, error } = await supabase.from('orders').select('*');
      if (error) throw error;

      return new Response(JSON.stringify(orders), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}