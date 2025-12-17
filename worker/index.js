import bcrypt from 'bcryptjs';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/status - Obtener estado de todos los servicios
      if (path === '/api/status' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, name, status, updated_at FROM services ORDER BY id'
        ).all();

        return new Response(JSON.stringify({ services: results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // POST /api/login - Autenticación
      if (path === '/api/login' && request.method === 'POST') {
        const { username, password } = await request.json();

        const user = await env.DB.prepare(
          'SELECT * FROM users WHERE username = ?'
        ).bind(username).first();

        if (!user) {
          return new Response(JSON.stringify({ error: 'Usuario o contraseña incorrectos' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
          return new Response(JSON.stringify({ error: 'Usuario o contraseña incorrectos' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Generar token simple (en producción usa JWT)
        const token = btoa(`${username}:${Date.now()}`);

        return new Response(JSON.stringify({ 
          success: true, 
          token,
          username: user.username 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // PUT /api/status/:serviceId - Actualizar estado de servicio (requiere auth)
      if (path.startsWith('/api/status/') && request.method === 'PUT') {
        const serviceId = path.split('/').pop();
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'No autorizado' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { status } = await request.json();

        if (!['ok', 'warning', 'error'].includes(status)) {
          return new Response(JSON.stringify({ error: 'Estado inválido' }), {
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

        return new Response(JSON.stringify({ service: updated }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};