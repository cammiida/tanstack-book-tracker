import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../utils/queries";

function TodosCounter() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    select: (data) => {
      const numUnfinishedTodos = data.filter((todo) => !todo.completed).length;
      const numFinishedTodos = data.filter((todo) => todo.completed).length;

      return { numUnfinishedTodos, numFinishedTodos };
    },
  });

  if (isLoading && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>An error occurred</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <div># Unfinished: {data?.numUnfinishedTodos}</div>
      <div># Finished: {data?.numFinishedTodos}</div>
    </div>
  );
}

export default TodosCounter;
