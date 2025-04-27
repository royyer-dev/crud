// app/components/BookForm.tsx
"use client"; // Marcar como Client Component

import React, { useState } from "react"; // Import React y tipos necesarios

// Definimos un tipo para los datos del formulario (sin ID)
interface BookFormData {
  title: string;
  author: string;
}

// Definimos los tipos para las props del componente
interface BookFormProps {
  // onSubmit es una función que recibe BookFormData y no devuelve nada (o una promesa)
  onSubmit: (data: BookFormData) => void | Promise<void>;
  // initialData es opcional y usa el mismo tipo BookFormData
  initialData?: BookFormData;
}

// Definimos el componente usando React.FC (Functional Component) con sus props tipadas
const BookForm: React.FC<BookFormProps> = ({
  onSubmit,
  initialData = { title: "", author: "" },
}) => {
  // Tipamos el estado usando useState<string>
  const [title, setTitle] = useState<string>(initialData.title);
  const [author, setAuthor] = useState<string>(initialData.author);

  // Tipamos el evento del formulario con React.FormEvent<HTMLFormElement>
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !author) {
      alert("Por favor, ingresa título y autor.");
      return;
    }
    // Llamamos a onSubmit con los datos tipados { title, author }
    onSubmit({ title, author });

    if (!initialData.title && !initialData.author) {
      setTitle("");
      setAuthor("");
    }
  };

  // Tipamos los eventos de cambio de los inputs con React.ChangeEvent<HTMLInputElement>
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mb-6 p-4 border rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        {initialData.title ? "Editar Libro" : "Añadir Nuevo Libro"}
      </h2>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Título:
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange} // Usamos el handler tipado
          placeholder="Título del libro"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700"
        >
          Autor:
        </label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={handleAuthorChange} // Usamos el handler tipado
          placeholder="Autor del libro"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {initialData.title ? "Actualizar Libro" : "Añadir Libro"}
      </button>
    </form>
  );
};

export default BookForm;
