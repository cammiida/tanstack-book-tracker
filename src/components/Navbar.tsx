import { AreaChartIcon, InboxIcon, LeaveIcon } from "@navikt/aksel-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { todoQueries } from "../utils/todoQueries";

export function Navbar() {
  const query = useQuery({
    ...todoQueries.list(),
    select: (data) => data.filter((todo) => !todo.completed).length,
  });

  const iconSize = "1.5rem";

  return (
    <div className="relative flex h-screen max-w-[20rem] flex-col bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
      <div className="p-4 mb-2">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Tanstack Query Todos
        </h5>
      </div>
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <Link to="/">
          <button className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
            <div className="grid mr-4 place-items-center">
              <AreaChartIcon title="a11y-title" fontSize={iconSize} />
            </div>
            Dashboard
          </button>
        </Link>
        <Link to="/todos">
          <button className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
            <div className="grid mr-4 place-items-center">
              <InboxIcon title="a11y-title" fontSize={iconSize} />
            </div>
            Todos
            <div className="grid ml-auto place-items-center justify-self-end">
              <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                <span className="">{query.data}</span>
              </div>
            </div>
          </button>
        </Link>
        <Link to="/logout">
          <button className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
            <div className="grid mr-4 place-items-center">
              <LeaveIcon title="a11y-title" fontSize={iconSize} />
            </div>
            Log Out
          </button>
        </Link>
      </nav>
    </div>
  );
}
