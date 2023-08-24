let API_KEY: string | null = null;

const OPENAI_API_URL = `https://api.openai.com/v1/chat/completions`;

function getHeaders() {
    console.log(API_KEY);
    return {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
}

// Function to update the API key
export function setAPIKey(key: string | null) {
    API_KEY = key;
}

export async function callOpenAI(
    prompt: string,
    model: string = 'gpt-3.5-turbo',
    temperature: number = 0.7
): Promise<string> {
    const requestBody = {
        model: model,
        messages: [{
            role: "user",
            content: prompt
        }],
        temperature: temperature
    };

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: getHeaders(),  // Use the function here
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`OpenAI API call failed: ${response.statusText}. Details: ${errorDetail}`);
    }

    const responseBody = await response.json();
    return responseBody.choices[0].message.content.trim();
}
