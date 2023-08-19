import Image from 'next/image'

export default function Home() {
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
                <input type="text" className="p-2 border rounded text-black" placeholder="Enter weight..." />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">Your Height</label>
                <input type="text" className="p-2 border rounded text-black" placeholder="Enter height..." />
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-center">Animal</h2>
              <div>
                <label className="block mb-2 text-sm font-medium">Animal</label>
                <input type="text" className="p-2 border rounded text-black" placeholder="Enter animal weight..." />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Submit</button>
        </div>
      </form>
    </main>
  )
}
