import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Todos } from "@/types/global";
import { deleteTodo, editTodo, getTodos, updateTodoConcluido } from "@/services/todoService";
import { Ban, Check, Pencil, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TodoForm } from "./todoForm";
import { useTodoStore } from "@/store/todo";
import toast from "react-hot-toast";
import { Loading } from "../common/loading";
import clsx from "clsx";

export function TodoCard() {
    const [todos, setTodos] = useState<Todos[]>([]);
    const [editId, setEditId] = useState<string | undefined>('');
    const [textoEditado, setTextoEditado] = useState('');
    const [loading, setLoading] = useState(true)
    const [isSubminting, setIsSubminting] = useState(false)

    //pegando as tarefas e passando para o array
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTodos();
                setTodos(data);
            } catch (error) {
                toast.error('erro ao buscar tarefa')
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    //essa funçao e responsavel por mandar o id e desc quando ativar o modo de edicao
    function handleEdit(id: string | undefined, descricao: string) {
        if (!descricao) {
            toast.error("prencha o campo de descricao")
            return
        }
        setEditId(id);
        setTextoEditado(descricao);
    }

    async function savedEdit(id: string | undefined) {
        setIsSubminting(true)
        try {
            const sucesso = await editTodo(id, textoEditado);

            if (!textoEditado.trim()) {
                toast.error("Descrição não pode estar vazia");
                return;
            }

            if (sucesso) {
                setTodos(prev =>
                    prev.map(todo =>
                        todo.id === id ? { ...todo, descricao: textoEditado } : todo
                    )
                );
                //desativa o modo de edicao
                setEditId("");
            }
        } catch (error) {
            console.error('erro ao atualizar tarefa')
        } finally {
            setIsSubminting(false)
        }

    }

    function handleDelete(id: string | undefined) {
        setIsSubminting(true)
        try {
            deleteTodo(id)
            setTodos(prev => prev.filter((todo) => todo.id !== id))
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubminting(false)
        }

    }

    async function toggleConcluido(id: string | undefined, value: boolean | "indeterminate") {
        // verifica se o value da tarefa foi marcada como concluida 
        const isConcluido = value === true;

        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, concluido: value === true } : todo
            )
        );

        try {
            // faz a req para o back passando o valor do conluido
            await updateTodoConcluido(id, isConcluido);
        } catch (error) {
            console.error("Erro ao atualizar concluído:", error);
        }
    }
    const { todo } = useTodoStore()


    return (
        <div>
            <h1 className="md:text-6xl text-5xl text-center text-purple-500 font-bold">Todo List</h1>
            <p className="my-4 text-zinc-500 text-2xl flex justify-center items-center gap-2 w-full flex-wrap">Organize suas
                <span className="text-purple-500 flex items-center">Tarefas <img src="/favicon.png" alt="logo" /> </span>
            </p>
            <TodoForm setIsSubminting={setIsSubminting} setTodos={setTodos} />
            <p>Voce tem {todo.length} tarefas</p>
            <div className="border-2 border-purple-500 w-full my-4 rounded-lg"></div>
            <section className="md:grid grid-cols-2 gap-3 lg:grid-cols-3 ">
                {loading ? (
                    <Loading />
                ) : todos && todos.length > 0 ? todos.map(todo => (
                    <Card className="my-4" key={todo.id}>
                        <CardHeader className="flex justify-between items-center w-full flex-wrap">
                            <CardTitle className="text-2xl text-zinc-800 break-words w-full md:w-fit">{todo.titulo}</CardTitle>
                            <Label className="cursor-pointer">
                                <Checkbox
                                    checked={todo.concluido}
                                    onCheckedChange={(value) => toggleConcluido(todo.id, value)}
                                />
                                Concluido
                            </Label>
                        </CardHeader>
                        <CardContent>
                            {todo.id === editId ? (
                                <div>
                                    <Textarea
                                        autoFocus
                                        value={textoEditado}
                                        onChange={({ target }) => setTextoEditado(target.value)}
                                    />
                                    <div className="flex gap-5 items-center mt-4">
                                        <button
                                            disabled={isSubminting}
                                            className={
                                                clsx("cursor-pointer",
                                                    isSubminting ? "text-zinc-400" : "text-[#00c951]"
                                                )}>
                                            <Check onClick={() => savedEdit(todo.id)} />
                                        </button>
                                        <Ban
                                            onClick={() => setEditId("")}
                                            color="#fb2c36"
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-lg break-words">{todo.descricao}</p>
                            )}
                        </CardContent>
                        <CardFooter className="flex items-center flex-wrap gap-2">
                            <AlertDialog>
                                <AlertDialogTrigger disabled={isSubminting} className="bg-purple-800 text-lg cursor-pointer flex items-center justify-center rounded-md text-white py-1 gap-1 px-2 w-full sm:w-fit">
                                    Excluir <Trash size={16} />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Tem certeza que vc quer deletar essa tarefa?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Essa ação era eliminar essa tarefas da sua lista
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(todo.id)}>Continuar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button
                                disabled={isSubminting}
                                onClick={() => handleEdit(todo.id, todo.descricao)}
                                className="border-2 border-purple-500 text-purple-500 bg-transparent text-lg cursor-pointer flex items-center hover:text-white hover:border-purple-900 w-full sm:w-fit"
                            >
                                Editar <Pencil />
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <h1 className="text-4xl text-purple-500 font-bold text-center col-span-3">
                        Nenhuma tarefa pra fazer
                    </h1>
                )}
            </section>
        </div>
    );
}
