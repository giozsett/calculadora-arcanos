import {
  calcularArcanoAnual,
  calcularArcanoPessoal,
  descreverCalculo,
  lerAno,
  lerDataNascimento,
  numeroRomano,
} from './arcanos.js';

const URL_CARTAS = 'data/cartas.json';

// Correspondências astrológicas tradicionais de cada arcano maior.
// O "︎" força a exibição como texto (e não emoji).
const SIMBOLOS = [
  '♅', '☿', '☽', '♀', '♈', '♉', '♊', '♋', '♌', '♍', '♃',
  '♎', '♆', '♏', '♐', '♑', '♂', '♒', '♓', '☉', '♇', '♄',
].map((simbolo) => `${simbolo}︎`);

const telas = {
  carregando: document.getElementById('carregando'),
  erro: document.getElementById('erro'),
  resultado: document.getElementById('resultado'),
};

function mostrarTela(nome) {
  for (const [chave, elemento] of Object.entries(telas)) {
    elemento.classList.toggle('hidden', chave !== nome);
  }
}

function mostrarErro(mensagem) {
  document.getElementById('erro-mensagem').textContent = mensagem;
  mostrarTela('erro');
}

async function carregarCartas() {
  const resposta = await fetch(URL_CARTAS);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const dados = await resposta.json();
  return new Map(dados.cards.map((carta) => [carta.value_int, carta]));
}

function montarCarta(tipo, calculo, carta) {
  const elemento = document.getElementById('modelo-carta').content.cloneNode(true);
  const preencher = (campo, texto) => {
    elemento.querySelector(`[data-campo="${campo}"]`).textContent = texto;
  };

  preencher('tipo', tipo);
  preencher('romano', numeroRomano(carta.value_int));
  preencher('simbolo', SIMBOLOS[carta.value_int]);
  preencher('nome-carta', carta.name);
  preencher('nome', `${carta.value_int} · ${carta.name}`);
  preencher('calculo', descreverCalculo(calculo));
  preencher('resumo', carta.resumo);
  preencher('luz', carta.meaning_up);
  preencher('sombra', carta.meaning_rev);

  const descricao = elemento.querySelector('[data-campo="descricao"]');
  for (const paragrafo of carta.desc.split('\n')) {
    const p = document.createElement('p');
    p.textContent = paragrafo;
    descricao.append(p);
  }

  return elemento;
}

async function iniciar() {
  const parametros = new URLSearchParams(window.location.search);
  const nascimento = lerDataNascimento(parametros.get('nascimento'));
  const ano = lerAno(parametros.get('ano'));

  if (nascimento.erro || ano.erro) {
    mostrarErro(nascimento.erro ?? ano.erro);
    return;
  }

  let cartas;
  try {
    cartas = await carregarCartas();
  } catch (erro) {
    console.error('Falha ao carregar as cartas:', erro);
    mostrarErro('Não conseguimos carregar as informações das cartas. Tente novamente em instantes.');
    return;
  }

  const pessoal = calcularArcanoPessoal(nascimento);
  const anual = calcularArcanoAnual(nascimento, ano.ano);

  const dataFormatada = [nascimento.dia, nascimento.mes]
    .map((n) => String(n).padStart(2, '0'))
    .concat(nascimento.ano)
    .join('/');
  document.getElementById('resumo-consulta').textContent =
    `Nascimento em ${dataFormatada} · Arcano Anual de ${ano.ano}`;

  document.getElementById('cartas').append(
    montarCarta('Arcano Pessoal', pessoal, cartas.get(pessoal.carta)),
    montarCarta(`Arcano Anual de ${ano.ano}`, anual, cartas.get(anual.carta)),
  );

  mostrarTela('resultado');
}

iniciar();
