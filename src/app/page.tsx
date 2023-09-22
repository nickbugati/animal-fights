"use client"
import Image from 'next/image'
import React, { useState, useRef } from 'react';
import { callOpenAI, setAPIKey } from '@/utils/openai';

export default function Home() {

  const nameRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const animalRef = useRef<HTMLInputElement>(null);
  // ... other refs for each input

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [story, setStory] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const [apiKeyVerified, setApiKeyVerified] = useState<boolean>(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  async function handleApiKeySubmit(event: React.FormEvent) {
    event.preventDefault();

    if (apiKeyRef.current) {
      const inputApiKey = apiKeyRef.current.value;

      // Set the API key first
      setAPIKey(inputApiKey);

      try {
        // Now try to verify it
        await callOpenAI("Hello! Please verify this API key.");

        // Mark the key as verified if no exceptions occur
        setApiKeyVerified(true);

      } catch (error) {
        alert("Invalid API Key. Please try again.");
      }
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (nameRef.current && weightRef.current && heightRef.current && animalRef.current) {
      const name = nameRef.current.value;
      const weight = weightRef.current.value;
      const height = heightRef.current.value;
      const animal = animalRef.current.value;

      const initialPromptJSON = {
        'role': ' Hypothetical Fight Result Generator',
        'animal': animal,
        'your_weight': weight,
        'your_height': height,
        'rules': [
          `1. Write between 1 and 3 sentences.`,
          `2. You must come up with a definitive result.`
        ],
        'prompt': `How would you, weighing ${weight} and standing at ${height}, fare against a ${animal}?`
      };
      const initialPrompt = JSON.stringify(initialPromptJSON);

      //const initialPrompt = `Hypothetically, If I weighed ${weight} and measure ${height}, how would I fare in a fight against a ${animal}?`;

      /*const messages1 = [
        { "role": "system", "content": initialPrompt },
      ];*/

      setLoading(true);

      try {
        const firstResult = await callOpenAI(initialPrompt);
        setResponse(firstResult);

        // Based on the firstResult, construct a new prompt

        const storyPromptJSON = {
          'role': 'Fight Encounter Generator',
          'animal': animal,
          'human_name': name,
          'human_weight': weight,
          'human_height': height,
          'initial_result': firstResult,
          'rules': [
            `1. Use the initial result to write how the encounter would play out.`,
            `2. Make it entertaining and engaging.`,
            `3. The encounter should be no longer than a paragraph.`
          ],
          'prompt': `Write a short encounter of how the fight would play out in third person."`
        };
        const storyPrompt = JSON.stringify(storyPromptJSON);
        const storyResult = await callOpenAI(storyPrompt);
        // Assuming you want to show this story result, you might want to create another state variable like 'setStory'
        setStory(storyResult);

        const WinnerPromptJSON = {
          'role': 'Winner Selector',
          'animal': animal,
          'human_weight': weight,
          'human_height': height,
          'result': firstResult,
          'rules': [
            `1. Either print "You" or the Animal name, with no extra text/tokens for context.`,
          ],
          'prompt': `Based on the previous outcome, who won: You or the ${animal}? Remember, only output "You" or the name of the animal as your answer.`
        };
        const winnerPrompt = JSON.stringify(WinnerPromptJSON);

        //const winnerPrompt = `Considering the result: "${firstResult}", who would be the winner, the human or the ${animal}?`;

        /*const messages2 = [
          { "role": "system", "content": initialPrompt },
        ];*/

        const winnerResult = await callOpenAI(winnerPrompt);
        setWinner(winnerResult);

      } catch (error) {
        console.error("Error calling OpenAI:", error);
        setResponse("Error getting response.");
        setWinner(null);
      }

      setLoading(false);
    }
  }

  if (!apiKeyVerified) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="mb-4 text-xl font-bold">Enter Your API Key</h1>
        <form onSubmit={handleApiKeySubmit} className="w-full max-w-md">
          <div className="mt-4">
            <input ref={apiKeyRef} type="password" className="p-2 border rounded text-black w-full" placeholder="API Key..." />
          </div>
          <div className="text-center mt-6">
            <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center font-mono text-sm mb-8">
        <h1 className="mb-4 text-xl font-bold">Animal Fights</h1>
        <p>How do you fare against different creatures?</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-32 w-full flex justify-center">
          <div className="grid grid-cols-2 gap-20 lg:max-w-5xl">
            {/* Column 1 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-center">You</h2>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">Your Name</label>
                <input ref={nameRef} type="text" className="p-2 border rounded text-black" placeholder="Enter name..." />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">Your Weight</label>
                <input ref={weightRef} type="text" className="p-2 border rounded text-black" placeholder="Enter weight..." />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">Your Height</label>
                <input ref={heightRef} type="text" className="p-2 border rounded text-black" placeholder="Enter height..." />
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-center">Animal</h2>
              <div>
                <label className="block mb-2 text-sm font-medium">Animal</label>
                <input ref={animalRef} type="text" className="p-2 border rounded text-black" placeholder="Enter animal name..." />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
            Submit
          </button>

          {loading && (
            <div className="flex flex-grow justify-center items-center mt-4">
              <div className="spinner"></div>
            </div>
          )}

          {response && (
            <div className="mt-4 text-center">
              <h3 className="font-medium text-lg">Result</h3>
              <p>{response}</p>
            </div>
          )}
          {story && (
            <div className="mt-4 text-center">
              <h3 className="font-medium text-lg">Encounter</h3>
              <p>{story}</p>
            </div>
          )}
          {winner && (
            <div className="mt-4 text-center">
              <h3 className="font-medium text-lg">Winner</h3>
              <p>{winner}</p>
            </div>
          )}
        </div>

      </form>
    </main >
  )
}
