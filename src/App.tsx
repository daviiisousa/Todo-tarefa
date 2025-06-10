import { Toaster } from "react-hot-toast"
import { TodoCard } from "./components/todo/todoCard"


function App() {

  return (
    <main className="px-5 py-4 ">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <TodoCard />
    </main>
  )
}

export default App
