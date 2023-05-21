-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `codigo_sms` VARCHAR(100) NULL,
    ADD COLUMN `email_token` MEDIUMTEXT NULL;
