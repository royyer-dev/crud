// app/api/books/[id]/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Función para manejar solicitudes PUT (Actualizar)
export async function PUT(request, { params }) {
  // El segundo argumento { params } contiene los parámetros de la ruta dinámica
  const { id } = params; // Extraemos el id de la URL
  const bookId = parseInt(id); // Convertimos el id de String a Int

  // Verificamos si la conversión fue exitosa (si el ID no era un número)
  if (isNaN(bookId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    // Obtenemos los datos para actualizar del cuerpo de la solicitud
    const data = await request.json();
    const { title, author } = data;

    // Validación básica (opcional pero recomendada)
    if (!title && !author) {
      return NextResponse.json(
        { message: "Se requiere al menos título o autor para actualizar" },
        { status: 400 }
      );
    }

    // Actualizamos el libro usando prisma.book.update
    const updatedBook = await prisma.book.update({
      where: { id: bookId }, // Condición para encontrar el libro por ID
      data: {
        // Solo actualiza los campos proporcionados
        ...(title && { title }), // Si title existe, lo incluye en data
        ...(author && { author }), // Si author existe, lo incluye en data
      },
    });

    // Devolvemos el libro actualizado
    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    // Manejar el caso específico de "registro no encontrado"
    if (error.code === "P2025") {
      // Código de error de Prisma para "Record to update not found."
      return NextResponse.json(
        { message: "Libro no encontrado" },
        { status: 404 }
      );
    }
    // Otros errores
    return NextResponse.json(
      { message: "Error al actualizar el libro" },
      { status: 500 }
    );
  }
}

// Función para manejar solicitudes DELETE (Eliminar)
export async function DELETE(request, { params }) {
  const { id } = params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    // Eliminamos el libro usando prisma.book.delete
    await prisma.book.delete({
      where: { id: bookId }, // Condición para encontrar el libro por ID
    });

    // Respondemos con éxito sin contenido (estándar para DELETE)
    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error("Error deleting book:", error);
    // Manejar el caso específico de "registro no encontrado"
    if (error.code === "P2025") {
      // Código de error de Prisma para "Record to delete does not exist."
      return NextResponse.json(
        { message: "Libro no encontrado" },
        { status: 404 }
      );
    }
    // Otros errores
    return NextResponse.json(
      { message: "Error al eliminar el libro" },
      { status: 500 }
    );
  }
}
