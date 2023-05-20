-- CreateTable
CREATE TABLE `deposito` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iban` VARCHAR(100) NULL,
    `id_usuario` INTEGER NULL,
    `referencia` VARCHAR(255) NULL,
    `valor` VARCHAR(500) NULL,

    INDEX `fk_deposito_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `levantamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` VARCHAR(500) NULL,
    `id_usuario` INTEGER NULL,

    INDEX `fk_levantamento_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `times` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adversario` MEDIUMTEXT NULL,
    `casa` MEDIUMTEXT NULL,
    `probabilidade_casa` VARCHAR(255) NULL,
    `probabilidade_adversario` VARCHAR(255) NULL,
    `empate` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,
    `iban` VARCHAR(200) NULL,
    `pais` VARCHAR(255) NULL,
    `moeda_padrao` VARCHAR(255) NULL,
    `email` VARCHAR(200) NULL,
    `telefone` VARCHAR(100) NULL,
    `senha` MEDIUMTEXT NULL,
    `token` MEDIUMTEXT NULL,
    `exp` VARCHAR(100) NULL,
    `tipo_usuario` ENUM('Admin', 'Normal', 'Agente') NULL DEFAULT 'Normal',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aposta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ficha` INTEGER NULL,
    `id_usuario` INTEGER NULL,
    `id_referencia` INTEGER NULL,
    `valor` VARCHAR(100) NULL,
    `data` DATE NULL,

    INDEX `fk_aposta_ficha`(`id_ficha`),
    INDEX `fk_aposta_referencia`(`id_referencia`),
    INDEX `fk_aposta_usuario`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pais` VARCHAR(255) NULL,
    `nome` VARCHAR(255) NULL,
    `logo` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATE NULL,
    `sport` VARCHAR(150) NULL,
    `status` ENUM('Pendente', 'Ativado', 'Desativado') NULL DEFAULT 'Pendente',
    `id_jogo` INTEGER NULL,

    INDEX `fk_evento_jogo`(`id_jogo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ficha` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `construcao` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jogo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `casa` VARCHAR(100) NULL,
    `casa_logo` MEDIUMTEXT NULL,
    `visita` VARCHAR(100) NULL,
    `visita_logo` MEDIUMTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `odds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_evento` INTEGER NULL,
    `odds` VARCHAR(500) NULL,

    INDEX `fk_odds_evento`(`id_evento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(200) NULL,
    `status` ENUM('Pendente', 'Ativado', 'Desativado') NULL DEFAULT 'Pendente',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `deposito` ADD CONSTRAINT `fk_deposito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `levantamento` ADD CONSTRAINT `fk_levantamento_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aposta` ADD CONSTRAINT `fk_aposta_ficha` FOREIGN KEY (`id_ficha`) REFERENCES `ficha`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aposta` ADD CONSTRAINT `fk_aposta_referencia` FOREIGN KEY (`id_referencia`) REFERENCES `referencia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aposta` ADD CONSTRAINT `fk_aposta_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `fk_evento_jogo` FOREIGN KEY (`id_jogo`) REFERENCES `jogo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `odds` ADD CONSTRAINT `fk_odds_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
