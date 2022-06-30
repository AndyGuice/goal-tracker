import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';

export default function TaskForm() {
  const { user } = useUser();
  const { sub } = user || { sub: '' };

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    cadence: "daily",
    quantity: 1,
  })

  const handleChange = (e: any) => {
    setTaskDetails({
      ...taskDetails,
      [e.target.name]: e.target.value,
    })
  }

  console.log('Details: ', taskDetails)
  
  const utils = trpc.useContext();
  const addGoal = trpc.useMutation('task.add', {
    async onSuccess() {
      await utils.invalidateQueries(['task.all']);
    },
  });

  const { register, handleSubmit, reset } = useForm();

  const [ showOptions, setShowOptions ] = useState(false);
  function toggleShowOptions(e: any) {
    e.preventDefault();
    setShowOptions(!showOptions)
  }

  const onSubmit = async (data: any) => {
    console.log("Data: ", data)

    const input = data;
    
    input.active = true;
    input.createdBy = sub;

    // try {
    //   await addGoal.mutateAsync(input);
    //   reset();
    // } catch {
    //   (error: any) => console.log(error);
    // }
  };

  return (
    <div className="p-2 text-center bg-gray-200">
      <div className="mb-1 text-xl bg-gray-300 ">
        Add Tasks
      </div>
      {/* <form onSubmit={handleSubmit}> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mt-4">
            <span>Title</span>
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Title"
                {...register("title")}
              />
            </div>
          </div>
          <div className="mt-4">
            <span>Description</span>
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Description"
                {...register("description")}
              />
            </div>
          </div>
          <div className="mt-4 text-xs text-end">
            <button className="p-1 text-white bg-gray-600 w-36" onClick={(e: any) => toggleShowOptions(e)}>
              {showOptions ? 'Hide More Options' : 'Show More Options'}
            </button>
          </div>
          {showOptions && (
            <>
              <label className="block mt-4">
                <span>Cadence</span>
                <select
                  className="block w-full form-select"
                  {...register("cadence")}
                  defaultValue="daily"
                >
                  <option value="daily" id="daily">Daily</option>
                  <option value="weekly" id="weekly">Weekly</option>
                </select>
              </label>
              <label className="block mt-4">
                <span>Quantity</span>
                <select
                  className="block w-full form-select"
                  {...register("quantity")}
                  defaultValue="1"
                >
                  <option value="1" id="1">1</option>
                  <option value="2" id="2">2</option>
                  <option value="3" id="3">3</option>
                </select>
              </label>
            </>
          )}
        </div>
        <input className="m-1 mt-4 text-white bg-gray-600 btn" type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </div>
  );
}
