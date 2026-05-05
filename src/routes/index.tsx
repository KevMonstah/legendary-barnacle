import { createFileRoute, Link } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react';
import { fetchIdeas } from '#/api/ideas';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import IdeaCard from '#/components/IdeaCard';

const ideasQueryOptions = queryOptions({
  queryKey: ['ideas', {limit: 3}],
  queryFn: () => fetchIdeas(3),  // gotta make this ARROW cuz passing in
})

/*
export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div classNameName="p-8">
      <h1 classNameName="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p classNameName="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
*/

export const Route = createFileRoute('/')({ 
  component: HomePage,
  loader: ({ context }) => context.queryClient.ensureQueryData(ideasQueryOptions)
 })

function HomePage() {
  //return <>My HomePage</>

  //const { data } = useSuspenseQuery(ideasQueryOptions);
  //const ideas = [...data].sort(
  //  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  //console.log(ideas);
  //const latestIdeas = ideas.slice(0, 3);
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions);


  return (
    <div
      className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600"
    >
      <div className="flex flex-col items-start gap-4">
        <Lightbulb className="w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-gray-800">Welcome to IdeaDrop</h1>
        <p className="text-gray-600 max-w-xs">
          Share, explore, and build on the best startup ideas and side hustles.
        </p>
      </div>

      <section className="flex-1">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Latest Ideas</h2>
        <div className="space-y-6">
          {/* {latestIdeas.map(i => ( */}
          {ideas.map(i => (
            <IdeaCard key={i._id} idea={i} button={false} />
/*             <li key={i.id} className="border border-gray-300 rounded-lg shadow p-4 bg-white">
              <h3 className="text-lg font-bold text-gray-900">{i.title}</h3>
              <p className="text-gray-600 mb-2">{i.summary}</p>
              <Link to="/ideas/$ideaId" params={{ideaId: i.id.toString()}} className="text-blue-600 hover:underline"> {' '}Read more →{' '} </Link>
            </li>
 */          ))}
        </div>

        <div className="mt-6">
          <a
            href="/ideas"
            className="w-full text-center inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            View All Ideas
          </a>
        </div>
      </section>
    </div>
  );
}