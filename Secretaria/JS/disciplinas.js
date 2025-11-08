document.addEventListener("DOMContentLoaded", function () {
  //tipo de alert
  const tipoAlert = Object.freeze({
    DANGER: "danger",
    SUCESS: "primary",
  });

  // --- Variáveis Globais de Estado ---
  let disciplinaSelecionada = null;
  let alunoSelecionado = null;
  let gradeSelecionada = null;

  // --- DADOS FICTÍCIOS (Simulando o Spring Boot) ---
  const DADOS_ALUNOS = {
    D101: [
      // Alunos de Web 2
      { id: "A123", nome: "Ana Júlia Oliveira", turma: "T-301" },
      { id: "C789", nome: "Carlos Pereira", turma: "T-301" },
    ],
    D102: [
      // Alunos de POO
      { id: "B456", nome: "Bruno Martins Silva", turma: "T-302" },
    ],
    D103: [
      // Alunos de Redes
      { id: "D999", nome: "Daniela Costa", turma: "T-201" },
    ],
  };

  const DADOS_GRADE = {
    D101: [
      // Grade de Web 2
      {
        id: "G1",
        professor: "Dr. Silva",
        turma: "T-301",
        horario: "19:00 - 22:30",
      },
      {
        id: "G2",
        professor: "Dr. Silva",
        turma: "T-302",
        horario: "19:00 - 22:30",
      },
    ],
    D102: [
      // Grade de POO
      {
        id: "G3",
        professor: "Msc. Antunes",
        turma: "T-302",
        horario: "08:00 - 11:30",
      },
    ],
    D103: [
      // Grade de Redes
      {
        id: "G4",
        professor: "Msc. Braga",
        turma: "T-201",
        horario: "13:30 - 17:00",
      },
    ],
  };

  // --- Seletores da Tabela Principal ---
  const tabelaDisciplinasBody = document.getElementById(
    "tabelaDisciplinasBody"
  );
  const btnInserirDisciplina = document.getElementById("btnInserirDisciplina");
  const btnEditarDisciplina = document.getElementById("btnEditarDisciplina");

  // --- Seletores Tabela Alunos ---
  const tabelaAlunosBody = document.getElementById("tabelaAlunosBody");
  const btnDesvincularAluno = document.getElementById("btnDesvincularAluno");

  // --- Seletores Tabela Grade ---
  const tabelaGradeBody = document.getElementById("tabelaGradeBody");
  const btnDesvincularGrade = document.getElementById("btnDesvincularGrade");

  // --- Seletores Modal Disciplina ---
  const modalGerenciarDisciplina = document.getElementById(
    "modalGerenciarDisciplina"
  );
  const modalDisciplinaTitulo = document.getElementById(
    "modalDisciplinaTitulo"
  );
  const editCodigo = document.getElementById("editCodigo");
  const editNome = document.getElementById("editNome");
  const editTurno = document.getElementById("editTurno");
  const editCarga = document.getElementById("editCarga");
  const editValor = document.getElementById("editValor");
  const btnSalvarDisciplina = document.getElementById("btnSalvarDisciplina");
  const alertaModalDisciplina = document.getElementById(
    "alertaModalDisciplina"
  );

  // --- NOVO: Seletores Modal Desvincular ---
  const modalDesvincular = document.getElementById("modalDesvincular");
  const desvincularMensagemPrincipal = document.getElementById(
    "desvincularMensagemPrincipal"
  );
  const desvincularMensagemSecundaria = document.getElementById(
    "desvincularMensagemSecundaria"
  );
  const btnConfirmarDesvinculacao = document.getElementById(
    "btnConfirmarDesvinculacao"
  );
  const alertaModalDesvincular = document.getElementById(
    "alertaModalDesvincular"
  );

  // --- LÓGICA 1: SELEÇÃO DE DISCIPLINA (TABELA PRINCIPAL) ---
  if (tabelaDisciplinasBody) {
    tabelaDisciplinasBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega dados da linha
      const celulas = linhaClicada.cells;
      disciplinaSelecionada = {
        id: linhaClicada.dataset.disciplinaId,
        codigo: celulas[0].textContent.trim(),
        nome: celulas[1].textContent.trim(),
        turno: celulas[2].textContent.trim(),
        carga: celulas[3].textContent.trim(),
        valor: celulas[4].textContent.trim(),
      };

      // Habilita botão de editar
      btnEditarDisciplina.disabled = false;

      // Highlight
      tabelaDisciplinasBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      // Limpa e reseta tabelas secundárias
      resetarSelecaoAluno(true);
      resetarSelecaoGrade(true);

      // Carrega dados nas tabelas secundárias
      carregarAlunosSimulado(disciplinaSelecionada.id);
      carregarGradeSimulado(disciplinaSelecionada.id);

      console.clear();
      console.log("--- ✅ Disciplina Selecionada ---", disciplinaSelecionada);
    });
  }

  // --- LÓGICA 2: SELEÇÃO TABELA ALUNOS ---
  tabelaAlunosBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return; // Ignora msg de "carregando"

    const celulas = linhaClicada.cells;
    alunoSelecionado = {
      id: linhaClicada.dataset.alunoId, // Supondo que tenhamos um data-id
      nome: celulas[0].textContent.trim(),
      turma: celulas[1].textContent.trim(),
    };

    btnDesvincularAluno.disabled = false;
    tabelaAlunosBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    console.log(
      "--- ✅ Aluno Selecionado para Desvincular ---",
      alunoSelecionado
    );
  });

  // --- LÓGICA 3: SELEÇÃO TABELA GRADE ---
  tabelaGradeBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return;

    const celulas = linhaClicada.cells;
    gradeSelecionada = {
      id: linhaClicada.dataset.gradeId, // Supondo que tenhamos um data-id
      professor: celulas[0].textContent.trim(),
      turma: celulas[1].textContent.trim(),
      horario: celulas[2].textContent.trim(),
    };

    btnDesvincularGrade.disabled = false;
    tabelaGradeBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    console.log(
      "--- ✅ Grade Selecionada para Desvincular ---",
      gradeSelecionada
    );
  });

  // --- LÓGICA 4: MODAL GERENCIAR DISCIPLINA (Cadastro e Edição) ---
  modalGerenciarDisciplina.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget;

    if (triggerButton && triggerButton.id === "btnEditarDisciplina") {
      // --- MODO EDIÇÃO ---
      modalDisciplinaTitulo.textContent = "Editar Disciplina";
      if (!disciplinaSelecionada) return;

      editCodigo.value = disciplinaSelecionada.codigo;
      editNome.value = disciplinaSelecionada.nome;
      editTurno.value = disciplinaSelecionada.turno;
      editCarga.value = disciplinaSelecionada.carga;
      editValor.value = disciplinaSelecionada.valor;
      editCodigo.disabled = true; // Não permite editar o código
    } else {
      // --- MODO CADASTRO ---
      modalDisciplinaTitulo.textContent = "Inserir Disciplina";
      editCodigo.value = "";
      editNome.value = "";
      editTurno.value = "";
      editCarga.value = "";
      editValor.value = "";
      editCodigo.disabled = false; // Permite inserir novo código
    }

    alertaModalDisciplina.classList.add("d-none");
  });

  // Lógica do botão Salvar do modal
  btnSalvarDisciplina.addEventListener("click", function () {
    if (editCodigo.value == "") {
      mostrarAlerta(
        "Código em branco",
        tipoAlert.DANGER,
        alertaModalDisciplina
      );
      return;
    } else if (editNome.value == "") {
      mostrarAlerta("Nome em branco", tipoAlert.DANGER, alertaModalDisciplina);
      return;
    } else if (editTurno.value == "") {
      mostrarAlerta("Turno em branco", tipoAlert.DANGER, alertaModalDisciplina);
      return;
    } else if (editCarga.value == "") {
      mostrarAlerta("Carga em branco", tipoAlert.DANGER, alertaModalDisciplina);
      return;
    } else if (editValor.value == "") {
      mostrarAlerta("Valor em branco", tipoAlert.DANGER, alertaModalDisciplina);
      return;
    }

    const dadosDisciplina = {
      codigo: editCodigo.value,
      nome: editNome.value,
      turno: editTurno.value,
      carga: editCarga.value,
      valor: editValor.value,
    };

    if (editCodigo.disabled) {
      // MODO EDIÇÃO
      console.log("--- ✅ SALVANDO (EDIÇÃO) ---", dadosDisciplina);
      // Atualiza a linha na tabela principal
      const linhaAtiva = tabelaDisciplinasBody.querySelector(".table-active");
      if (linhaAtiva) {
        linhaAtiva.cells[1].textContent = dadosDisciplina.nome;
        linhaAtiva.cells[2].textContent = dadosDisciplina.turno;
        linhaAtiva.cells[3].textContent = dadosDisciplina.carga;
        linhaAtiva.cells[4].textContent = dadosDisciplina.valor;
      }
    } else {
      // MODO CADASTRO
      console.log("--- ✅ SALVANDO (CADASTRO) ---", dadosDisciplina);
      // (Aqui você adicionaria a nova linha na tabela principal)
    }

    // Fecha o modal
    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalDisciplina
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalGerenciarDisciplina).hide();
    }, 500);
    // Reseta a seleção na tabela principal
    resetarSelecaoAluno();
    resetarSelecaoDisciplina();
  });

  // --- NOVO: LÓGICA 5: MODAL DESVINCULAR ---
  modalDesvincular.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget; // O botão que abriu o modal
    const actionType = triggerButton.dataset.actionType; // 'aluno' ou 'grade'

    if (actionType === "aluno" && alunoSelecionado && disciplinaSelecionada) {
      desvincularMensagemPrincipal.textContent = `O aluno(a) ${alunoSelecionado.nome}`;
      desvincularMensagemSecundaria.innerHTML = `Será desvinculado(a) da disciplina <strong>${disciplinaSelecionada.nome}</strong>`;
      btnConfirmarDesvinculacao.dataset.actionType = "aluno"; // Guarda a ação para o botão de confirmar
      btnConfirmarDesvinculacao.dataset.alunoId = alunoSelecionado.id;
    } else if (
      actionType === "grade" &&
      gradeSelecionada &&
      disciplinaSelecionada
    ) {
      desvincularMensagemPrincipal.textContent = `A turma ${gradeSelecionada.turma}`;
      desvincularMensagemSecundaria.innerHTML = `Será desvinculada da disciplina <strong>${disciplinaSelecionada.nome}</strong>`;
      btnConfirmarDesvinculacao.dataset.actionType = "grade"; // Guarda a ação
      btnConfirmarDesvinculacao.dataset.gradeId = gradeSelecionada.id;
    } else {
      // Caso algo dê errado e o modal seja aberto sem seleção
      desvincularMensagemPrincipal.textContent =
        "Erro: Nenhuma seleção para desvincular.";
      desvincularMensagemSecundaria.textContent = "";
      btnConfirmarDesvinculacao.disabled = true;
    }

    alertaModalDesvincular.classList.add("d-none");
  });

  btnConfirmarDesvinculacao.addEventListener("click", function () {
    const actionType = this.dataset.actionType;

    if (actionType === "aluno" && alunoSelecionado && disciplinaSelecionada) {
      console.log(`--- ✅ DESVINCULANDO ALUNO ---`);
      console.log(
        `Aluno ID: ${alunoSelecionado.id} (${alunoSelecionado.nome})`
      );
      console.log(
        `Da Disciplina ID: ${disciplinaSelecionada.id} (${disciplinaSelecionada.nome})`
      );

      // Aqui você enviaria a requisição para o backend para desvincular o aluno
      // Após o sucesso, você removeria a linha da tabela de alunos
      const linhaAlunoParaRemover = tabelaAlunosBody.querySelector(
        `tr[data-aluno-id="${alunoSelecionado.id}"]`
      );
      if (linhaAlunoParaRemover) {
        linhaAlunoParaRemover.remove();
        // Se não sobrou nenhum aluno, mostrar mensagem "Nenhum aluno vinculado"
        if (tabelaAlunosBody.children.length === 0) {
          tabelaAlunosBody.innerHTML =
            '<tr><td colspan="2">Nenhum aluno vinculado.</td></tr>';
        }
      }
      resetarSelecaoAluno(); // Reseta a seleção na tabela de alunos
    } else if (
      actionType === "grade" &&
      gradeSelecionada &&
      disciplinaSelecionada
    ) {
      console.log(`--- ✅ DESVINCULANDO GRADE ---`);
      console.log(
        `Grade ID: ${gradeSelecionada.id} (Turma ${gradeSelecionada.turma})`
      );
      console.log(
        `Da Disciplina ID: ${disciplinaSelecionada.id} (${disciplinaSelecionada.nome})`
      );

      // Aqui você enviaria a requisição para o backend para desvincular a grade
      // Após o sucesso, você removeria a linha da tabela de grade
      const linhaGradeParaRemover = tabelaGradeBody.querySelector(
        `tr[data-grade-id="${gradeSelecionada.id}"]`
      );
      if (linhaGradeParaRemover) {
        linhaGradeParaRemover.remove();
        // Se não sobrou nenhuma grade, mostrar mensagem "Nenhuma grade encontrada"
        if (tabelaGradeBody.children.length === 0) {
          tabelaGradeBody.innerHTML =
            '<tr><td colspan="3">Nenhuma grade encontrada.</td></tr>';
        }
      }
      resetarSelecaoGrade(); // Reseta a seleção na tabela de grade
    }

    // Fecha o modal
    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalDesvincular
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalDesvincular).hide();
    }, 500);
    // Reseta a seleção na tabela principal
    resetarSelecaoAluno();
    resetarSelecaoDisciplina();
  });

  // --- FUNÇÕES AUXILIARES ---

  // Simulação de carregamento dos Alunos
  function carregarAlunosSimulado(disciplinaId) {
    tabelaAlunosBody.innerHTML = '<tr><td colspan="2">Carregando...</td></tr>';
    let dadosHtml = "";
    const alunos = DADOS_ALUNOS[disciplinaId] || []; // Pega os alunos ou um array vazio

    if (alunos.length > 0) {
      alunos.forEach((aluno) => {
        dadosHtml += `
                      <tr data-aluno-id="${aluno.id}">
                          <td>${aluno.nome}</td>
                          <td>${aluno.turma}</td>
                      </tr>
                  `;
      });
    } else {
      dadosHtml = '<tr><td colspan="2">Nenhum aluno vinculado.</td></tr>';
    }

    setTimeout(() => {
      tabelaAlunosBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Simulação de carregamento da Grade
  function carregarGradeSimulado(disciplinaId) {
    tabelaGradeBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
    let dadosHtml = "";
    const grades = DADOS_GRADE[disciplinaId] || [];

    if (grades.length > 0) {
      grades.forEach((grade) => {
        dadosHtml += `
                      <tr data-grade-id="${grade.id}">
                          <td>${grade.professor}</td>
                          <td>${grade.turma}</td>
                          <td>${grade.horario}</td>
                      </tr>
                  `;
      });
    } else {
      dadosHtml = '<tr><td colspan="3">Nenhuma grade encontrada.</td></tr>';
    }

    setTimeout(() => {
      tabelaGradeBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Função de Reset: Tabela Principal
  function resetarSelecaoDisciplina() {
    btnEditarDisciplina.disabled = true;
    disciplinaSelecionada = null;
    tabelaDisciplinasBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    // Limpa tabelas secundárias
    resetarSelecaoAluno(true);
    resetarSelecaoGrade(true);
  }

  // Função de Reset: Tabela Alunos
  function resetarSelecaoAluno(limparTabela = false) {
    btnDesvincularAluno.disabled = true;
    alunoSelecionado = null;
    if (limparTabela) {
      tabelaAlunosBody.innerHTML =
        '<tr><td colspan="2">Selecione uma disciplina.</td></tr>';
    } else {
      tabelaAlunosBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  // Função de Reset: Tabela Grade
  function resetarSelecaoGrade(limparTabela = false) {
    btnDesvincularGrade.disabled = true;
    gradeSelecionada = null;
    if (limparTabela) {
      tabelaGradeBody.innerHTML =
        '<tr><td colspan="3">Selecione uma disciplina.</td></tr>';
    } else {
      tabelaGradeBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }
});

function mostrarAlerta(mensagem, tipo, modal) {
  modal.textContent = mensagem;
  modal.className = `alert alert-${tipo}`;
}
