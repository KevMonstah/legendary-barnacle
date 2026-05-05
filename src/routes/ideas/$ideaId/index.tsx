import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
} from '@tanstack/react-query';
import { fetchIdea, deleteIdea } from '@/api/ideas';
import { useAuth } from '@/context/AuthContext';

// use suspense allows you to skip the isLoading, is Error, and a few others 

/*
const fetchIdea = async (ideaId: string): Promise<Idea> => {
  //const res = await fetch(`http://localhost:8000/ideas/${ideaId}`);
  const res = await fetch(`/api/ideas/${ideaId}`);

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};
*/

/*
import type { Idea } from '@/types';
import api from '@/lib/axios';

// using axios
const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const res = await api.get(`/ideas/${ideaId}`);
  return res.data;
};
*/

const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: IdeaDetailsPage,
  //loader: async ({ params  }) => {
  //  return fetchIdea(params.ideaId);
  //},

  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

// works, gives you what loader returns
//function IdeaDetailsPage() {
//  const idea = Route.useLoaderData();
//  //return <div>Hello {name}!</div>
//  return <div>Idea {idea.title}</div>;
//}

// better, uses suspense
function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const { user } = useAuth();

  const navigate = useNavigate();

  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(ideaId),  // needs to be arrow cuz something passed into it
    onSuccess: () => {
      navigate({ to: '/ideas' });
    },
  });

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this idea?'
    );
    if (confirmDelete) {
      await deleteMutate();
    }
  };

  return (
    <div className='p-4'>
      <Link to='/ideas' className='text-blue-500 underline block mb-4'>
        Back to Ideas
      </Link>
      <h2 className='text-2xl font-bold'>{idea.title}</h2>
      <p className='mt-2'>{idea.description}</p>
      {
        user && user.id === idea.user && (
          <>
            {/* Edit link */}
            <Link
              to='/ideas/$ideaId/edit'
              params={{ ideaId }}
              className='inline-block text-sm bg-yellow-500 hover:bg-yellow-600 text-white mt-4 mr-2 px-4 py-2 rounded transition'
            >
              Edit
            </Link>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              disabled={isPending}
              className='text-sm bg-red-600 hover:bg-red-700 text-white mt-4 px-4 py-2 rounded transition disabled:opacity-50'
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )
      }
    </div>
  );
}