document.addEventListener("DOMContentLoaded", function () {
  // --- Variável Global do Script ---
  let usuarioSelecionado = null;

  // --- Seleção de Elementos (COMPLETA) ---

  // Botões de ação da Tabela
  const btnCadastrarTabela = document.getElementById("btnCadastrarTabela");
  const btnEditarTabela = document.getElementById("btnEditarTabela");
  const btnDesativarTabela = document.getElementById("btnDesativarTabela");

  // Elementos do Formulário de Endereço (da Lógica 3)
  const btnEditarEndereco = document.getElementById("btnEditarEndereco");
  const btnSalvarEndereco = document.getElementById("btnSalvarEndereco");
  const camposEndereco = document.querySelectorAll(".address-field");

  // Elementos da Tabela
  const tabelaBody = document.querySelector(".table-custom tbody");

  // Elementos do Modal de Desativação (da Lógica 2)
  const modalDesativar = document.getElementById("modalDesativar");
  const desativarMensagem = document.getElementById("desativarMensagem");
  const desativarInstrucao = document.getElementById("desativarInstrucao");
  const inputConfirmarCodigo = document.getElementById("inputConfirmarCodigo");
  const btnConfirmarDesativacao = document.getElementById(
    "btnConfirmarDesativacao"
  );
  const alertaDesativar = document.getElementById("alertaDesativar");
  const alertaEditar = document.getElementById("alertaEditar");

  // Elementos do Modal de Edição (da Lógica 4)
  const modalEditarConta = document.getElementById("modalEditarConta");
  const editCodigo = document.getElementById("editCodigo");
  const editEmail = document.getElementById("editEmail");
  const editCargo = document.getElementById("editCargo");
  const editSenha = document.getElementById("editSenha");
  const btnSalvarEdicaoConta = document.getElementById("btnSalvarEdicaoConta");

  // --- Lógica 1: Clique na Tabela ---
  if (tabelaBody) {
    tabelaBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega TODOS os dados da linha
      const celulas = linhaClicada.cells;
      const nome = celulas[0].textContent.trim();
      const codigo = celulas[1].textContent.trim();
      const email = celulas[2].textContent.trim();
      const cargo = celulas[4].textContent.trim(); // Pula Nascimento (célula 3)
      const id = linhaClicada.dataset.usuarioId;

      // Armazena todos os dados
      usuarioSelecionado = { id, nome, codigo, email, cargo };

      // Habilita os botões
      btnEditarTabela.disabled = false;
      btnDesativarTabela.disabled = false;

      // Lógica de highlight
      const linhaAtivaAnterior = tabelaBody.querySelector(".table-active");
      if (linhaAtivaAnterior) {
        linhaAtivaAnterior.classList.remove("table-active");
      }
      linhaClicada.classList.add("table-active");
    });
  }

  // --- Lógica 2: Modal de Desativação (COMPLETA) ---
  modalDesativar.addEventListener("show.bs.modal", function () {
    if (usuarioSelecionado) {
      // Preenche os textos dinâmicos
      desativarMensagem.textContent = `O usuário ${usuarioSelecionado.nome} será desativado`;
      desativarInstrucao.innerHTML = `Digite "<strong>${usuarioSelecionado.codigo}</strong>" para confirmar`;

      // Armazena o código correto no próprio botão para verificação
      btnConfirmarDesativacao.dataset.codigoCorreto = usuarioSelecionado.codigo;
    }
    // Limpa o estado anterior
    inputConfirmarCodigo.value = "";
    alertaDesativar.classList.add("d-none");
  });

  // Lógica ao clicar no botão "Confirmar" DENTRO do modal de desativação
  btnConfirmarDesativacao.addEventListener("click", function () {
    const codigoDigitado = inputConfirmarCodigo.value;
    const codigoCorreto = this.dataset.codigoCorreto;

    if (codigoDigitado === codigoCorreto) {
      // SUCESSO
      console.log(
        `DESATIVANDO USUÁRIO ID: ${usuarioSelecionado.id}, NOME: ${usuarioSelecionado.nome}`
      );
      mostrarAlertaDesativar("Usuário desativado com sucesso!", "success");

      const linhaAtiva = tabelaBody.querySelector(".table-active"); // Pega a linha ANTES de resetar

      resetarSelecao(); // Reseta a interface

      if (linhaAtiva) {
        linhaAtiva.remove(); // Remove a linha da tabela
      }

      setTimeout(() => {
        bootstrap.Modal.getInstance(modalDesativar).hide();
      }, 1500);
    } else {
      // ERRO
      mostrarAlertaDesativar("Código incorreto. Tente novamente.", "danger");
    }
  });

  // --- Lógica 3: Formulário de Endereço (COMPLETA) ---
  btnEditarEndereco.addEventListener("click", function () {
    camposEndereco.forEach((campo) => {
      campo.readOnly = false;
      campo.style.backgroundColor = "#FFFFFF";
    });
    btnSalvarEndereco.classList.remove("d-none");
  });

  btnSalvarEndereco.addEventListener("click", function () {
    console.log("Dados do endereço salvos!");
    camposEndereco.forEach((campo) => {
      campo.readOnly = true;
      campo.style.backgroundColor = "#EEEEEE";
    });
    btnSalvarEndereco.classList.add("d-none");
  });

  // --- Lógica 4: Modal de Edição/Cadastro (COMPLETA) ---
  modalEditarConta.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget;

    if (triggerButton && triggerButton.id === "btnEditarTabela") {
      // --- MODO EDIÇÃO ---
      if (usuarioSelecionado) {
        editCodigo.value = usuarioSelecionado.codigo;
        editEmail.value = usuarioSelecionado.email;
        editCargo.value = usuarioSelecionado.cargo;
        editSenha.value = "";
        editCodigo.disabled = true;
      }
    } else {
      // --- MODO CADASTRO ---
      editCodigo.value = "";
      editEmail.value = "";
      editCargo.value = "";
      editSenha.value = "";
      editCodigo.disabled = false;
    }

    alertaEditar.classList.add("d-none");
  });

  // Lógica ao clicar no botão "Confirmar" (do modal de edição)
  btnSalvarEdicaoConta.addEventListener("click", function () {
    let dadosParaEnviar;

    if (editCodigo.value == "") {
      mostrarAlertaEditar("Código em branco.", "danger");
      return;
    } else if (editEmail.value == "") {
      mostrarAlertaEditar("Email em branco.", "danger");
      return;
    } else if (editCargo.value == "") {
      mostrarAlertaEditar("Cargo em branco.", "danger");
      return;
    } else {
      if (editCodigo.disabled) {
        const senha = editSenha.value;

        if (editSenha.value != "" && senha.length < 6) {
          mostrarAlertaEditar("Senha menor que seis digitos.", "danger");
          return;
        }
        // MODO EDIÇÃO
        dadosParaEnviar = {
          id: usuarioSelecionado.id,
          codigo: editCodigo.value,
          email: editEmail.value,
          cargo: editCargo.value,
          novaSenha: editSenha.value,
        };

        console.clear();
        console.log("--- ✅ Enviando (Modo EDIÇÃO) ---");
        console.log(dadosParaEnviar);

        // Atualiza a linha na tabela
        const linhaAtiva = tabelaBody.querySelector(".table-active");
        if (linhaAtiva) {
          linhaAtiva.cells[2].textContent = dadosParaEnviar.email;
          linhaAtiva.cells[4].textContent = dadosParaEnviar.cargo;
        }
      } else {
        if (editSenha.value == "") {
          mostrarAlertaEditar("Senha em branco.", "danger");
          return;
        }
        const senha = editSenha.value;

        if (senha.length < 6) {
          mostrarAlertaEditar("Senha menor que seis digitos.", "danger");
          return;
        }
        // MODO CADASTRO
        dadosParaEnviar = {
          codigo: editCodigo.value,
          email: editEmail.value,
          cargo: editCargo.value,
          novaSenha: editSenha.value,
        };

        console.clear();
        console.log("--- ✅ Enviando (Modo CADASTRO) ---");
        console.log(dadosParaEnviar);

        // (Aqui entraria a lógica para adicionar a nova linha na tabela)
      }

      bootstrap.Modal.getInstance(modalEditarConta).hide();
    }
  });

  // --- Funções Auxiliares (COMPLETAS) ---
  function mostrarAlertaDesativar(mensagem, tipo) {
    alertaDesativar.textContent = mensagem;
    alertaDesativar.className = `alert alert-${tipo}`;
  }

  function mostrarAlertaEditar(mensagem, tipo) {
    alertaEditar.textContent = mensagem;
    alertaEditar.className = `alert alert-${tipo}`;
  }

  function resetarSelecao() {
    btnEditarTabela.disabled = true;
    btnDesativarTabela.disabled = true;
    const linhaAtiva = tabelaBody.querySelector(".table-active");
    if (linhaAtiva) {
      linhaAtiva.classList.remove("table-active");
    }
    usuarioSelecionado = null;
  }
});
