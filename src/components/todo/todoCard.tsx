import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Ban, Check, Pencil, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTodoStore } from "@/store/todoStore";
import toast from "react-hot-toast";
import { Loading } from "../common/loading";
import clsx from "clsx";

export function TodoCard() {
    //pegando as funcoes do store de todo
    const { fetchTodos, todos, updateDescricao, removeTodo, toggleConcluido, isLoading, isDesabled } = useTodoStore()

    const [editId, setEditId] = useState<string | undefined>('');
    const [textoEditado, setTextoEditado] = useState('');

    //pegando as tarefas e passando para o array
    useEffect(() => {
        fetchTodos()
    }, []);

    //essa funçao e responsavel por mandar o id e desc quando ativar o modo de edicao
    function handleEdit(id: string | undefined, descricao: string) {
        setEditId(id);
        setTextoEditado(descricao);
    }

    async function savedEdit(id: string | undefined) {
        if (!id) return;
        if (!textoEditado) {
            toast.error("prencha o campo de descricao")
            return
        }
        await updateDescricao(id, textoEditado);
        setEditId(""); // sair do modo edição
    }

    function handleDelete(id: string | undefined) {
        if (!id) return;
        removeTodo(id);
    }

    async function handleToggleConcluido(id: string | undefined, value: boolean | "indeterminate") {
        if (!id) return;
        await toggleConcluido(id, value === true);
    }

    return (
        <section className="md:grid grid-cols-2 gap-3 lg:grid-cols-3 ">
            {isLoading ? (
                <Loading />
            ) : todos && todos.length > 0 ? todos.map(todo => (
                <Card className="my-4" key={todo.id}>
                    <CardHeader className="flex justify-between items-center w-full flex-wrap">
                        <CardTitle className="text-2xl text-zinc-800 break-words w-full md:w-fit">{todo.titulo}</CardTitle>
                        <Label className="cursor-pointer">
                            <Checkbox
                                checked={todo.concluido}
                                onCheckedChange={(value) => handleToggleConcluido(todo.id, value)}
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
                                        disabled={isDesabled === todo.id}
                                        className={
                                            clsx("cursor-pointer",
                                                isDesabled === todo.id ? "text-zinc-400" : "text-[#00c951]"
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
                            <AlertDialogTrigger disabled={isDesabled === todo.id}
                                className={
                                    clsx("bg-purple-800 text-lg cursor-pointer flex items-center justify-center rounded-md text-white py-1 gap-1 px-2 w-full sm:w-fit",
                                        isDesabled === todo.id && "bg-zinc-400"
                                    )}
                            >
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
                            disabled={isDesabled === todo.id}
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
    );
}
