import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your domain if you want to restrict it
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function handleOptions(request) {
  if (request.headers.get('Origin') !== null &&
      request.headers.get('Access-Control-Request-Method') !== null &&
      request.headers.get('Access-Control-Request-Headers') !== null) {
    return new Response(null, {
      headers: corsHeaders
    });
  } else {
    return new Response(null, {
      headers: {
        'Allow': 'GET, HEAD, POST, OPTIONS',
      }
    });
  }
}

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { 
          status: 405,
          headers: corsHeaders
        });
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });

      // Parse the request body
      const { title, style } = await request.json();
      
      if (!title || !style) {
        return new Response("Title and style are required", { 
          status: 400,
          headers: corsHeaders
        });
      }

      // Generate image using DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a poster for a movie called ${title} in this style: ${style}.`,
        n: 1,
        size: "1024x1024",
      });

      return new Response(JSON.stringify({ 
        imageUrl: response.data[0].url 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ 
        error: "Error generating image. Please try again." 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};