const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { messages, petContext } = await req.json()

    const systemPrompt = `You are PawPal AI, a friendly and knowledgeable pet care assistant.
You have access to the following pet's data:

${petContext}

Use this data to give personalized, specific advice. Be warm, concise, and practical.
If asked about something outside pet care, politely redirect to pet-related topics.
Always remind users to consult a vet for medical concerns.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
      }),
    })

    const data = await response.json()
    console.log('Groq response:', JSON.stringify(data))

    const replyText = data.choices?.[0]?.message?.content

    if (!replyText) throw new Error(`Groq returned no text. Full response: ${JSON.stringify(data)}`)

    // Return in same shape useChat.js expects
    return new Response(
      JSON.stringify({ content: [{ text: replyText }] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Function error:', err.message)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})