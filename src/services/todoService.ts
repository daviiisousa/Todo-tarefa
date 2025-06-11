import api from "@/api/axios"

export async function getTodos() {
    try {
        const response = await api.get("/todos")
        return response.data
    } catch (error) {
        console.error("erro ao pegar tarefa: ", error)
    }
}

export async function postTodos(data: { titulo: string, descricao: string }) {
    try {
        const response = await api.post("/todos", data)
        return response.data
    } catch (error) {
        console.error("erro ao enviar tarefa: ", error)
    }
}

export async function deleteTodo(id: string | undefined) {
    try {
        const response = await api.delete(`/todos/${id}`)
        return response.data
    } catch (error) {
        console.error("erro ao deltar tarefa: ", error)
    }
}

export async function editTodo(id: string | undefined, descricao: string) {
    try {
        const response = await api.patch(`/todos/${id}/descricao`, { descricao })
        return response.data
    } catch (error) {
        console.error("erro ao editar descricao tarefa: ", error)
    }
}

export async function updateTodoConcluido(id: string | undefined, concluido: boolean) {
    try {
        const response = await api.patch(`/todos/${id}/concluido`, { concluido });
        return response.data
    } catch (error) {
        console.error("erro ao editar concluido tarefa: ", error)
    }
}