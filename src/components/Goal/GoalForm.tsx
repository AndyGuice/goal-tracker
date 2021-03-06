import { useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import { trpc } from '~/utils/trpc';
import Router from 'next/router';
import toast from 'react-hot-toast';

export default function GoalForm() {
  const { user } = useUser();
  const { sub } = user || { sub: '' };
  
  const addGoal = trpc.useMutation('goals.add', {
    async onSuccess() {
      toast.success('Goal created successfully')
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const input = data;
    
    input.active = true;
    input.createdBy = sub;

    try {
      await addGoal.mutateAsync(input);
      reset();
      Router.push("/")
    } catch {
      (error: any) => console.log(error);
    }
  };

  return (
    <div className="p-2 m-1 text-center rounded-md">
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Add Goal
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <div className="mt-2">
            <input
              className="block w-full text-black form-input"
              {...register("title")}
              placeholder="Goal Title"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="mt-2">
            <input
              className="block w-full text-black form-input"
              {...register("description")}
              placeholder="Goal Description"
            />
          </div>
        </div>       
        <input className="m-1 mt-4 text-white bg-purple-600 btn" type="submit" />
        {addGoal.error && (
          toast.error(addGoal.error.message)
        )}
      </form>
    </div>
  );
}
