-- CreateTable
CREATE TABLE `agente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` MEDIUMTEXT NOT NULL,
    `data_nasc` VARCHAR(100) NOT NULL,
    `pais` VARCHAR(100) NOT NULL,
    `moeda` VARCHAR(100) NOT NULL,
    `telefone` VARCHAR(100) NULL,
    `endereco` VARCHAR(100) NULL,
    `file_original_name` VARCHAR(100) NULL,
    `file_name` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
