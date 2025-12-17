// functions/status.js
// Maneja GET /status

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    console.log('GET /status');
    
    const { results } = await env.DB.prepare(
      'SELECT id, name, status, updated_at FROM services ORDER BY id'
    ).all();

    console.log('Services found:', results.length);

    return new Response(JSON.stringify({ services: results }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
      },
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