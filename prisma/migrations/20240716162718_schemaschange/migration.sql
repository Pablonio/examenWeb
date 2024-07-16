/*
  Warnings:

  - You are about to drop the column `calificacion` on the `ProductoComprado` table. All the data in the column will be lost.
  - Added the required column `calificacion` to the `Comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idUsuario` to the `ProductoComprado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "calificacion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductoComprado" DROP COLUMN "calificacion",
ADD COLUMN     "idUsuario" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductoComprado" ADD CONSTRAINT "ProductoComprado_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
