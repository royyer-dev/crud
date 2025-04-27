// app/page.tsx
"use client"; // Necesario para hooks y eventos

import React, { useEffect, useState } from "react"; // Import React
import BookForm from "./components/BookForm"; // Importa el componente TSX

// Definimos la interfaz para un objeto Libro (tal como viene de la API/Prisma)
interface Book {
  id: number;
  title: string;
  author: string;
}

// Definimos un tipo para los datos que enviamos al crear (sin ID)
type BookFormData = Omit<Book, "id">;

export default function Home() {
  // Tipamos los estados
  const [books, setBooks] = useState<Book[]>([]); // Array de objetos Book
  const [isLoading, setIsLoading] = useState<boolean>(true); // Booleano
  const [error, setError] = useState<string | null>(null); // String o null

  // Función para obtener los libros (tipamos la respuesta esperada)
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/books");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Esperamos un array de Book de la API
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (e: any) {
      // Capturamos el error (puede ser de cualquier tipo)
      console.error("Failed to fetch books:", e);
      setError(e.message || "No se pudieron cargar los libros.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Función para añadir libro (tipamos el parámetro bookData)
  const handleAddBook = async (bookData: BookFormData) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        // Intentamos leer el mensaje de error del cuerpo si existe
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message || `HTTP error! status: ${response.status}`
        );
      }
      // Esperamos que la API devuelva el libro creado (tipo Book)
      // const newBook: Book = await response.json(); // Opcional: podríamos usar el newBook si quisiéramos
      fetchBooks(); // Recargamos la lista
    } catch (e: any) {
      console.error("Failed to add book:", e);
      alert(`Error al añadir el libro: ${e.message || "Error desconocido"}`);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gestor de Libros (TypeScript)
      </h1>

      {/* Pasamos handleAddBook al componente BookForm */}
      <BookForm onSubmit={handleAddBook} />

      <hr className="my-6" />

      <h2 className="text-2xl font-semibold mb-4">Lista de Libros</h2>

      {isLoading && <p>Cargando libros...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <ul className="list-disc pl-5 space-y-2">
          {books.length > 0 ? (
            // book es inferido como tipo Book aquí gracias al tipado de useState
            books.map((book) => (
              <li
                key={book.id}
                className="bg-gray-800 text-gray-100 p-3 rounded shadow-sm"
              >
                <span className="font-medium">{book.title}</span> por{" "}
                {book.author}
                {/* Futuro: Botones Editar/Eliminar */}
              </li>
            ))
          ) : (
            <p>No hay libros registrados.</p>
          )}
        </ul>
      )}
    </main>
  );
}
