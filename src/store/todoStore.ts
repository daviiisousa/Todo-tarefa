// src/store/todoStore.ts
import { create } from "zustand";
import { Todos } from "@/types/global";
import { getTodos, editTodo, deleteTodo, updateTodoConcluido, postTodos } from "@/services/todoService";
import toast from "react-hot-toast";

interface TodoState {
    todos: Todos[];
    isLoading: boolean;
    isDesabled: string | null;
    fetchTodos: () => Promise<void>;
    updateDescricao: (id: string, descricao: string) => Promise<void>;
    removeTodo: (id: string) => Promise<void>;
    toggleConcluido: (id: string, value: boolean) => Promise<void>;
    addTodo: (data: { titulo: string, descricao: string }) => Promise<void>
}

export const useTodoStore = create<TodoState>((set) => ({
    //array de tarefas
    todos: [],
    //desabilita os botoes denpendendo da req
    isDesabled: null,
    //muda os estados de acorda com a req, comeca como false pq na teoria a req n e feita assim que entramos no site
    isLoading: false,

    //funçao que busca as tarefas na api e alimenta o array
    fetchTodos: async () => {
        //como aqui uma req e feita entao o loading vai para true
        set({ isLoading: true });
        try {
            const data = await getTodos();
            set({ todos: data })
        } catch (error) {
            console.error(error)
            toast.error("erro ao buscar as tarefas")
        } finally {
            //aqui a req na toria deu certo entao vai para false
            set({ isLoading: false });
        }
    },

    //funçao que atualiza uma tarefa, recebe um id para saber qual tarefa editar e a descricao alterada
    updateDescricao: async (id, descricao) => {
        set({ isDesabled: id })
        try {
            //vai na api atualiza a descricao
            const result = await editTodo(id, descricao);
            //atualiza o array de tarefas com a tarefa editada fazendo uma rerenderizaçao
            if (result) {
                set((state) => ({
                    todos: state.todos.map((todo) =>
                        todo.id === id ? { ...todo, descricao } : todo
                    ),
                }));
            }
        } catch (error) {
            console.error(error)
            toast.error("erro ao editar a tarefa")
        } finally {
            set({ isDesabled: null })
        }
    },

    //remove uma tarefa
    removeTodo: async (id) => {
        set({ isDesabled: id })
        try {
            //vai na api remover uma tarefa
            const result = await deleteTodo(id);
            //atualiza o array sem a tarefa deletada 
            if (result) {
                set((state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id),
                }));
            }
        } catch (error) {
            console.error(error)
            toast.error('erro ao deletar tarefa')
        } finally {
            set({ isDesabled: null })
        }
    },

    //coloca uma tarefa como concluida ou nao 
    toggleConcluido: async (id, value) => {
        //vai na api alterar o concluido da tarefa
        await updateTodoConcluido(id, value);
        //atualiza o estado da tarefa como atualizado ou nao
        set((state) => ({
            todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, concluido: value } : todo
            ),
        }));
    },
    //adiciona uma tarefa nova 
    addTodo: async (data) => {

        const novoTodo = await postTodos(data); // deve retornar a tarefa criada
        //atauliza o array com a tarefa nova
        set((state) => ({
            todos: [...state.todos, novoTodo]
        }));

    }
}));
