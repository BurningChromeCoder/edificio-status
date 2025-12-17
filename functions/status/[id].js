// functions/status/[id].js
// Maneja PUT /status/:id

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequestPut(context) {
  const { request, env, params } = context;
  
  try {
    const serviceId = params.id;
    console.log('PUT /status/' + serviceId);
    
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        error: 'No autorizado'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { status } = await request.json();

    if (!['ok', 'warning', 'error'].includes(status)) {
      return new Response(JSON.stringify({ 
        error: 'Estado inválido'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(
      'UPDATE services SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, serviceId).run();

    const updated = await env.DB.prepare(
      'SELECT * FROM services WHERE id = ?'
    ).bind(serviceId).first();

    return new Response(JSON.stringify({ 
      success: true,
      service: updated 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { 
    headers: corsHeaders, 
    status: 204 
  });
}