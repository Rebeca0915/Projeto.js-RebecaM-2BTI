const form = document.querySelector("#form-tarefa");
const input = document.querySelector("#input-tarefa");
const erro = document.querySelector("#mensagem-erro");
const listaMensagens = document.querySelector("#lista-tarefas");


let listaTarefas = []; // cada item: { text: string, done: boolean }

let editandoIndex = null;

const contadorEl = document.querySelector("#contador");
const btnLimpar = document.querySelector("#limpar");

// carregar do localStorage
function carregar() {
  try {
    const raw = localStorage.getItem("tarefas_v1");
    if (raw) listaTarefas = JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao carregar tarefas:", e);
    listaTarefas = [];
  }
}

function salvar() {
  localStorage.setItem("tarefas_v1", JSON.stringify(listaTarefas));
}

function validarTexto(texto) {
  const txt = texto.trim();

  if (txt === "") {
    return "Digite algo antes de enviar";
  }

  if (txt.length < 3) {
    return "Mínimo de 3 caracteres";
  }

  return "";
}

//Renderizando/mostrando a lista na tela
function render() {
  listaMensagens.innerHTML = "";

  //<li> para cada mensagem
  for (let i = 0; i < listaTarefas.length; i++) {
    const item = listaTarefas[i];
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      salvar();
      render();
    });

    const span = document.createElement("span");
    span.textContent = item.text;
  if (item.done) span.classList.add("concluida");

    // capture o índice atual para os handlers
    const indexAtual = i;

    span.addEventListener("click", () => {
      input.value = item.text;
      input.focus();
      editandoIndex = indexAtual;

      erro.textContent = "Editando item " + (indexAtual + 1) + " (envie para salvar)";
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.textContent = "Excluir";

    btnExcluir.addEventListener("click", () => {
      listaTarefas.splice(indexAtual, 1);
      salvar();
      render();
    });

  li.append(checkbox, span, btnExcluir);
    listaMensagens.append(li);
  }

  // atualizar contador
  const total = listaTarefas.length;
  const feitas = listaTarefas.filter((t) => t.done).length;
  contadorEl.textContent = `${total} tarefa${total !== 1 ? "s" : ""} (${feitas} concluída${feitas !== 1 ? "s" : ""})`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const textoDigitado = input.value;
  const mensagemErro = validarTexto(textoDigitado);

  if (mensagemErro !== "") {
    erro.textContent = mensagemErro;
    return;
  }

  erro.textContent = "";

  const textoFinal = textoDigitado.trim();

  if (editandoIndex !== null) {
    listaTarefas[editandoIndex].text = textoFinal;
    editandoIndex = null;
  } else {
    listaTarefas.push({ text: textoFinal, done: false });
  }

  salvar();
  render();

  input.value = "";
  input.focus();
});

btnLimpar.addEventListener("click", () => {
  if (!confirm("Deseja realmente limpar todas as tarefas?")) return;
  listaTarefas = [];
  salvar();
  render();
});

// inicialização
carregar();
render();

