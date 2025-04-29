import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Todos } from "@/types/global";
import { deleteTodo, editTodo, getTodos, updateTodoConcluido } from "@/services/todoService";
import { Ban, Check, Pencil, Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";


export function TodoCard() {
    const [todos, setTodos] = useState<Todos[]>([]);
    const [editId, setEditId] = useState('');
    const [textoEditado, setTextoEditado] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTodos();
            setTodos(data);
        };

        fetchData();
    }, []);

    function handleEdit(id: string, descricao: string) {
        setEditId(id);
        setTextoEditado(descricao);
    }

    function cancelEdit() {
        setEditId("");
    }

    function savedEdit(id: string) {
        editTodo(id, textoEditado);
    }

    async function toggleConcluido(id: string, value: boolean | "indeterminate") {
        const isConcluido = value === true;

        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, concluido: value === true } : todo
            )
        );

        try {
            await updateTodoConcluido(id, isConcluido);
          } catch (error) {
            console.error("Erro ao atualizar concluído:", error);
            // Opcional: voltar o estado anterior se deu erro
          }
    }

    return (
        <section className="md:grid grid-cols-2 gap-3 lg:grid-cols-3">
            {todos.length > 0 ? todos.map(todo => (
                <Card className="my-4" key={todo.id}>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle className="text-2xl text-zinc-800">{todo.titulo}</CardTitle>
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
                                    <Check
                                        onClick={() => savedEdit(todo.id)}
                                        color="#00c951"
                                        className="cursor-pointer"
                                    />
                                    <Ban
                                        onClick={cancelEdit}
                                        color="#fb2c36"
                                        className="cursor-pointer"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="text-lg">{todo.descricao}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button
                            onClick={() => deleteTodo(todo.id)}
                            className="bg-purple-800 text-lg cursor-pointer"
                        >
                            Excluir <Trash />
                        </Button>
                        <Button
                            onClick={() => handleEdit(todo.id, todo.descricao)}
                            className="border-2 border-purple-500 text-purple-500 bg-transparent text-lg cursor-pointer flex items-center hover:text-white hover:border-purple-900"
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
