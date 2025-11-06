document.addEventListener("DOMContentLoaded", function () {
  // --- Variáveis Globais de Estado ---
  let alunoSelecionado = null;
  let historicoSelecionado = null;
  let mensalidadeSelecionada = null;

  // --- Seletores da Tabela Principal ---
  const tabelaAlunosBody = document.getElementById("tabelaAlunosBody");
  const btnVisualizarAluno = document.getElementById("btnVisualizarAluno");
  const btnEditarAluno = document.getElementById("btnEditarAluno");
  const btnDesativarAluno = document.getElementById("btnDesativarAluno");

  // --- Seletores Tabela Histórico ---
  const tabelaHistoricoBody = document.getElementById("tabelaHistoricoBody");
  const btnEditarHistorico = document.getElementById("btnEditarHistorico");

  // --- Seletores Tabela Mensalidades ---
  const tabelaMensalidadesBody = document.getElementById(
    "tabelaMensalidadesBody"
  );
  const btnInserirMensalidade = document.getElementById(
    "btnInserirMensalidade"
  );
  const btnEditarMensalidade = document.getElementById("btnEditarMensalidade");

  // --- Seletores Modal Desativar ---
  const modalDesativar = document.getElementById("modalDesativar");
  const desativarMensagem = document.getElementById("desativarMensagem");
  const desativarInstrucao = document.getElementById("desativarInstrucao");
  const inputConfirmarCodigo = document.getElementById("inputConfirmarCodigo");
  const btnConfirmarDesativacao = document.getElementById(
    "btnConfirmarDesativacao"
  );
  const alertaDesativar = document.getElementById("alertaDesativar");

  // --- Seletores Modal Editar Aluno ---
  const modalEditarAluno = document.getElementById("modalEditarAluno");
  const editMatricula = document.getElementById("editMatricula");
  const editNome = document.getElementById("editNome");
  const editEmail = document.getElementById("editEmail");
  const editCPF = document.getElementById("editCPF");
  const editNascimento = document.getElementById("editNascimento");
  const editCelular = document.getElementById("editCelular");
  const editTurma = document.getElementById("editTurma");
  const editStatus = document.getElementById("editStatus");

  // --- Seletores Modal Editar Histórico ---
  const modalEditarHistorico = document.getElementById("modalEditarHistorico");
  const editHistoricoDisciplina = document.getElementById(
    "editHistoricoDisciplina"
  );
  const editHistoricoNota = document.getElementById("editHistoricoNota");
  const editHistoricoStatus = document.getElementById("editHistoricoStatus");

  // --- Seletores Modal Mensalidade ---
  const modalEditarMensalidade = document.getElementById(
    "modalEditarMensalidade"
  );
  const modalMensalidadeTitulo = document.getElementById(
    "modalMensalidadeTitulo"
  );
  const editMensalidadeVencimento = document.getElementById(
    "editMensalidadeVencimento"
  );
  const editMensalidadeValor = document.getElementById("editMensalidadeValor");
  const editMensalidadeStatus = document.getElementById(
    "editMensalidadeStatus"
  );

  // --- LÓGICA 1: SELEÇÃO DE ALUNO (TABELA PRINCIPAL) ---
  if (tabelaAlunosBody) {
    tabelaAlunosBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega dados da linha
      const celulas = linhaClicada.cells;
      alunoSelecionado = {
        id: linhaClicada.dataset.alunoId,
        matricula: celulas[0].textContent.trim(),
        nome: celulas[1].textContent.trim(),
        email: celulas[2].textContent.trim(),
        cpf: celulas[3].textContent.trim(),
        nascimento: celulas[4].textContent.trim(),
        celular: celulas[5].textContent.trim(),
        turma: celulas[6].textContent.trim(),
        status: celulas[7].textContent.trim(),
      };

      // Habilita botões principais
      btnVisualizarAluno.disabled = false;
      btnEditarAluno.disabled = false;
      btnDesativarAluno.disabled = false;

      // Highlight
      tabelaAlunosBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      // Limpa tabelas secundárias e reseta seus botões
      resetarSelecaoHistorico(true); // true = limpar <tbody>
      resetarSelecaoMensalidade(true); // true = limpar <tbody>

      console.clear();
      console.log("--- ✅ Aluno Selecionado ---", alunoSelecionado);
    });
  }

  // --- LÓGICA 2: BOTÃO "VISUALIZAR" (CARREGA TABELAS) ---
  btnVisualizarAluno.addEventListener("click", function () {
    if (!alunoSelecionado) return;

    console.log(`Carregando dados para o Aluno ID: ${alunoSelecionado.id}`);
    // Aqui entraria a chamada fetch() para o Spring Boot

    // Simulação
    carregarHistoricoSimulado(alunoSelecionado.id);
    carregarMensalidadesSimulado(alunoSelecionado.id);
  });

  // --- LÓGICA 3: SELEÇÃO TABELA HISTÓRICO ---
  tabelaHistoricoBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return; // Ignora msg de "carregando"

    const celulas = linhaClicada.cells;
    historicoSelecionado = {
      id: linhaClicada.dataset.historicoId, // Supondo que tenhamos um data-id
      disciplina: celulas[0].textContent.trim(),
      nota: celulas[1].textContent.trim(),
      status: celulas[2].textContent.trim(),
    };

    btnEditarHistorico.disabled = false;
    tabelaHistoricoBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    console.log("--- ✅ Histórico Selecionado ---", historicoSelecionado);
  });

  // --- LÓGICA 4: SELEÇÃO TABELA MENSALIDADES ---
  tabelaMensalidadesBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return;

    const celulas = linhaClicada.cells;
    mensalidadeSelecionada = {
      id: linhaClicada.dataset.mensalidadeId, // Supondo que tenhamos um data-id
      vencimento: celulas[0].textContent.trim(),
      valor: celulas[1].textContent.trim(),
      status: celulas[2].textContent.trim(),
    };

    btnEditarMensalidade.disabled = false;
    tabelaMensalidadesBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    console.log("--- ✅ Mensalidade Selecionada ---", mensalidadeSelecionada);
  });

  // --- LÓGICA 5: MODAIS (EDIÇÃO E CADASTRO) ---

  // Modal Desativar
  modalDesativar.addEventListener("show.bs.modal", function () {
    if (alunoSelecionado) {
      desativarMensagem.textContent = `O aluno(a) ${alunoSelecionado.nome} será desativado`;
      desativarInstrucao.innerHTML = `Digite "<strong>${alunoSelecionado.matricula}</strong>" para confirmar`;
      btnConfirmarDesativacao.dataset.codigoCorreto =
        alunoSelecionado.matricula;
    }
    inputConfirmarCodigo.value = "";
    alertaDesativar.classList.add("d-none");
  });
  // (Lógica do btnConfirmarDesativacao está nas funções auxiliares)

  // Modal Editar Aluno
  modalEditarAluno.addEventListener("show.bs.modal", function () {
    if (alunoSelecionado) {
      editMatricula.value = alunoSelecionado.matricula;
      editNome.value = alunoSelecionado.nome;
      editEmail.value = alunoSelecionado.email;
      editCPF.value = alunoSelecionado.cpf;
      editNascimento.value = alunoSelecionado.nascimento;
      editCelular.value = alunoSelecionado.celular;
      editTurma.value = alunoSelecionado.turma;
      editStatus.value = alunoSelecionado.status;
    }
  });

  // Modal Editar/Inserir Mensalidade (Lógica combinada)
  modalEditarMensalidade.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget;

    if (
      triggerButton &&
      triggerButton.id === "btnEditarMensalidade" &&
      mensalidadeSelecionada
    ) {
      // MODO EDIÇÃO
      modalMensalidadeTitulo.textContent = "Editar Mensalidade";
      editMensalidadeVencimento.value = mensalidadeSelecionada.vencimento;
      editMensalidadeValor.value = mensalidadeSelecionada.valor;
      editMensalidadeStatus.value = mensalidadeSelecionada.status;
    } else {
      // MODO INSERIR
      modalMensalidadeTitulo.textContent = "Inserir Mensalidade";
      editMensalidadeVencimento.value = "";
      editMensalidadeValor.value = "";
      editMensalidadeStatus.value = "Pendente";
    }
  });

  // Modal Editar Histórico
  modalEditarHistorico.addEventListener("show.bs.modal", function () {
    if (historicoSelecionado) {
      editHistoricoDisciplina.value = historicoSelecionado.disciplina;
      editHistoricoNota.value = historicoSelecionado.nota;
      editHistoricoStatus.value = historicoSelecionado.status;
    }
  });

  // --- FUNÇÕES AUXILIARES ---

  // Simulação de carregamento do Histórico
  function carregarHistoricoSimulado(alunoId) {
    tabelaHistoricoBody.innerHTML =
      '<tr><td colspan="3">Carregando...</td></tr>';
    let dadosHtml = "";

    // Lógica Fictícia
    if (alunoId === "A123") {
      dadosHtml = `
                  <tr data-historico-id="h1"><td>Matemática</td><td>8.5</td><td>Aprovado</td></tr>
                  <tr data-historico-id="h2"><td>Português</td><td>9.0</td><td>Aprovado</td></tr>
              `;
    } else if (alunoId === "B456") {
      dadosHtml = `
                  <tr data-historico-id="h3"><td>Física</td><td>6.0</td><td>Aprovado</td></tr>
                  <tr data-historico-id="h4"><td>Química</td><td>5.5</td><td>Recuperação</td></tr>
              `;
    } else {
      dadosHtml = '<tr><td colspan="3">Nenhum histórico encontrado.</td></tr>';
    }

    setTimeout(() => {
      tabelaHistoricoBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Simulação de carregamento das Mensalidades
  function carregarMensalidadesSimulado(alunoId) {
    tabelaMensalidadesBody.innerHTML =
      '<tr><td colspan="3">Carregando...</td></tr>';
    let dadosHtml = "";

    if (alunoId === "A123") {
      dadosHtml = `
                  <tr data-mensalidade-id="m1"><td>10/10/2025</td><td>150.00</td><td>Pendente</td></tr>
                  <tr data-mensalidade-id="m2"><td>10/09/2025</td><td>150.00</td><td>Pago</td></tr>
              `;
    } else if (alunoId === "B456") {
      dadosHtml = `
                  <tr data-mensalidade-id="m3"><td>10/10/2025</td><td>150.00</td><td>Pago</td></tr>
                  <tr data-mensalidade-id="m4"><td>10/09/2025</td><td>150.00</td><td>Pago</td></tr>
              `;
    } else {
      dadosHtml =
        '<tr><td colspan="3">Nenhuma mensalidade encontrada.</td></tr>';
    }

    setTimeout(() => {
      tabelaMensalidadesBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Função de Reset da Tabela Histórico
  function resetarSelecaoHistorico(limparTabela = false) {
    btnEditarHistorico.disabled = true;
    historicoSelecionado = null;
    if (limparTabela) {
      tabelaHistoricoBody.innerHTML =
        '<tr><td colspan="3">Selecione um aluno e clique em "Visualizar".</td></tr>';
    } else {
      tabelaHistoricoBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  // Função de Reset da Tabela Mensalidades
  function resetarSelecaoMensalidade(limparTabela = false) {
    btnEditarMensalidade.disabled = true;
    mensalidadeSelecionada = null;
    if (limparTabela) {
      tabelaMensalidadesBody.innerHTML =
        '<tr><td colspan="3">Selecione um aluno e clique em "Visualizar".</td></tr>';
    } else {
      tabelaMensalidadesBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }
});
