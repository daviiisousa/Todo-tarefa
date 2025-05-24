import { Todos } from "@/types/global"
import {create} from "zustand"

type todoStore = {
    todo: Todos[],
    addTodo:(titulo: string, descricao: string) => void
}

export const useTodoStore = create<todoStore>((set) => ({
    todo: [],
    addTodo: (titulo, descricao) => set((state) => ({
        todo: [...state.todo, {titulo: titulo, descricao: descricao}]
    }))
}))