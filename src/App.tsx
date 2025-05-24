import { Toaster } from "react-hot-toast"
import { TodoCard } from "./components/todo/todoCard"
import { TodoForm } from "./components/todo/todoForm"
import { useTodoStore } from "./store/todo"

function App() {
  const {todo} = useTodoStore()

  return (
    <main className="px-5 py-4 ">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <h1 className="md:text-6xl text-5xl text-center text-purple-500 font-bold">Todo List</h1>
      <p className="my-4 text-zinc-500 text-2xl flex justify-center items-center gap-2">Organize suas 
        <span className="text-purple-500 flex items-center">Tarefeas <img src="/favicon.png" alt="" /> </span>
      </p>
      <TodoForm />
      <p>Voce tem {todo.length} tarefas</p>
      <div className="border-2 border-purple-500 w-full my-4 rounded-lg"></div>
      <TodoCard /> 
    </main>
  )
}

export default App
