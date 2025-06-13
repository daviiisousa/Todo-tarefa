import { Toaster } from "react-hot-toast"
import { TodoCard } from "./components/todo/todoCard"
import { TodoForm } from "./components/todo/todoForm"

function App() {

  return (
    <main className="px-5 py-4 ">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="md:text-6xl text-5xl text-center text-purple-500 font-bold">Todo List</h1>
      <p className="my-4 text-zinc-500 text-2xl flex justify-center items-center gap-2 w-full flex-wrap">Organize suas
        <span className="text-purple-500 flex items-center">Tarefas <img src="/favicon.png" alt="logo" /> </span>
      </p>
      <TodoForm />
      <div className="border-2 border-purple-500 w-full my-4 rounded-lg"></div>
      <TodoCard />
    </main>
  )
}

export default App
