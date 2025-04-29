import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { postTodos } from "@/services/todoService";

export function TodoForm(){
    const [newTodo, setNewTodo] = useState({
        titulo: '', 
        descricao: ''
    })


    function handleChange( event : ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target
        setNewTodo({ ...newTodo, [id]: value })
    }

   
    return(
        <form className="md:grid grid-cols-3 gap-3 items-center" 
            onSubmit={(e) => postTodos(e,newTodo)}>
            <div className="mb-4">
            <Label className="text-2xl text-zinc-700" htmlFor="titulo">Titulo:</Label>
            <Input
                type="text"
                id="titulo"
                name="titulo" 
                value={newTodo.titulo}
                placeholder="Titulo da sua Task"
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-purple-500 !shadow-hyper "/>
            </div>
            <div className="mb-4">
            <Label className="text-2xl text-zinc-700" htmlFor="descricao">Descrição:</Label>
            <Input
                type="text"
                id="descricao"
                name="descricao" 
                value={newTodo.descricao}
                placeholder="Descrição da sua Task"
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-purple-500 !shadow-hyper"/>
            </div>
            <Button 
                className="bg-purple-500 text-lg w-full my-4 text-white shadow-hyper hover:bg-transparent hover:border-2 hover:border-purple-500 rounded-lg hover:text-purple-500 cursor-pointer md:mt-8">
                Enviar
            </Button>
        </form>
    )
}