# Tema Nu3tion — guia de instalação

Este é um **child theme do Storefront** (tema oficial gratuito do WooCommerce) com o
design do protótipo aprovado já traduzido para WordPress. Foi construído sem acesso
a um WordPress rodando de verdade, então **precisa ser testado e ajustado ao vivo**
assim que tivermos acesso — isso é normal, não é sinal de que algo está errado.

## Pré-requisitos (instalar antes do tema)

1. **WordPress** já instalado na hospedagem (HostGator).
2. Plugin **WooCommerce** instalado e ativado.
3. Tema **Storefront** instalado (não precisa ativar — só precisa estar instalado,
   porque este é o tema-pai). Aparência → Temas → Adicionar novo → buscar "Storefront".
4. Plugin de pagamento (ex: **Mercado Pago para WooCommerce**) instalado e configurado
   com as credenciais reais do cliente.

## Passo a passo

1. Compacte a pasta `nu3tion-storefront-child` inteira em um `.zip`.
2. No wp-admin: Aparência → Temas → Adicionar novo → Enviar tema → selecione o `.zip`.
3. Ative o tema **"Nu3tion (Storefront Child)"**.
4. Vá em **Produtos → Adicionar novo** e cadastre o produto real:
   - Nome: OraProtein
   - **SKU: `ORAPROTEIN-ACAI-ABACAXI`** (obrigatório bater com o que está em
     `functions.php`, na função `nu3tion_get_main_product_id()` — ou troque essa
     função para retornar o ID do produto direto, ex: `return 123;`)
   - Preço, preço promocional, imagem principal, descrição — usar os dados que já
     estão no site modelo (`R$ 159,90`, de `R$ 189,90`, foto em `assets/img/Nu3tion 1.png`)
5. Em **Aparência → Menus**, crie um menu com os links internos (Para quem é,
   Benefícios, Produto, Nutrição, Depoimentos, Dúvidas) e associe ao local
   **"Menu principal"**. Se pular esse passo, o header usa um menu de reserva
   já embutido no código (funciona igual, só não é editável pelo wp-admin).
6. Em **Configurações → Leitura**, defina "Sua página inicial exibe" como
   **"Uma página estática"** e escolha (ou crie) uma página qualquer como
   página inicial — o WordPress vai usar automaticamente o `front-page.php`
   deste tema para ela, então o conteúdo da página em si não importa.
7. Na mesma tela (**Configurações → Leitura**), em **"Página de posts"**,
   selecione a página que já existe com o slug `/blog/` (ou crie uma página
   vazia chamada "Blog" e selecione ela ali). Isso faz o WordPress usar o
   `home.php` deste tema para mostrar a listagem de posts nesse endereço — os
   posts antigos do cliente **continuam no banco de dados** e aparecem
   automaticamente, só com o visual novo.

## O que ainda precisa ser testado/ajustado ao vivo (não dá pra verificar sem WordPress rodando)

- [ ] Confirmar que o botão "Adicionar ao carrinho" funciona e o carrinho
      nativo do WooCommerce abre corretamente.
- [ ] Confirmar que o preço (`get_price_html()`) aparece formatado certinho
      (R$, vírgula decimal — o WooCommerce já faz isso automaticamente se a
      moeda estiver configurada como Real em Configurações do WooCommerce).
- [ ] Testar o checkout completo com o Mercado Pago em modo sandbox.
- [ ] Confirmar que o preenchimento automático de CEP no checkout funciona (ver
      seção abaixo — depende do checkout ser o "clássico" do WooCommerce).
- [ ] Conferir se o CSS do Storefront não conflita com o nosso em alguma
      página que a gente não reescreveu (carrinho, checkout, minha conta) —
      essas páginas usam o visual padrão do Storefront por enquanto.
- [ ] Testar em mobile de verdade (não só no navegador).
- [ ] Testar o blog: conferir se `/blog/` mostra a listagem nova (`home.php`),
      se abrir um post usa o layout novo (`single.php`), e se categorias/tags
      também usam o visual novo (`archive.php`). Confirmar que os posts
      antigos do cliente aparecem certinho, com imagem destacada — se algum
      post não tiver imagem destacada definida, aparece um espaço reservado
      no lugar (dá pra cadastrar a imagem depois, em cada post).

## O que foi decidido para essa primeira versão (mudanças de escopo conscientes)

- **Removi o carrinho lateral (drawer) customizado e o modal de checkout em
  3 passos** do protótipo. Em vez disso, o ícone de carrinho leva direto para
  a página de carrinho nativa do WooCommerce, e o checkout usa a página de
  checkout nativa (com os campos de entrega/pagamento do próprio WooCommerce).
  Construir um carrinho lateral customizado conectado de verdade ao WooCommerce
  é bem mais trabalho e não é essencial pro lançamento — dá pra fazer depois
  se o cliente quiser manter aquele visual específico.
- **Preenchimento automático de endereço por CEP**: já implementado em
  `assets/js/site.js` (função `setupCepAutofill`), usando a mesma API pública
  ViaCEP do protótipo. Ele procura pelos campos `#billing_postcode`,
  `#billing_address_1`, `#billing_city`, `#billing_state` e (se existir)
  `#billing_neighborhood` — que são os IDs do **checkout clássico** do
  WooCommerce. Se a loja usar o checkout novo em blocos ("Cart & Checkout
  blocks", baseado em React), os campos têm outros seletores e essa função
  vai precisar ser adaptada — confirmar isso ao testar ao vivo.
- As páginas de carrinho, checkout e "minha conta" ainda usam o visual padrão
  do Storefront (não o nosso design customizado). Isso é intencional pra essa
  primeira versão — dá confiança pro cliente final (visual "de loja de
  verdade") e economiza tempo agora.

## Arquivos deste tema

- `style.css` — todo o CSS do site (cabeçalho do tema + design completo)
- `functions.php` — configuração do tema, SKU do produto principal
- `header.php` / `footer.php` — cabeçalho e rodapé
- `front-page.php` — a página inicial inteira (todas as seções de marketing + produto)
- `home.php` — listagem principal do blog (a página configurada em "Página de posts")
- `archive.php` — listagem de posts por categoria/tag/data
- `single.php` — página de um post individual
- `index.php` — modelo de reserva exigido pelo WordPress (raramente usado na prática)
- `template-parts/content-blog-card.php` — o card de post reutilizado nas listagens
- `assets/js/site.js` — menu mobile, animações, carrossel de depoimentos, FAQ, abas de nutrição
- `assets/img/` — todas as imagens do site
