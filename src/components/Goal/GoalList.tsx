import { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import Link from 'next/link';

export function AllGoalsWithTasks() {
  const goalsQuery = trpc.useQuery(['goals.all']);
  const utils = trpc.useContext();

  const goals = goalsQuery?.data

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div className="p-1">
      {goalsQuery.status === 'loading' && '(loading)'}
      {goals?.map((goal) => (
        <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
          <h3 className="p-2 text-white bg-purple-600 border-2 rounded-md">
            Goal: {goal.title}
          </h3>
          {goal?.tasks.map((task) => (
            <div key={task.id} className="p-1 ml-2 text-xs bg-gray-200">
              Task {task.id}
              <div className="ml-4 text-xs">
                <div>Title: {task.title}</div>
                <div>Description: {task.description}</div>
                <div>Cadence: {task.cadence}</div>
                <div>Quantity: {task.quantity}</div>
              </div>
            </div>
          ))}
          <Link href={`/goal/${goal.id}`}>
            <div className="p-1 text-xs text-center text-purple-800">
              View more
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

export function AllGoals() {
  const goalsQuery = trpc.useQuery(['goals.all']);
  const utils = trpc.useContext();

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  return (
    <div className="p-1">
      {goalsQuery.status === 'loading' && '(loading)'}
      {goalsQuery.data?.map((goal) => (
        <article className="p-1 mt-1 border-2 border-purple-200 rounded-md shadow-md" key={goal.id}>
        <h3 className="p-2 text-white bg-purple-600 border-2 rounded-md">
          Goal: {goal.title}
        </h3>
        </article>
      ))}
    </div>
  );
}

