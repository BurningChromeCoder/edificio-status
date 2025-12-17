// functions/status.js
// Maneja GET /status

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// functions/status.js
export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // AGREGAMOS 'message' A LA CONSULTA SQL
    const { results } = await env.DB.prepare(
      'SELECT id, name, status, message, updated_at FROM services ORDER BY id'
    ).all();

    return new Response(JSON.stringify({ services: results }), {
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, { 
    headers: corsHeaders, 
    status: 204 
  });
}