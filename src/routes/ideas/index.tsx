import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import IdeaCard from '#/components/IdeaCard';


/*  moved to api/ideas
import type { Idea } from '@/types';
import api from '@/lib/axios';

const fetchIdeas = async (): Promise<Idea[]> => {
  const res = await api.get('/ideas');
  return res.data;
};
*/
import { fetchIdeas } from '@/api/ideas';

//const ideasQueryOptions = queryOptions({
//    queryKey: ['ideas'], //, {limit: 3}],
    //queryFn: () => fetchIdeas(),
//    queryFn: fetchIdeas,  //3 gotta make this ARROW cuz passing in
//  });

/*
Calling a plain object as a function — queryOptions(...) returns an object, not a function. So ideasQueryOptions() with parentheses threw an error. Once you needed to pass an argument (limit), the fix was to wrap it in an arrow function to make it a proper factory: const ideasQueryOptions = (limit?) => queryOptions(...).
*/
const ideasQueryOptions = (limit?: number) => queryOptions({
  queryKey: ['ideas', { limit }],
  queryFn: () => fetchIdeas(limit),
});

export const Route = createFileRoute('/ideas/')({
 head: () => ({
    meta: [
      {
        title: 'IdeaDrop - Browse Ideas',
      },
    ],
  }),
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasQueryOptions());
  },
});

/*
export const Route = createFileRoute('/ideas/')({
 head: () => ({
    meta: [
      {
        title: 'IdeaDrop - Browse Ideas',
      },
    ],
  }),
  component: IdeasPage,
})
*/

function IdeasPage() {
  //const { data } = useSuspenseQuery(ideasQueryOptions());
  //const ideas = [...data].sort(
  //  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());  // spread and sort by date
  //console.log(data); // shows up 
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions());
  
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ideas</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {ideas.map((idea) => (
          <IdeaCard key={idea._id} idea={idea}/>
/*           <li
            key={idea.id}
            className='border border-gray-300 p-4 rounded shadow bg-white flex flex-col justify-between'
          >
            <div>
              <h2 className='text-lg font-semibold'>{idea.title}</h2>
              <p className='text-gray-700 mt-2'>{idea.summary}</p>
            </div>

            <Link
              to='/ideas/$ideaId'
              params={{ ideaId: idea.id.toString() }}
              className='text-center mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
            >
              View Idea
            </Link>
          </li>
 */        ))}
      </div>
    </div>
  );
}
