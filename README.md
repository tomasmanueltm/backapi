# API-aux

A API do site Pantera permite que os desenvolvedores acessem dados do site e realizem operações de apostas de forma programática. Esta documentação fornece detalhes sobre como acessar a API, bem como informações sobre os endpoints disponíveis.


## O obejtivo 

O obejtivo desta api é servia de intermediaria para filtrar registros que não uteis para o projeto final e para impedir a exposição da real fonte de informação no caso de qualquer enventual situação no processamento de registros.


<!--ts-->
  * [Tabelas](#Tabelas)
  * [EndPoint](#EndPoint)
  * [Implemetações](#Implemetações)
    * [Normal](#Normal)
    * [Prioridade](#Prioridade)
  
<!--te-->

### Tabelas

- [] Login
  - id_usuario
  - email
  - telefone
  - senha
  - token
  - exp

- [] Usuário
  - [] id 
  - [] nome
  - [] iban
  - [] pais
  - [] tipos de usuario
    - [] normal
    - [] admin
    - [] gestor
    - [] agente

- [] Equipes
  - [] pais
  - [] nome
  - [] logo

- [] Jogo
  - [] id
  - [] casa
  - [] casa_logo
  - [] visita
  - [] visita_logo

- [] Odds
  - [] id
  - [] id_evento
  - [] odds (sera salvo um json na forma de string)

- [] Referencia 
  - [] id
  - [] codigo
  - [] status (sera do tipo enum(pendente, ativado, desativado))

- [] Evento
  - [] id
  - [] data
  - [] sport
  - [] status (sera do tipo enum(pendente, ativado, desativado))
  - [] id_jogo 


- [] Aposta
  - [] id
  - [] id_ficha
  - [] id_usuario
  - [] id_referencia
  - [] valor
  - [] data 


- [] Ficha
  - [] id
  - [] construcao (sera salvo um json na forma de string)


- [] Cadastro de Planos
- [] Cadastro de Promoções



# Autenticação
A API do site de apostas requer autenticação para acessar dados protegidos. Para autenticar uma solicitação de API, é necessário fornecer um token de acesso válido no cabeçalho da solicitação.

# Endpoints

GET/ HTTP/1.1
"/" Este endpoint permite realizar teste no site. 

saida
 `{
  message: sucesso
 }`


A solicitação deve incluir os seguintes parâmetros:

Este endpoint permite realizar uma nova aposta no site. A solicitação deve incluir os seguintes parâmetros:
 * type (obrigatório): o tipo de aposta a ser realizada (por exemplo, "Vencedor", "Placar Exato", "Total de Gols").
 * event_id (obrigatório): o ID do evento em que a aposta será feita.
 * amount (obrigatório): o valor da aposta.
 * odds (obrigatório): as probabilidades de vitória da aposta.
 * market_id (opcional): o ID do mercado em que a aposta será feita.


POST /v1/bets HTTP/1.1
Host: api.siteapostas.com
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "type": "Vencedor",
  "event_id": 123,
  "amount": 50.00,
  "odds": 1.5
}


** Exemplo de resposta:

HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 456,
  "type": "Vencedor",
  "event_id": 123,
  "amount": 50.00,
  "odds": 1.5,
  "status": "Pendente"
}

LINK : https://apifootball.com/widgets-documentation/

/eventos
Este endpoint permite obter informações sobre eventos disponíveis para apostas no site. A solicitação pode incluir os seguintes parâmetros de filtro:

1. Lista todos os países
  - por id

1. Lista todos os campeonatos(ligas)
  - por id
2.Pega todas as liga deste pais
3.Pega todos jogo de uma liga
4.Paga dos dados do jogo
5. Pega os odds deste jogo (Probabilidade)
receber datas ()- 
receber ligas - 