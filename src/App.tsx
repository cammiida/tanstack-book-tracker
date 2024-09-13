import TodosCounter from "./components/TodosCounter";
import { TodosList } from "./components/TodosList";

function App() {
  return (
    <>
      <div className="float-right p-8">
        <TodosCounter />
      </div>
      <div className=" w-2/3 max-w-5xl min-w-min h-screen mx-auto py-10">
        <TodosList />
      </div>
    </>
  );
}

export default App;
