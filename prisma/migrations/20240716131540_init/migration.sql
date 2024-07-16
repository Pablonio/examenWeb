-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoVender" (
    "id" SERIAL NOT NULL,
    "nombreServicio" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuarioVendedor" INTEGER NOT NULL,

    CONSTRAINT "ProductoVender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoComprado" (
    "id" SERIAL NOT NULL,
    "idProductoVender" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calificacion" INTEGER NOT NULL,

    CONSTRAINT "ProductoComprado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "contenido" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" INTEGER NOT NULL,
    "idProductoComprado" INTEGER NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "ProductoVender" ADD CONSTRAINT "ProductoVender_idUsuarioVendedor_fkey" FOREIGN KEY ("idUsuarioVendedor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoComprado" ADD CONSTRAINT "ProductoComprado_idProductoVender_fkey" FOREIGN KEY ("idProductoVender") REFERENCES "ProductoVender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idProductoComprado_fkey" FOREIGN KEY ("idProductoComprado") REFERENCES "ProductoComprado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
