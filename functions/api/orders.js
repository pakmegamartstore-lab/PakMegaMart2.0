import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  const { request, env } = context;

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  if (request.method === 'POST') {
    try {
      const { customerDetails, cart, paymentMethod } = await request.json();
      console.log('Received order data:', { customerDetails, cart, paymentMethod });

      const orderId = `NG-${Date.now()}`;
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      console.log('Calculated total:', total);

      const order = {
        id: orderId,
        customer: customerDetails,
        items: cart,
        paymentMethod,
        total: total,
        status: 'pending',
        date: new Date().toISOString()
      };

      console.log('Order object to insert:', order);

      const { error } = await supabase.from('orders').insert(order);
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Order inserted successfully:', orderId);

      return new Response(JSON.stringify({ success: true, orderId, message: 'Order placed successfully!' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error processing order:', error);
      return new Response(JSON.stringify({ success: false, message: 'Error processing order: ' + error.message }), {
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
      console.error('Error fetching orders:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}