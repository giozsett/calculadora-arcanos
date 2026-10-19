// Regras de cálculo do Arcano Pessoal e do Arcano Anual.
// Módulo puro (sem DOM) para poder ser usado no navegador e testado com Node.

export const TOTAL_ARCANOS = 22;
export const ANO_MINIMO = 1900;
export const ANO_MAXIMO = 2100;

const NUMEROS_ROMANOS = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
];

export function somarDigitos(valor) {
  return String(valor)
    .replace(/\D/g, '')
    .split('')
    .reduce((soma, digito) => soma + Number(digito), 0);
}

// Soma os dígitos repetidamente até o número caber entre 1 e 22.
export function reduzirArcano(numero) {
  const passos = [numero];
  let atual = numero;
  while (atual > TOTAL_ARCANOS) {
    atual = somarDigitos(atual);
    passos.push(atual);
  }
  return { arcano: atual, passos };
}

// O arcano 22 corresponde a O Louco, que no baralho é a carta 0.
export function numeroDaCarta(arcano) {
  return arcano === TOTAL_ARCANOS ? 0 : arcano;
}

export function numeroRomano(numeroCarta) {
  return NUMEROS_ROMANOS[numeroCarta];
}

function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

function calcular(dia, mes, ano) {
  const digitos = `${doisDigitos(dia)}${doisDigitos(mes)}${ano}`.split('').map(Number);
  const soma = digitos.reduce((total, digito) => total + digito, 0);
  const { arcano, passos } = reduzirArcano(soma);
  return { digitos, passos, arcano, carta: numeroDaCarta(arcano) };
}

// Arcano Pessoal: soma de todos os dígitos da data de nascimento completa.
export function calcularArcanoPessoal({ dia, mes, ano }) {
  return calcular(dia, mes, ano);
}

// Arcano Anual: dia e mês de nascimento somados aos dígitos do ano escolhido.
export function calcularArcanoAnual({ dia, mes }, anoEscolhido) {
  return calcular(dia, mes, anoEscolhido);
}

// Ex.: "1 + 5 + 0 + 8 + 1 + 9 + 9 + 0 = 33 → 3 + 3 = 6"
export function descreverCalculo({ digitos, passos }) {
  let texto = `${digitos.join(' + ')} = ${passos[0]}`;
  for (let i = 1; i < passos.length; i++) {
    texto += ` → ${String(passos[i - 1]).split('').join(' + ')} = ${passos[i]}`;
  }
  return texto;
}

// Converte "AAAA-MM-DD" (formato do <input type="date">) e valida a data.
export function lerDataNascimento(texto, hoje = new Date()) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto ?? '');
  if (!partes) return { erro: 'Informe uma data de nascimento válida.' };

  const [ano, mes, dia] = partes.slice(1).map(Number);
  const data = new Date(ano, mes - 1, dia);
  const existe = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
  if (!existe) return { erro: 'Essa data de nascimento não existe no calendário.' };
  if (ano < ANO_MINIMO) return { erro: `A data de nascimento deve ser a partir de ${ANO_MINIMO}.` };
  if (data > hoje) return { erro: 'A data de nascimento não pode estar no futuro.' };

  return { dia, mes, ano };
}

export function lerAno(texto) {
  if (!/^\d{4}$/.test(String(texto ?? '').trim())) {
    return { erro: 'Informe o ano com quatro dígitos.' };
  }
  const ano = Number(texto);
  if (ano < ANO_MINIMO || ano > ANO_MAXIMO) {
    return { erro: `Escolha um ano entre ${ANO_MINIMO} e ${ANO_MAXIMO}.` };
  }
  return { ano };
}
