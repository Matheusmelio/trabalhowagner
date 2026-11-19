# GeekMatch — sistema de recomendação de conteúdo

## Problema

Quem gosta de games, animes, filmes e séries pode não saber o que descobrir
em seguida. O GeekMatch usa preferências informadas pela própria pessoa para
encontrar itens com características semelhantes em formatos diferentes.

Exemplo de perfil: alguém marca **Dragon Ball**, **RPG**, **ficção científica**
e **fantasia**. O recomendador cruza esses gostos com gêneros e temas de jogos,
animes, filmes e séries do catálogo.

## Solução e família de algoritmo

O projeto é um **sistema de recomendação baseado em conteúdo**. Cada conteúdo
é representado por formato, gêneros e características (por exemplo,
`aventura`, `rpg`, `ficcao-cientifica` e `magia`). As escolhas do usuário
montam um perfil ponderado:

- cada tema marcado diretamente recebe peso 2;
- cada característica de um título favorito recebe peso 1;
- títulos favoritos não são recomendados novamente;
- é possível limitar os resultados a games, animes, filmes ou séries.

O sistema ordena os conteúdos pelo peso das características em comum dividido
pelo peso total das preferências. Essa porcentagem é **compatibilidade dentro
do perfil**, não probabilidade de gostar, avaliação de qualidade nem evidência
de eficácia com usuários.

```text
compatibilidade = 100 × soma dos pesos das características compatíveis
                       ÷ soma dos pesos de todas as características do perfil
```

O perfil de exemplo pré-carregado combina Dragon Ball como favorito e os
interesses RPG, ficção científica e fantasia. A lista mostra até oito das
maiores pontuações; o indicador informa quantos resultados compatíveis há no
catálogo inteiro.

## Dados e validade

O catálogo está em `catalogo.js` e é uma pequena seleção editorial para
demonstrar o algoritmo. Não é uma base pública completa, não representa todo o
universo geek e não tem avaliações reais de usuários. O algoritmo é
determinístico: não usa token de IA, serviço externo, API ou cadastro. As
preferências permanecem na página durante a sessão do navegador e não são
enviadas a um servidor.

As sugestões são explicáveis: cada resultado mostra os gêneros e algumas
características compartilhadas com o perfil. O filtro exclui favoritos já
marcados e respeita os formatos selecionados.

Para criação de conteúdo e indústria do entretenimento, esse tipo de
representação também pode organizar catálogos por afinidades de gênero e tema.
Ela não substitui pesquisa de audiência nem prevê sucesso comercial.

Para validar impacto real, seria necessário ampliar e revisar o catálogo,
recrutar usuários voluntários, coletar avaliações com consentimento e medir
indicadores como relevância percebida, diversidade e taxa de descoberta útil.
Também seria preciso comparar o sistema personalizado com uma lista de
referência não personalizada. Uma pontuação maior, sozinha, não prova que a
recomendação é melhor.

## Como apresentar

Abra `index.html` em um navegador. O exemplo inicial já marca Dragon Ball,
RPG, ficção científica e fantasia. Experimente:

1. observar as recomendações iniciais e o motivo de compatibilidade;
2. selecionar ou desmarcar favoritos e interesses;
3. filtrar por um ou mais formatos;
4. limpar as escolhas e montar outro perfil.

O projeto usa HTML, CSS e JavaScript sem dependências e sem configuração de
token ou chave secreta.
