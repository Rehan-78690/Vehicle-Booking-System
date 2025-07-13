export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">✅ Tailwind CSS is Working!</h1>
        <p className="text-gray-700 text-lg">
          You’re now ready to start building with Tailwind and Next.js App Router.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
          Test Button
        </button>
      </div>
    </main>
  );
}
