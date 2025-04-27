// app/api/books/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"; // Import NextResponse para las respuestas

const prisma = new PrismaClient();

// Función para manejar solicitudes GET
export async function GET(request) {
  try {
    const books = await prisma.book.findMany();
    // En App Router, usamos NextResponse.json() para enviar respuestas JSON
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Error al obtener los libros" },
      { status: 500 }
    );
  }
}

// Función para manejar solicitudes POST
export async function POST(request) {
  try {
    // Obtenemos el cuerpo de la solicitud usando request.json()
    const data = await request.json();
    const { title, author } = data;

    // Validación básica
    if (!title || !author) {
      return NextResponse.json(
        { message: "Título y autor son requeridos" },
        { status: 400 } // Bad Request
      );
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
      },
    });
    // Devolvemos el nuevo libro con estado 201 Created
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { message: "Error al crear el libro" },
      { status: 500 }
    );
  }
}

// Nota: No necesitas un 'else' para métodos no permitidos.
// Next.js App Router maneja esto automáticamente. Si defines GET y POST,
// una solicitud PUT o DELETE a esta ruta recibirá un 405 Method Not Allowed.
