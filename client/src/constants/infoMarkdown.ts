export const infoMarkdown = `
## Modos do formulário
O formulário possui 4 modos, sendo dois do tipo do formulário e 2 para o modo de anexo.
Para o tipo do formulário temos:
### Completo
 Este modo indica que o formulário será preenchido com dados de itens e preços que a empresa acabou por perder em proposta (Ex. Uma nota fiscal de um concorrente em que perdemos em 3 itens | Uma proposta de venda em que o concorrente está ganhando). Para este modo, o usuário deverá compreender que deverão ser informados campos adicionais para alimentação de dados. Este modo aceita 2 modos de anexo Nota Fiscal e Sem Comprovante.
### Somente documento
Este modo indica que não houve nenhuma perda em preços, porém o usuário ainda sim possui um documento que pode servir de alimentação para o conhecimento da IA, sendo assim, não precisará preencher mais do que o nome e a região de venda e anexar o arquivo que deseja enviar ao banco (Somente PDF).
Este modo aceita somente o modo de anexo Nota Fiscal.

Os modos de anexo se dividem em 2
### Nota Fiscal
Este modo indica deverá ser enviado um anexo contendo o PDF da nota fiscal de venda do concorrente, ou seja, o usuário obrigatoriamente deverá ter o documento salvo para envio.

### Sem Comprovante
Este modo indica que o usuário não tem nenhuma nota fiscal que comprove a venda, mas ainda sim possui informações relevantes como dados da proposta de venda, pedido de compra e até mesmo dados importantes para a alimentação do agente, neste modo o usuário não poderá anexar nenhum arquivo mas adicionalmente terá mais campos para preenchimento.

## Exemplos de uso
Segue abaixo alguns exemplos para uso do formulário em cada modo disponível para preenchimento:

#### Completo
Usuário entra no formulário e preenche seu nome e sua região de venda, informa nos campos da lista os produtos do concorrente, preços, códigos equivalentes da Cral, comentários opcionais e preços que perdemos, neste caso o usuário poderá preencher quantos produtos quiser clicando em nova linha, ao finalizar, deverá anexar o documento da Nota fiscal em caso de modo de anexo Nota Fiscal ou enviar o formulário em caso de modo de anexo Sem comprovante.

#### Somente documento
Usuário entra no formulário e preenche seu nome e sua região de venda, anexa o arquivo da nota fiscal e envia o formulário.

## Observações
É importante lembrar que caso o PDF seja um PDF gerado a partir do "Microsoft Print to PDF" que é a ferramenta de geração de PDFs da microsoft (Geralmente com os atalhos CTRL + P) o PDF se tornará inválido pois será demarcado como PDF OCR e dessa forma não será possível fazer a leitura e extração de texto, se fazendo obrigatório o preenchimento do relatório no modo de anexo Sem comprovante.
(IMAGEM AQUI)

No modo de anexo sem comprovante, o código do fornecedor se torna não obrigatório, nos demais casos, é obrigatório o preenchimento.

Reforçamos que é importante levar em consideração a forma como os itens e códigos informados no formulário, para que se atentem ao preenchimento com letras e números exatamente como nos documentos dos concorrentes.
`;
