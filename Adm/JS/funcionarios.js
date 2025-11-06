document.addEventListener("DOMContentLoaded", function () {
  // --- Variável Global do Script ---
  let funcionarioSelecionado = null;

  // --- Seleção de Elementos (COMPLETA) ---
  const btnCadastrarTabela = document.getElementById("btnCadastrarTabela");
  const btnEditarTabela = document.getElementById("btnEditarTabela");
  const btnDesativarTabela = document.getElementById("btnDesativarTabela");

  const btnEditarEndereco = document.getElementById("btnEditarEndereco");
  const btnSalvarEndereco = document.getElementById("btnSalvarEndereco");
  const camposEndereco = document.querySelectorAll(".address-field");

  const tabelaBody = document.querySelector(".table-custom tbody");

  // Modal Desativação
  const modalDesativar = document.getElementById("modalDesativar");
  const desativarMensagem = document.getElementById("desativarMensagem");
  const desativarInstrucao = document.getElementById("desativarInstrucao");
  const inputConfirmarCodigo = document.getElementById("inputConfirmarCodigo");
  const btnConfirmarDesativacao = document.getElementById(
    "btnConfirmarDesativacao"
  );
  const alertaDesativar = document.getElementById("alertaDesativar");
  const alertaEditar = document.getElementById("alertaEditar");
  const alertaCadastar = document.getElementById("alertaCadastrar");

  // Modal Edição
  const modalEditarFuncionario = document.getElementById(
    "modalEditarFuncionario"
  );
  const editNome = document.getElementById("editNome");
  const editCodigo = document.getElementById("editCodigo");
  const editCPF = document.getElementById("editCPF");
  const editEmail = document.getElementById("editEmail");
  const editCelular = document.getElementById("editCelular");
  const editCargo = document.getElementById("editCargo");
  const btnSalvarEdicao = document.getElementById("btnSalvarEdicao");

  // Modal Cadastro
  const modalCadastrarFuncionario = document.getElementById(
    "modalCadastrarFuncionario"
  );

  //Enum tipo de modal
  const tipoModal = Object.freeze({
    DESATIVAR: "desativar",
    EDITAR: "editar",
    CADASTRAR: "cadastrar",
  });

  //tipo de alert
  const tipoAlert = Object.freeze({
    DANGER: "danger",
    SUCESS: "sucess"
  });
  const cadNome = document.getElementById("cadNome");
  const cadCodigo = document.getElementById("cadCodigo");
  const cadCPF = document.getElementById("cadCPF");
  const cadEmail = document.getElementById("cadEmail");
  const cadCelular = document.getElementById("cadCelular");
  const cadCargo = document.getElementById("cadCargo");
  const btnSalvarCadastro = document.getElementById("btnSalvarCadastro");
  // (Campos 'cadNome', 'cadCodigo', etc. são selecionados quando necessário)

  // --- Lógica 1: Clique na Tabela ---
  if (tabelaBody) {
    tabelaBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega TODOS os dados da linha
      const celulas = linhaClicada.cells;
      const id = linhaClicada.dataset.funcionarioId;
      const nome = celulas[0].textContent.trim();
      const codigo = celulas[1].textContent.trim();
      const cpf = celulas[2].textContent.trim();
      const email = celulas[3].textContent.trim();
      const celular = celulas[5].textContent.trim();
      const cargo = celulas[6].textContent.trim();

      // Armazena todos os dados
      funcionarioSelecionado = { id, nome, codigo, cpf, email, celular, cargo };

      // Habilita os botões
      btnEditarTabela.disabled = false;
      btnDesativarTabela.disabled = false;

      // Lógica de highlight
      const linhaAtivaAnterior = tabelaBody.querySelector(".table-active");
      if (linhaAtivaAnterior) {
        linhaAtivaAnterior.classList.remove("table-active");
      }
      linhaClicada.classList.add("table-active");

      console.clear();
      console.log("--- ✅ Funcionário Selecionado ---", funcionarioSelecionado);
    });
  }

  // --- Lógica 2: Modal de Desativação (Atualizado) ---
  modalDesativar.addEventListener("show.bs.modal", function () {
    if (funcionarioSelecionado) {
      // ATUALIZADO para "funcionário"
      desativarMensagem.textContent = `O funcionário ${funcionarioSelecionado.nome} será desativado`;
      desativarInstrucao.innerHTML = `Digite "<strong>${funcionarioSelecionado.codigo}</strong>" para confirmar`;
      btnConfirmarDesativacao.dataset.codigoCorreto =
        funcionarioSelecionado.codigo;
    }
    inputConfirmarCodigo.value = "";
    alertaDesativar.classList.add("d-none");
  });

  btnConfirmarDesativacao.addEventListener("click", function () {
    const codigoDigitado = inputConfirmarCodigo.value;
    const codigoCorreto = this.dataset.codigoCorreto;

    if (codigoDigitado === codigoCorreto) {
      console.log(`DESATIVANDO FUNCIONÁRIO ID: ${funcionarioSelecionado.id}`);
      mostrarAlerta(
        "Funcionário desativado com sucesso!",
        tipoAlert.SUCESS,
        tipoModal.DESATIVAR
      );

      const linhaAtiva = tabelaBody.querySelector(".table-active");
      resetarSelecao();

      if (linhaAtiva) {
        linhaAtiva.remove();
      }

      setTimeout(() => {
        bootstrap.Modal.getInstance(modalDesativar).hide();
      }, 1500);
    } else {
      mostrarAlerta("Código incorreto", tipoAlert.DANGER, tipoModal.DESATIVAR);
    }
  });

  // --- Lógica 3: Formulário de Endereço (Painel da Direita) ---

  // Lógica do botão "Visualizar" para preencher o endereço
  // btnVisualizarTabela.addEventListener("click", function () {
  //   if (!funcionarioSelecionado) return;

  //   console.log(
  //     `--- Visualizando Endereço do ${funcionarioSelecionado.nome} (ID: ${funcionarioSelecionado.id}) ---`
  //   );
  //   // Aqui você faria o 'fetch' para a API do Spring Boot
  //   // Ex: fetch(`/api/funcionarios/${funcionarioSelecionado.id}/endereco`)

  //   // Por enquanto, vamos preencher com dados fictícios para teste:
  //   document.getElementById("inputRua").value = "Rua Fictícia, 123";
  //   document.getElementById("inputBairro").value = "Centro";
  //   document.getElementById("inputCidade").value = "Rio de Janeiro";
  //   document.getElementById("inputNumero").value = "123";
  //   document.getElementById("inputCEP").value = "20000-000";
  //   document.getElementById("inputComplemento").value = "Apto 101";
  // });

  // Lógica dos botões "Editar/Salvar" do formulário de endereço
  btnEditarEndereco.addEventListener("click", function () {
    camposEndereco.forEach((campo) => {
      campo.readOnly = false;
      campo.style.backgroundColor = "#FFFFFF";
    });
    btnSalvarEndereco.classList.remove("d-none");
  });

  btnSalvarEndereco.addEventListener("click", function () {
    console.log("Dados do ENDEREÇO salvos!");
    camposEndereco.forEach((campo) => {
      campo.readOnly = true;
      campo.style.backgroundColor = "#EEEEEE";
    });
    btnSalvarEndereco.classList.add("d-none");
  });

  // --- Lógica 4: Modal de Edição (Separado) ---
  modalEditarFuncionario.addEventListener("show.bs.modal", function () {
    if (funcionarioSelecionado) {
      // Preenche o modal de EDIÇÃO
      editNome.value = funcionarioSelecionado.nome;
      editCodigo.value = funcionarioSelecionado.codigo;
      editCPF.value = funcionarioSelecionado.cpf;
      editEmail.value = funcionarioSelecionado.email;
      editCelular.value = funcionarioSelecionado.celular;
      editCargo.value = funcionarioSelecionado.cargo;
    }
  });

  btnSalvarEdicao.addEventListener("click", function () {
    if (editNome.value == "") {
      mostrarAlerta("Nome em branco", tipoAlert.DANGER, tipoModal.EDITAR);
      return;
    } else if (editCPF.value == "") {
      mostrarAlerta("CPF em branco", tipoAlert.DANGER, tipoModal.EDITAR);
      return;
    } else if (editEmail.value == "") {
      mostrarAlerta("Email em branco", tipoAlert.DANGER, tipoModal.EDITAR);
      return;
    } else if (editCelular.value == "") {
      mostrarAlerta("Celular em branco", tipoAlert.DANGER, tipoModal.EDITAR);
      return;
    } else if (editCargo.value == "") {
      mostrarAlerta("Cargo em branco", tipoAlert.DANGER, tipoModal.EDITAR);
      return;
    }

    const dadosEditados = {
      id: funcionarioSelecionado.id,
      nome: editNome.value,
      cpf: editCPF.value,
      email: editEmail.value,
      celular: editCelular.value,
      cargo: editCargo.value,
    };

    console.clear();
    console.log("--- ✅ Enviando (Modo EDIÇÃO) ---", dadosEditados);
    bootstrap.Modal.getInstance(modalEditarFuncionario).hide();

    // Atualiza a linha na tabela
    const linhaAtiva = tabelaBody.querySelector(".table-active");
    if (linhaAtiva) {
      linhaAtiva.cells[0].textContent = dadosEditados.nome;
      linhaAtiva.cells[2].textContent = dadosEditados.cpf;
      linhaAtiva.cells[3].textContent = dadosEditados.email;
      linhaAtiva.cells[5].textContent = dadosEditados.celular;
      linhaAtiva.cells[6].textContent = dadosEditados.cargo;
    }
  });

  // --- Lógica 5: Modal de Cadastro (Separado) ---
  modalCadastrarFuncionario.addEventListener("show.bs.modal", function () {
    // Limpa todos os campos
    cadNome.value = "";
    cadCodigo.value = "";
    cadCPF.value = "";
    cadEmail.value = "";
    cadCelular.value = "";
    cadCargo.value = "";
  });

  btnSalvarCadastro.addEventListener("click", function () {
    if (cadNome.value == "") {
      mostrarAlerta("Nome em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    } else if (cadCodigo.value == "") {
      mostrarAlerta("Código em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    } else if (cadCPF.value == "") {
      mostrarAlerta("CPF em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    } else if (cadEmail.value == "") {
      mostrarAlerta("Email em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    } else if (cadCelular.value == "") {
      mostrarAlerta("Celular em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    } else if (cadCargo.value == "") {
      mostrarAlerta("Cargo em branco", tipoAlert.DANGER, tipoModal.CADASTRAR);
      return;
    }

    const dadosCadastro = {
      nome: cadNome.value,
      codigo: cadCodigo.value,
      cpf: cadCPF.value,
      email: cadEmail.value,
      celular: cadCelular.value,
      cargo: cadCargo.value,
    };

    console.clear();
    console.log("--- ✅ Enviando (Modo CADASTRO) ---", dadosCadastro);
    bootstrap.Modal.getInstance(modalCadastrarFuncionario).hide();
    // (Aqui você faria o 'fetch' POST para o Spring Boot e,
    // na resposta, pegaria o novo funcionário e adicionaria na tabela)
  });

  // --- Funções Auxiliares (COMPLETAS) ---
  function mostrarAlerta(mensagem, tipo, btn) {
    if (btn == tipoModal.DESATIVAR) {
      alertaDesativar.textContent = mensagem;
      alertaDesativar.className = `alert alert-${tipo}`;
    } else if (btn == tipoModal.EDITAR) {
      alertaEditar.textContent = mensagem;
      alertaEditar.className = `alert alert-${tipo}`;
    } else if (btn == tipoModal.CADASTRAR) {
      alertaCadastar.textContent = mensagem;
      alertaCadastar.className = `alert alert-${tipo}`;
    }
  }

  function resetarSelecao() {
    btnVisualizarTabela.disabled = true;
    btnEditarTabela.disabled = true;
    btnDesativarTabela.disabled = true;
    const linhaAtiva = tabelaBody.querySelector(".table-active");
    if (linhaAtiva) {
      linhaAtiva.classList.remove("table-active");
    }
    funcionarioSelecionado = null;
  }
});
