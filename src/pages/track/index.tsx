import { useEffect } from 'react'
import AllGoalsWithTasksByUser from '../../components/Goal/GoalList'
import GoalForm from '../../components/Goal/GoalForm'
import TaskForm from '../../components/Task/TaskForm'

import { trpc } from '../../utils/trpc';
import { useUser } from '@auth0/nextjs-auth0';

export default function Track() {
  // const [showConfigView, setShowConfigView] = useState(false)

  const utils = trpc.useContext();

  const { user } = useUser();
  const id = user?.sub || "defaultUser"
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])

  // console.log("User Goals: ", goalsQuery.data)
  // const goals = goalsQuery?.data

  useEffect(() => {
    for (const { id } of goalsQuery.data ?? []) {
      utils.prefetchQuery(['goals.byGoalId', { id }]);
    }
  }, [goalsQuery.data, utils]);

  if (goalsQuery?.status === 'loading') {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <AllGoalsWithTasksByUser />
      <GoalForm />
      <TaskForm />
    </div>
  );
}
