import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  calcularArcanoAnual,
  calcularArcanoPessoal,
  descreverCalculo,
  lerAno,
  lerDataNascimento,
  numeroDaCarta,
  reduzirArcano,
  somarDigitos,
} from '../js/arcanos.js';

test('somarDigitos ignora caracteres que não são dígitos', () => {
  assert.equal(somarDigitos('15/08/1990'), 33);
  assert.equal(somarDigitos(2026), 10);
});

test('reduzirArcano mantém números até 22 e reduz os maiores', () => {
  assert.deepEqual(reduzirArcano(22), { arcano: 22, passos: [22] });
  assert.deepEqual(reduzirArcano(33), { arcano: 6, passos: [33, 6] });
  assert.deepEqual(reduzirArcano(29), { arcano: 11, passos: [29, 11] });
});

test('o arcano 22 vira a carta 0 (O Louco)', () => {
  assert.equal(numeroDaCarta(22), 0);
  assert.equal(numeroDaCarta(21), 21);
});

test('Arcano Pessoal soma todos os dígitos da data de nascimento', () => {
  const resultado = calcularArcanoPessoal({ dia: 15, mes: 8, ano: 1990 });
  assert.deepEqual(resultado.digitos, [1, 5, 0, 8, 1, 9, 9, 0]);
  assert.equal(resultado.arcano, 6);
  assert.equal(descreverCalculo(resultado), '1 + 5 + 0 + 8 + 1 + 9 + 9 + 0 = 33 → 3 + 3 = 6');
});

test('Arcano Pessoal que resulta em 22 aponta para O Louco', () => {
  // 0 + 1 + 0 + 1 + 1 + 9 + 9 + 0 = 21 → O Mundo
  const mundo = calcularArcanoPessoal({ dia: 1, mes: 1, ano: 1990 });
  assert.equal(mundo.arcano, 21);
  assert.equal(mundo.carta, 21);

  // 0 + 1 + 0 + 2 + 1 + 9 + 9 + 0 = 22 → O Louco
  const louco = calcularArcanoPessoal({ dia: 1, mes: 2, ano: 1990 });
  assert.equal(louco.arcano, 22);
  assert.equal(louco.carta, 0);
});

test('Arcano Anual usa dia e mês de nascimento com o ano escolhido', () => {
  const resultado = calcularArcanoAnual({ dia: 15, mes: 8, ano: 1990 }, 2026);
  assert.deepEqual(resultado.digitos, [1, 5, 0, 8, 2, 0, 2, 6]);
  assert.equal(resultado.arcano, 6);
  assert.equal(descreverCalculo(resultado), '1 + 5 + 0 + 8 + 2 + 0 + 2 + 6 = 24 → 2 + 4 = 6');
});

test('lerDataNascimento valida o formato e o calendário', () => {
  const hoje = new Date(2026, 9, 19);
  assert.deepEqual(lerDataNascimento('1990-08-15', hoje), { dia: 15, mes: 8, ano: 1990 });
  assert.ok(lerDataNascimento('', hoje).erro);
  assert.ok(lerDataNascimento('2023-02-30', hoje).erro);
  assert.ok(lerDataNascimento('2030-01-01', hoje).erro);
  assert.ok(lerDataNascimento('1800-01-01', hoje).erro);
});

test('lerAno aceita apenas anos de quatro dígitos dentro do intervalo', () => {
  assert.deepEqual(lerAno('2026'), { ano: 2026 });
  assert.ok(lerAno('26').erro);
  assert.ok(lerAno('2200').erro);
  assert.ok(lerAno('abcd').erro);
});

test('cartas.json traz os 22 arcanos maiores traduzidos', () => {
  const dados = JSON.parse(readFileSync(new URL('../data/cartas.json', import.meta.url), 'utf-8'));
  const numeros = dados.cards.map((carta) => carta.value_int).sort((a, b) => a - b);
  assert.deepEqual(numeros, Array.from({ length: 22 }, (_, i) => i));
  for (const carta of dados.cards) {
    for (const campo of ['name', 'resumo', 'meaning_up', 'meaning_rev', 'desc']) {
      assert.ok(carta[campo]?.trim(), `${carta.name_short} sem o campo ${campo}`);
    }
  }
});
