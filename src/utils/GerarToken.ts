import { sign } from "jsonwebtoken";

// Função para gerar um token com expiração de 1 hora
export function gerarToken(id : number) {
  const payload = {
    // Incluir quaisquer dados adicionais que você deseja no token
    userId: id,
  };

  // Gerar o token com expiração de 1 hora (3600 segundos)
  const token = sign(payload, String(process.env.SECRET_JWT), { expiresIn: '1h' });
  return token;
}