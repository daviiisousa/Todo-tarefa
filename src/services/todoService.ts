import api from "@/api/axios"

import { FormEvent } from "react"
import toast from "react-hot-toast"



export async function getTodos() {
    try {
        const response = await api.get("/todos")
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function postTodos(event: FormEvent, data: { titulo: string, descricao: string }) {
    event.preventDefault()

    try {
        if (!data.titulo || !data.descricao) {
            return toast.error("É necessario preencher os campos de forma correta")
        }
        const response = await api.post("/todos", data)

        return response.data
    } catch (error) {
        if (error) toast.error("erro ao enviar tarefa: ", error)
        console.error(error)
    }
}

export async function deleteTodo(id: string | undefined) {
    try {
        const response = await api.delete(`/todos/${id}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function editTodo(id: string | undefined, descricao: string) {
    try {
        if (!descricao) {
            return toast.error("A descricao e necessaria")
        }
        const response = await api.patch(`/todos/${id}`, { descricao })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export async function updateTodoConcluido(id: string | undefined, concluido: boolean) {
    await api.patch(`/todos/${id}`, { concluido });
}