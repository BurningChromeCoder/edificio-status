// functions/login.js
// Maneja POST /login

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    console.log('POST /login');
    
    const { username, password } = await request.json();

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first();

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Usuario o contraseña incorrectos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verificación simple (admin/admin123)
    const validPassword = password === 'admin123' && username === 'admin';
    
    if (!validPassword) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Usuario o contraseña incorrectos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = btoa(`${username}:${Date.now()}`);

    return new Response(JSON.stringify({ 
      success: true, 
      token,
      username: user.username 
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