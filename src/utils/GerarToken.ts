import { decode, sign, verify } from "jsonwebtoken";

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

// Função para verificar a autenticação do token
export function verificarToken(token : string) {
  try {
    // Verificar o token usando a chave secreta
    const result = verify(token, String(process.env.SECRET_JWT));

    // O token é válido
    console.log('Token válido');
    console.log('Payload:', result);
   
    // Você pode acessar os dados do payload decodificado, como decoded.userId, decoded.nome, etc.
    // Faça qualquer outra verificação necessária e retorne true ou false conforme apropriado.

    return true;
  } catch (error) {
    // O token é inválido ou expirou
    return false;
  }
}