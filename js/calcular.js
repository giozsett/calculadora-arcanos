import { lerAno, lerDataNascimento } from './arcanos.js';

const formulario = document.getElementById('formulario');
const campoNascimento = document.getElementById('nascimento');
const campoAno = document.getElementById('ano');

const hoje = new Date();
campoAno.value = hoje.getFullYear();
campoNascimento.max = [
  hoje.getFullYear(),
  String(hoje.getMonth() + 1).padStart(2, '0'),
  String(hoje.getDate()).padStart(2, '0'),
].join('-');

function mostrarErro(campo, mensagem) {
  const erro = document.getElementById(`erro-${campo.id}`);
  erro.textContent = mensagem ?? '';
  erro.classList.toggle('hidden', !mensagem);
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

formulario.addEventListener('submit', (evento) => {
  const nascimento = lerDataNascimento(campoNascimento.value);
  const ano = lerAno(campoAno.value);

  mostrarErro(campoNascimento, nascimento.erro);
  mostrarErro(campoAno, ano.erro);

  if (nascimento.erro || ano.erro) {
    evento.preventDefault();
    (nascimento.erro ? campoNascimento : campoAno).focus();
  }
});
