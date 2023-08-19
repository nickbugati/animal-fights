"use client"
import Image from 'next/image'
import React, { useState, useRef } from 'react';
import { callOpenAI } from '@/utils/openai';


export default function Home() {

  const [response, setResponse] = useState<string | null>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const animalRef = useRef<HTMLInputElement>(null);
  // ... other refs for each input

  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);


  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (weightRef.current && heightRef.current && animalRef.current) {
      const weight = weightRef.current.value;
      const height = heightRef.current.value;
      const animal = animalRef.current.value;

      console.log('Weight:', weight);
      console.log('Height:', height);
      console.log('Animal:', animal);


      /*const initialPromptJSON = {
        'role': 'Result Generator',
        'animal': animal,
        'human_weight': weight,
        'human_height': height,
        'rules': [
          `1. Determine how a person weighing ${weight} and having a height of ${height} would fare against a ${animal}`,
        ]
      };
      const initialPrompt = JSON.stringify(initialPromptJSON);*/

      const initialPrompt = `Hypothetically, If I weighed ${weight} and measure ${height}, how would I fare in a fight against a ${animal}?`;

      /*const messages1 = [
        { "role": "system", "content": initialPrompt },
      ];*/

      setLoading(true);

      try {
        const firstResult = await callOpenAI(initialPrompt, "gpt-4-0613");
        setResponse(firstResult);

        // Based on the firstResult, construct a new prompt
        const winnerPrompt = `Considering the result: "${firstResult}", who would be the winner, the human or the ${animal}?`;

        /*const messages2 = [
          { "role": "system", "content": initialPrompt },
        ];*/

        const winnerResult = await callOpenAI(winnerPrompt, "gpt-4-0613");
        setWinner(winnerResult);

      } catch (error) {
        console.error("Error calling OpenAI:", error);
        setResponse("Error getting response.");
        setWinner(null);
      }

      setLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center font-mono text-sm mb-8">
        <h1 className="mb-4 text-xl font-bold">Animal Fights</h1>
        <p>How do you fare against different creatures?</p>
      </div>

      <form className="w-full">
        <div className="mb-32 w-full flex justify-center">
          <div className="grid grid-cols-2 gap-20 lg:max-w-5xl">
            {/* Column 1 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-center">You</h2>
              <div>
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
                <input ref={animalRef} type="text" className="p-2 border rounded text-black" placeholder="Enter animal weight..." />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={handleSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
            Submit
          </button>
          {response && (
            <div className="mt-4 text-center">
              <h3 className="font-medium text-lg">Result</h3>
              <p>{response}</p>
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
    </main>
  )
}
