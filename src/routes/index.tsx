export function meta() {
  return [
    { title: 'Yt Music Skip Heard' },
    {
      name: 'description',
      content:
        "It automatically adjusts the playlist so you don't hear the songs you've heard on YouTube Music within 2 hours."
    }
  ];
}

export default function Home() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <article className="space-y-6 px-4">
        <h2 className="text-2xl font-bold">
          Automatically skip songs you've heard in YouTube Music.
        </h2>
        <p className="text-gray-500">Do not do anything while adjusting the playlist.</p>
      </article>
    </main>
  );
}
