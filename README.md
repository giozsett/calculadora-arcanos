# Calculadora de Arcanos

Calculadora de **Arcano Pessoal** e **Arcano Anual** de acordo com os 22 arcanos maiores do tarô.
Projeto estático (HTML + Tailwind CSS + JavaScript), sem banco de dados.

## Páginas

| Página | Arquivo | Conteúdo |
| --- | --- | --- |
| Landing page | `index.html` | Explica o que é o Arcano Pessoal e o Arcano Anual e como o cálculo é feito |
| Formulário | `calcular.html` | Data de nascimento e ano do Arcano Anual |
| Resultado | `resultado.html` | As duas cartas, o passo a passo do cálculo e o significado de cada carta |

## Estrutura

```
calculadora-arcanos/
├── index.html
├── calcular.html
├── resultado.html
├── data/
│   └── cartas.json          # "API" estática com os 22 arcanos maiores em pt-BR
├── js/
│   ├── arcanos.js           # regras de cálculo (módulo puro, sem DOM)
│   ├── calcular.js          # validação do formulário
│   ├── resultado.js         # lê a URL, busca o JSON e monta as cartas
│   └── tailwind.config.js   # tema (cores e fontes) do Tailwind
├── tests/
│   └── arcanos.test.js      # testes do cálculo (node --test)
├── Dockerfile               # imagem Nginx que serve o site
├── .dockerignore
└── package.json
```

## Como o cálculo funciona

Os arcanos maiores vão de 1 a 22; o resultado **22 corresponde a O Louco** (carta 0).
Somam-se os dígitos e, enquanto o total passar de 22, somam-se os dígitos do total novamente.

- **Arcano Pessoal**: todos os dígitos da data de nascimento.
  `15/08/1990 → 1+5+0+8+1+9+9+0 = 33 → 3+3 = 6` (Os Enamorados)
- **Arcano Anual**: dia e mês de nascimento + o ano escolhido.
  `15/08 + 2026 → 1+5+0+8+2+0+2+6 = 24 → 2+4 = 6` (Os Enamorados)

## Dados das cartas

`data/cartas.json` segue o mesmo formato do `card_data.json` original (`nhits` + `cards`, com
`name`, `value_int`, `meaning_up`, `meaning_rev`, `desc`…), contendo apenas os arcanos maiores, com
todos os textos traduzidos para o português brasileiro. Foram acrescentados dois campos:

- `name_en`: nome original em inglês;
- `resumo`: explicação breve da carta, exibida em destaque na página de resultado.

Na página de resultado, `meaning_up` aparece como **Luz** (aspectos favoráveis), `meaning_rev` como
**Sombra** (aspectos desafiadores) e `desc` em **Simbolismo da carta**.

## Como executar

O `fetch` do JSON não funciona abrindo o arquivo direto (`file://`), então é preciso um servidor HTTP
estático. Qualquer uma das opções abaixo serve; depois acesse <http://localhost:8080>.

```bash
npm start
```

```bash
python -m http.server 8080
```

## Executando com Docker

O `Dockerfile` usa a imagem `nginx:1.27-alpine` para servir o site estático.

```bash
docker build -t calculadora-arcanos .
docker run -d -p 8080:80 --name arcanos calculadora-arcanos
```

Acesse <http://localhost:8080> (no GitHub Codespaces, abra a porta 8080 pela aba **Ports**).
Para parar e remover o container:

```bash
docker rm -f arcanos
```

## Testes

Requer Node.js 18 ou superior (não há dependências para instalar).

```bash
npm test
```

## Observações

- O Tailwind CSS é carregado pelo Play CDN (`cdn.tailwindcss.com`), então não há etapa de build.
- Os textos das cartas são baseados em *The Pictorial Key to the Tarot* (A. E. Waite, 1910), de domínio público.
