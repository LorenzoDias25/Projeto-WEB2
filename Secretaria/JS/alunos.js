document.addEventListener("DOMContentLoaded", function () {
  // --- Variáveis Globais de Estado ---
  let alunoSelecionado = null;
  let historicoSelecionado = null;
  let mensalidadeSelecionada = null;

  // --- DADOS FICTÍCIOS (Simulando o Spring Boot) ---
  // Lista de todas as disciplinas disponíveis para cadastro
  const TODAS_DISCIPLINAS = [
    { id: 1, nome: "WEB 2", turma: "308.B" },
    { id: 2, nome: "POO", turma: "101.A" },
    { id: 3, nome: "Banco de Dados", turma: "308.B" },
    { id: 4, nome: "Redes", turma: "205.A" },
    { id: 5, nome: "Eng. de Software", turma: "308.B" },
  ];
  // Simulação de dados do aluno (para modo Edição)
  const DADOS_ALUNO_A123 = {
    endereco: {
      rua: "Rua Fictícia, 123",
      bairro: "Centro",
      numero: "123",
      cidade: "Rio de Janeiro",
      cep: "20000-000",
      complemento: "Apto 101",
    },
    disciplinasMatriculadas: [1, 3], // IDs: WEB 2 e Banco de Dados
  };
  const DADOS_ALUNO_B456 = {
    endereco: {
      rua: "Avenida Teste, 456",
      bairro: "Tijuca",
      numero: "456",
      cidade: "Rio de Janeiro",
      cep: "20500-000",
      complemento: "",
    },
    disciplinasMatriculadas: [2, 4], // IDs: POO e Redes
  };

  //tipo de alert
  const tipoAlert = Object.freeze({
    DANGER: "danger",
    SUCESS: "primary",
  });

  //Alert Modal

  // --- Seletores da Tabela Principal ---
  const tabelaAlunosBody = document.getElementById("tabelaAlunosBody");
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

  // --- Seletores Modal Desativar Alunos ---
  const modalDesativar = document.getElementById("modalDesativar");
  const desativarMensagem = document.getElementById("desativarMensagem");
  const desativarInstrucao = document.getElementById("desativarInstrucao");
  const inputConfirmarCodigo = document.getElementById("inputConfirmarCodigo");
  const btnConfirmarDesativacao = document.getElementById(
    "btnConfirmarDesativacao"
  );
  const alertaModalDesativarAlunos = document.getElementById(
    "alertaModalDesativarAlunos"
  );

  //Seletores do Modal Gerenciar Alunos
  const modalGerenciarAluno = document.getElementById("modalGerenciarAluno");
  const modalAlunoTitulo = document.getElementById("modalAlunoTitulo");
  const listaDisciplinasCheckboxes = document.getElementById(
    "listaDisciplinasCheckboxes"
  );
  const btnSalvarAluno = document.getElementById("btnSalvarAluno");
  const alertaModalGerenciarAluno = document.getElementById(
    "alertaModalGerenciarAluno"
  );

  // Inputs - Dados Pessoais
  const alunoNome = document.getElementById("alunoNome");
  const alunoCPF = document.getElementById("alunoCPF");
  const alunoEmail = document.getElementById("alunoEmail");
  const alunoCelular = document.getElementById("alunoCelular");
  const alunoNascimento = document.getElementById("alunoNascimento");

  // Inputs - Endereço
  const alunoRua = document.getElementById("alunoRua");
  const alunoNumero = document.getElementById("alunoNumero");
  const alunoBairro = document.getElementById("alunoBairro");
  const alunoCidade = document.getElementById("alunoCidade");
  const alunoCEP = document.getElementById("alunoCEP");
  const alunoComplemento = document.getElementById("alunoComplemento");

  // --- Seletores Modal Editar Histórico ---
  const modalEditarHistorico = document.getElementById("modalEditarHistorico");
  const editHistoricoDisciplina = document.getElementById(
    "editHistoricoDisciplina"
  );
  const editHistoricoNota = document.getElementById("editHistoricoNota");
  const editHistoricoStatus = document.getElementById("editHistoricoStatus");
  const btnSalvarEdicaoHistorico = document.getElementById(
    "btnSalvarEdicaoHistorico"
  );
  const alertaModalEdicaoHistorico = document.getElementById(
    "alertaModalEdicaoHistorico"
  );

  // --- Seletores Modal Mensalidade ---
  const modalEditarMensalidade = document.getElementById(
    "modalEditarMensalidade"
  );

  const modalInserirMensalidade = document.getElementById(
    "modalInserirMensalidade"
  );

  const modalMensalidadeTitulo = document.getElementById(
    "modalMensalidadeTitulo"
  );
  const editMensalidadeEmissao = document.getElementById(
    "editMensalidadeEmissao"
  );
  const editMensalidadeVencimento = document.getElementById(
    "editMensalidadeVencimento"
  );
  const editMensalidadeValor = document.getElementById("editMensalidadeValor");
  const editMensalidadeStatus = document.getElementById(
    "editMensalidadeStatus"
  );
  const btnSalvarEdicaoMensalidade = document.getElementById(
    "btnSalvarEdicaoMensalidade"
  );
  const inserirMensalidadeVencimento = document.getElementById(
    "inserirMensalidadeVencimento"
  );
  const inserirMensalidadeValor = document.getElementById(
    "inserirMensalidadeValor"
  );
  const btnSalvarInserirMensalidade = document.getElementById(
    "btnSalvarInserirMensalidade"
  );
  const alertaModalEdicaoMensalidade = document.getElementById(
    "alertaModalEdicaoMensalidade"
  );
  const alertaModalInserirMensalidade = document.getElementById(
    "alertaModalInserirMensalidade"
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
      btnEditarAluno.disabled = false;
      btnDesativarAluno.disabled = false;
      btnInserirMensalidade.disabled = false;

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

      console.log(`Carregando dados para o Aluno ID: ${alunoSelecionado.id}`);
      carregarHistoricoSimulado(alunoSelecionado.id);
      carregarMensalidadesSimulado(alunoSelecionado.id);
    });
  }

  // --- LÓGICA 3: SELEÇÃO TABELA HISTÓRICO ---
  tabelaHistoricoBody.addEventListener("click", function (event) {
    console.log(true);

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
      emissao: celulas[0].textContent.trim(),
      vencimento: celulas[1].textContent.trim(),
      valor: celulas[2].textContent.trim(),
      status: celulas[3].textContent.trim(),
    };

    btnEditarMensalidade.disabled = false;
    tabelaMensalidadesBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    console.log("--- ✅ Mensalidade Selecionada ---", mensalidadeSelecionada);
  });

  // --- LÓGICA 5: MODAL DESAIVAR ---

  // Modal Desativar Alunos
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

  //--- LÓGICA 6: GERENCIAR ALUNOS
  modalGerenciarAluno.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget;

    if (triggerButton && triggerButton.id === "btnEditarAluno") {
      // --- MODO EDIÇÃO ---
      modalAlunoTitulo.textContent = "Editar Aluno";
      if (!alunoSelecionado) return; // Segurança

      // Carrega dados pessoais (da tabela)
      alunoNome.value = alunoSelecionado.nome;
      alunoCPF.value = alunoSelecionado.cpf;
      alunoEmail.value = alunoSelecionado.email;
      alunoCelular.value = alunoSelecionado.celular;
      alunoNascimento.value = alunoSelecionado.nascimento;

      // Simula busca (fetch) por dados de endereço e disciplinas
      // (No mundo real, isso seria uma chamada 'await fetch(...)')
      let dadosExtras =
        alunoSelecionado.id === "A123" ? DADOS_ALUNO_A123 : DADOS_ALUNO_B456;

      // Carrega endereço
      alunoRua.value = dadosExtras.endereco.rua;
      alunoNumero.value = dadosExtras.endereco.numero;
      alunoBairro.value = dadosExtras.endereco.bairro;
      alunoCidade.value = dadosExtras.endereco.cidade;
      alunoCEP.value = dadosExtras.endereco.cep;
      alunoComplemento.value = dadosExtras.endereco.complemento;

      // Carrega disciplinas (marcando as que o aluno já tem)
      carregarDisciplinas(dadosExtras.disciplinasMatriculadas);
    } else {
      // --- MODO CADASTRO ---
      modalAlunoTitulo.textContent = "Cadastrar Novo Aluno";

      // Limpa dados pessoais
      alunoNome.value = "";
      alunoCPF.value = "";
      alunoEmail.value = "";
      alunoCelular.value = "";
      alunoNascimento.value = "";

      // Limpa endereço
      alunoRua.value = "";
      alunoNumero.value = "";
      alunoBairro.value = "";
      alunoCidade.value = "";
      alunoCEP.value = "";
      alunoComplemento.value = "";

      // Carrega disciplinas (sem nenhuma marcada)
      carregarDisciplinas([]);
    }
    alertaModalGerenciarAluno.classList.add("d-none");
  });

  // Confirmar Cadastro/Edicao Aluno
  btnSalvarAluno.addEventListener("click", function () {
    if (alunoNome.value == "") {
      mostrarAlerta(
        "Nome em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoCPF.value == "") {
      mostrarAlerta(
        "CPF em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoEmail.value == "") {
      mostrarAlerta(
        "Email em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoCelular.value == "") {
      mostrarAlerta(
        "Celular em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoCPF.value == "") {
      mostrarAlerta(
        "Nascimento em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoRua.value == "") {
      mostrarAlerta(
        "Rua em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoNumero.value == "") {
      mostrarAlerta(
        "Numero em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoBairro.value == "") {
      mostrarAlerta(
        "Bairro em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoCidade.value == "") {
      mostrarAlerta(
        "Cidade em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    } else if (alunoCEP.value == "") {
      mostrarAlerta(
        "CEP em branco",
        tipoAlert.DANGER,
        alertaModalGerenciarAluno
      );
      return;
    }

    // Coleta todos os dados do formulário
    const dadosPessoais = {
      nome: alunoNome.value,
      cpf: alunoCPF.value,
      email: alunoEmail.value,
      celular: alunoCelular.value,
      nascimento: alunoNascimento.value,
    };

    const dadosEndereco = {
      rua: alunoRua.value,
      numero: alunoNumero.value,
      // ... etc ...
    };

    // Coleta as disciplinas marcadas
    const disciplinasMarcadas = [];
    document
      .querySelectorAll("#listaDisciplinasCheckboxes .form-check-input:checked")
      .forEach((input) => {
        disciplinasMarcadas.push(input.value); // 'value' aqui seria o ID da disciplina
      });

    if (alunoSelecionado) {
      // MODO EDIÇÃO
      console.log("--- ✅ SALVANDO (EDIÇÃO) ---");
      console.log("ID Aluno:", alunoSelecionado.id);
      console.log("Dados Pessoais:", dadosPessoais);
      console.log("Endereço:", dadosEndereco);
      console.log("Disciplinas:", disciplinasMarcadas);
    } else {
      // MODO CADASTRO
      console.log("--- ✅ SALVANDO (CADASTRO) ---");
      console.log("Dados Pessoais:", dadosPessoais);
      console.log("Endereço:", dadosEndereco);
      console.log("Disciplinas:", disciplinasMarcadas);
    }

    // Fecha o modal
    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalGerenciarAluno
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalGerenciarAluno).hide();
    }, 500);
    // Reseta a seleção na tabela principal
    resetarSelecaoAluno();
  });

  //Confirma desativacao aluno
  btnConfirmarDesativacao.addEventListener("click", function () {
    const codigoDigitado = inputConfirmarCodigo.value;
    const codigoCorreto = this.dataset.codigoCorreto;

    if (codigoDigitado == "") {
      mostrarAlerta(
        "Matricula em branco",
        tipoAlert.SUCESS,
        alertaModalDesativarAlunos
      );
      return;
    }

    if (codigoCorreto != codigoDigitado) {
      mostrarAlerta(
        "Matricula incorreta",
        tipoAlert.SUCESS,
        alertaModalDesativarAlunos
      );
      return;
    }

    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalDesativarAlunos
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalDesativar).hide();
    }, 500);
  });

  // Modal Editar Mensalidade
  modalEditarMensalidade.addEventListener("show.bs.modal", function (event) {
    modalMensalidadeTitulo.textContent = "Editar Mensalidade";
    editMensalidadeEmissao.value = mensalidadeSelecionada.emissao;
    editMensalidadeVencimento.value = mensalidadeSelecionada.vencimento;
    editMensalidadeValor.value = mensalidadeSelecionada.valor;
    editMensalidadeStatus.value = mensalidadeSelecionada.status;

    alertaModalEdicaoMensalidade.classList.add("d-none");
  });

  //Confirma Edicao Mensalidade
  btnSalvarEdicaoMensalidade.addEventListener("click", function () {
    if (editMensalidadeEmissao.value == "") {
      mostrarAlerta(
        "Emissao em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoMensalidade
      );
      return;
    } else if (editMensalidadeVencimento.value == "") {
      mostrarAlerta(
        "Vencimento em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoMensalidade
      );
      return;
    } else if (editMensalidadeValor.value == "") {
      mostrarAlerta(
        "Valor em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoMensalidade
      );
      return;
    } else if (editMensalidadeStatus.value == "") {
      mostrarAlerta(
        "Status em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoMensalidade
      );
      return;
    }

    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalEdicaoMensalidade
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalEditarMensalidade).hide();
    }, 500);
  });

  //Modal Inserir Mensalidade
  modalInserirMensalidade.addEventListener("show.bs.modal", function (event) {
    // MODO INSERIR
    modalMensalidadeTitulo.textContent = "Inserir Mensalidade";
    inserirMensalidadeVencimento.value = "";
    inserirMensalidadeValor.value = "";

    alertaModalInserirMensalidade.classList.add("d-none");
  });

  //Confirma Inserir Mensalidade
  btnSalvarInserirMensalidade.addEventListener("click", function () {
    if (inserirMensalidadeVencimento.value == "") {
      mostrarAlerta(
        "Vencimento em branco",
        tipoAlert.DANGER,
        alertaModalInserirMensalidade
      );
      return;
    } else if (inserirMensalidadeValor.value == "") {
      mostrarAlerta(
        "Valor em branco",
        tipoAlert.DANGER,
        alertaModalInserirMensalidade
      );
      return;
    }

    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalInserirMensalidade
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalInserirMensalidade).hide();
    }, 500);
  });

  // Modal Editar Histórico
  modalEditarHistorico.addEventListener("show.bs.modal", function () {
    if (historicoSelecionado) {
      editHistoricoDisciplina.value = historicoSelecionado.disciplina;
      editHistoricoNota.value = historicoSelecionado.nota;
      editHistoricoStatus.value = historicoSelecionado.status;
    }

    alertaModalEdicaoHistorico.classList.add("d-none");
  });

  //Confirmar Edição histórico
  btnSalvarEdicaoHistorico.addEventListener("click", function () {
    if (editHistoricoNota.value == "") {
      mostrarAlerta(
        "Nota em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoHistorico
      );
      return;
    } else if (editHistoricoStatus.value == "") {
      mostrarAlerta(
        "Nota em branco",
        tipoAlert.DANGER,
        alertaModalEdicaoHistorico
      );
      return;
    }

    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalEdicaoHistorico
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalEditarHistorico).hide();
    }, 500);
  });

  // --- FUNÇÕES AUXILIARES ---

  //Gera a Lista de checkboxes de disciplinas
  function carregarDisciplinas(disciplinasMatriculadas = []) {
    let htmlCheckboxes = "";

    TODAS_DISCIPLINAS.forEach((disciplina) => {
      // Verifica se o ID da disciplina está na lista de matriculadas
      const estaMarcado = disciplinasMatriculadas.includes(disciplina.id);
      const checkedAttr = estaMarcado ? "checked" : "";

      htmlCheckboxes += `
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${disciplina.id}" id="check-${disciplina.id}" ${checkedAttr}>
                    <label class="form-check-label" for="check-${disciplina.id}">
                      ${disciplina.nome} - Turma ${disciplina.turma}
                    </label>
                  </div>
              `;
    });

    listaDisciplinasCheckboxes.innerHTML = htmlCheckboxes;
  }

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
                  <tr data-mensalidade-id="m1"><td>05/10/2025</td><td>10/10/2025</td><td>150.00</td><td>Pendente</td></tr>
                  <tr data-mensalidade-id="m2"><td>05/09/2025</td><td>10/09/2025</td><td>150.00</td><td>Pago</td></tr>
              `;
    } else if (alunoId === "B456") {
      dadosHtml = `
                  <tr data-mensalidade-id="m3"><td>05/10/2025</td><td>10/10/2025</td><td>150.00</td><td>Pago</td></tr>
                  <tr data-mensalidade-id="m4"><td>05/09/2025</td><td>10/09/2025</td><td>150.00</td><td>Pago</td></tr>
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

// Função de Reset: Tabela Principal
// function resetarSelecaoAluno() {
//   btnEditarAluno.disabled = true;
//   btnDesativarAluno.disabled = true;
//   alunoSelecionado = null;
//   tabelaAlunosBody
//     .querySelectorAll("tr")
//     .forEach((row) => row.classList.remove("table-active"));
// }

function mostrarAlerta(mensagem, tipo, modal) {
  modal.textContent = mensagem;
  modal.className = `alert alert-${tipo}`;
}
