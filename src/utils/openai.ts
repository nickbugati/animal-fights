const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function callOpenAI(
    prompt: string,
    { model = 'text-davinci-002', temperature = 0.7 } = {}
): Promise<string> {
    const OPENAI_API_URL = `https://api.openai.com/v1/engines/${model}/completions`;

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const requestBody = {
        prompt: prompt,
        max_tokens: 150, // Set your desired token count or other parameters here
        temperature: temperature
    };

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`OpenAI API call failed: ${response.statusText}`);
    }

    const responseBody = await response.json();
    return responseBody.choices[0].text.trim();
}
