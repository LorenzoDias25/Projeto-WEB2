document.addEventListener("DOMContentLoaded", function () {
  //tipo de alert
  const tipoAlert = Object.freeze({
    DANGER: "danger",
    SUCESS: "primary",
  });

  // --- Variáveis Globais de Estado ---
  let turmaSelecionada = null;
  let alunoSelecionado = null;
  let disciplinaDaTurmaSelecionada = null; // Para a tabela "Disciplinas" da direita

  // --- DADOS FICTÍCIOS (Simulando o Spring Boot) ---

  // Todas as disciplinas que existem no sistema
  const TODAS_DISCIPLINAS = [
    { id: "D101", nome: "Web 2", professor: "Dr. Silva" },
    { id: "D102", nome: "POO", professor: "Msc. Antunes" },
    { id: "D103", nome: "Redes", professor: "Msc. Braga" },
    { id: "D104", nome: "Banco de Dados", professor: "Dr. Silva" },
    { id: "D105", nome: "Eng. Software", professor: "Msc. Antunes" },
  ];

  // Relação Turma -> Disciplinas (Quais disciplinas cada turma TEM)
  const DADOS_DISCIPLINAS_TURMA = {
    T301: [
      // Turma T-301
      { id: "D101", nome: "Web 2", professor: "Dr. Silva" },
      { id: "D104", nome: "Banco de Dados", professor: "Dr. Silva" },
    ],
    T302: [
      // Turma T-302
      { id: "D101", nome: "Web 2", professor: "Dr. Silva" },
      { id: "D102", nome: "POO", professor: "Msc. Antunes" },
    ],
    T101: [
      // Turma T-101
      { id: "D102", nome: "POO", professor: "Msc. Antunes" },
    ],
  };

  // Relação Turma -> Alunos (Quais alunos cada turma TEM)
  const DADOS_ALUNOS_TURMA = {
    T301: [
      {
        id: "A123",
        nome: "Ana Júlia Oliveira",
        nota: "9.5",
        status: "Aprovada",
      },
      { id: "C789", nome: "Carlos Pereira", nota: "7.0", status: "Aprovado" },
    ],
    T302: [
      {
        id: "B456",
        nome: "Bruno Martins Silva",
        nota: "8.0",
        status: "Aprovado",
      },
    ],
    T101: [
      { id: "E555", nome: "Elisa Fernandes", nota: "-", status: "Cursando" },
    ],
  };

  // --- Seletores da Tabela Principal ---
  const tabelaTurmasBody = document.getElementById("tabelaTurmasBody");
  const btnInserirTurma = document.getElementById("btnInserirTurma");
  const btnEditarTurma = document.getElementById("btnEditarTurma");

  // --- Seletores Tabela Disciplinas (Direita) ---
  const tabelaDisciplinasBody = document.getElementById(
    "tabelaDisciplinasBody"
  );
  const btnEditarDisciplinas = document.getElementById("btnEditarDisciplinas"); // Botão "Editar" da direita

  // --- Seletores Tabela Alunos (Direita) ---
  const tabelaAlunosBody = document.getElementById("tabelaAlunosBody");

  // --- Seletores Modal Gerenciar Turma ---
  const modalGerenciarTurma = document.getElementById("modalGerenciarTurma");
  const modalTurmaTitulo = document.getElementById("modalTurmaTitulo");
  const editCodigoTurma = document.getElementById("editCodigoTurma");
  const editNomeTurma = document.getElementById("editNomeTurma");
  const editSemestreTurma = document.getElementById("editSemestreTurma");
  const editTurnoTurma = document.getElementById("editTurnoTurma");
  const btnSalvarTurma = document.getElementById("btnSalvarTurma");
  const alertaModalEditarTurma = document.getElementById(
    "alertaModalEditarTurma"
  );

  // --- Seletores Modal Gerenciar Disciplinas da Turma (Checkboxes) ---
  const modalGerenciarDisciplinasDaTurma = document.getElementById(
    "modalGerenciarDisciplinasDaTurma"
  );
  const listaDisciplinasCheckboxes = document.getElementById(
    "listaDisciplinasCheckboxes"
  );
  const btnSalvarDisciplinasDaTurma = document.getElementById(
    "btnSalvarDisciplinasDaTurma"
  );

  // --- LÓGICA 1: SELEÇÃO DE TURMA (TABELA PRINCIPAL) ---
  if (tabelaTurmasBody) {
    tabelaTurmasBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega dados da linha
      const celulas = linhaClicada.cells;
      turmaSelecionada = {
        id: linhaClicada.dataset.turmaId,
        codigo: celulas[0].textContent.trim(),
        nome: celulas[1].textContent.trim(),
        semestre: celulas[2].textContent.trim(),
        turno: celulas[3].textContent.trim(),
      };

      // Habilita botões
      btnEditarTurma.disabled = false;

      // Highlight
      tabelaTurmasBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      // Limpa e reseta tabelas secundárias
      resetarSelecaoDisciplinasTurma(true);
      resetarSelecaoAlunosTurma(true);

      // Carrega dados nas tabelas secundárias
      carregarDisciplinasDaTurma(turmaSelecionada.id);
      carregarAlunosDaTurma(turmaSelecionada.id);

      console.clear();
      console.log("--- ✅ Turma Selecionada ---", turmaSelecionada);
    });
  }

  // --- LÓGICA 2: SELEÇÃO TABELA DISCIPLINAS (Direita) ---
  tabelaDisciplinasBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return;
    tabelaDisciplinasBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
    btnEditarDisciplinas.disabled = false; // Habilita o "Editar" da direita
  });

  // --- LÓGICA 3: SELEÇÃO TABELA ALUNOS (Direita) ---
  tabelaAlunosBody.addEventListener("click", function (event) {
    const linhaClicada = event.target.closest("tr");
    if (!linhaClicada || linhaClicada.cells.length === 1) return;
    tabelaAlunosBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    linhaClicada.classList.add("table-active");
  });

  // --- LÓGICA 4: MODAL GERENCIAR TURMA (Inserir/Editar) ---
  modalGerenciarTurma.addEventListener("show.bs.modal", function (event) {
    const triggerButton = event.relatedTarget;

    if (triggerButton && triggerButton.id === "btnEditarTurma") {
      // --- MODO EDIÇÃO ---
      modalTurmaTitulo.textContent = "Editar Turma";
      if (!turmaSelecionada) return;

      editCodigoTurma.value = turmaSelecionada.codigo;
      editNomeTurma.value = turmaSelecionada.nome;
      editSemestreTurma.value = turmaSelecionada.semestre;
      editTurnoTurma.value = turmaSelecionada.turno;
      editCodigoTurma.disabled = true;
    } else {
      // --- MODO CADASTRO ---
      modalTurmaTitulo.textContent = "Inserir Turma";
      editCodigoTurma.value = "";
      editNomeTurma.value = "";
      editSemestreTurma.value = "";
      editTurnoTurma.value = "";
      editCodigoTurma.disabled = false;
    }

    alertaModalEditarTurma.classList.add("d-none");
  });

  // Lógica do botão Salvar do modal
  btnSalvarTurma.addEventListener("click", function () {
    if (editCodigoTurma.value == "") {
      mostrarAlerta(
        "Código em branco",
        tipoAlert.DANGER,
        alertaModalEditarTurma
      );
      return;
    } else if (editNomeTurma.value == "") {
      mostrarAlerta("Nome em branco", tipoAlert.DANGER, alertaModalEditarTurma);
      return;
    } else if (editSemestreTurma.value == "") {
      mostrarAlerta(
        "Semestre em branco",
        tipoAlert.DANGER,
        alertaModalEditarTurma
      );
      return;
    } else if (editTurnoTurma.value == "") {
      mostrarAlerta(
        "Turno em branco",
        tipoAlert.DANGER,
        alertaModalEditarTurma
      );
      return;
    }

    const dadosTurma = {
      codigo: editCodigoTurma.value,
      nome: editNomeTurma.value,
      semestre: editSemestreTurma.value,
      turno: editTurnoTurma.value,
    };

    if (editCodigoTurma.disabled) {
      // MODO EDIÇÃO
      console.log("--- ✅ SALVANDO (EDIÇÃO) ---", dadosTurma);
      const linhaAtiva = tabelaTurmasBody.querySelector(".table-active");
      if (linhaAtiva) {
        linhaAtiva.cells[1].textContent = dadosTurma.nome;
        linhaAtiva.cells[2].textContent = dadosTurma.semestre;
        linhaAtiva.cells[3].textContent = dadosTurma.turno;
      }
    } else {
      // MODO CADASTRO
      console.log("--- ✅ SALVANDO (CADASTRO) ---", dadosTurma);
      // (Aqui você adicionaria a nova linha na tabela principal)
    }

    //Fecha modal
    mostrarAlerta(
      "Operação concluída",
      tipoAlert.SUCESS,
      alertaModalEditarTurma
    );

    setTimeout(() => {
      bootstrap.Modal.getInstance(modalGerenciarTurma).hide();
    }, 500);
    // Reseta a seleção na tabela principal
    resetarSelecaoAluno();
    resetarSelecaoDisciplina();
    resetarSelecaoTurma();
  });

  // --- LÓGICA 5: NOVO MODAL (Gerenciar Disciplinas da Turma - Checkboxes) ---
  modalGerenciarDisciplinasDaTurma.addEventListener(
    "show.bs.modal",
    function (event) {
      if (!turmaSelecionada) {
        console.error("Nenhuma turma selecionada para editar disciplinas.");
        // (Idealmente, o botão que abre este modal estaria desabilitado)
        listaDisciplinasCheckboxes.innerHTML =
          "<p>Erro: Nenhuma turma selecionada.</p>";
        return;
      }

      // Simula a busca das disciplinas que esta turma JÁ POSSUI
      const disciplinasAtuaisDaTurma =
        DADOS_DISCIPLINAS_TURMA[turmaSelecionada.id] || [];

      // Pega apenas os IDs das disciplinas
      const idsDisciplinasAtuais = disciplinasAtuaisDaTurma.map((d) => d.id);

      // Carrega a lista de checkboxes, marcando as que a turma já tem
      carregarCheckboxesDisciplinas(idsDisciplinasAtuais);
    }
  );

  // Botão "Confirmar" do modal de checkboxes
  btnSalvarDisciplinasDaTurma.addEventListener("click", function () {
    if (!turmaSelecionada) return;

    const disciplinasMarcadasIds = [];
    document
      .querySelectorAll("#listaDisciplinasCheckboxes .form-check-input:checked")
      .forEach((input) => {
        disciplinasMarcadasIds.push(input.value); // 'value' é o ID da disciplina
      });

    console.log(
      `--- ✅ SALVANDO DISCIPLINAS para Turma ID: ${turmaSelecionada.id} ---`
    );
    console.log("IDs das Disciplinas Selecionadas:", disciplinasMarcadasIds);

    // (Aqui você faria o 'fetch' POST/PUT para o Spring Boot
    // enviando os 'disciplinasMarcadasIds' para salvar)

    // Fecha o modal
    bootstrap.Modal.getInstance(modalGerenciarDisciplinasDaTurma).hide();

    // Atualiza a tabela de disciplinas da direita para refletir as mudanças
    // (Em um app real, você talvez atualizasse DADOS_DISCIPLINAS_TURMA e chamasse a função)
    carregarDisciplinasDaTurma(turmaSelecionada.id);
  });

  // --- FUNÇÕES AUXILIARES ---

  /**
   * LÓGICA SOLICITADA: Gera a lista de checkboxes de disciplinas.
   * @param {Array<string>} idsDisciplinasAtuais - Um array com os IDs das disciplinas que devem vir marcadas.
   */
  function carregarCheckboxesDisciplinas(idsDisciplinasAtuais = []) {
    let htmlCheckboxes = "";

    TODAS_DISCIPLINAS.forEach((disciplina) => {
      // Verifica se o ID da disciplina está na lista de matriculadas
      const estaMarcado = idsDisciplinasAtuais.includes(disciplina.id);
      const checkedAttr = estaMarcado ? "checked" : "";

      htmlCheckboxes += `
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${disciplina.id}" id="check-${disciplina.id}" ${checkedAttr}>
                    <label class="form-check-label" for="check-${disciplina.id}">
                      ${disciplina.nome} (Prof: ${disciplina.professor})
                    </label>
                  </div>
              `;
    });

    listaDisciplinasCheckboxes.innerHTML = htmlCheckboxes;
  }

  // Simulação de carregamento das Disciplinas da Turma
  function carregarDisciplinasDaTurma(turmaId) {
    tabelaDisciplinasBody.innerHTML =
      '<tr><td colspan="2">Carregando...</td></tr>';
    let dadosHtml = "";
    const disciplinas = DADOS_DISCIPLINAS_TURMA[turmaId] || [];

    if (disciplinas.length > 0) {
      disciplinas.forEach((disc) => {
        dadosHtml += `
                      <tr data-disciplina-id="${disc.id}">
                          <td>${disc.nome}</td>
                          <td>${disc.professor}</td>
                      </tr>
                  `;
      });
    } else {
      dadosHtml = '<tr><td colspan="2">Nenhuma disciplina vinculada.</td></tr>';
    }

    setTimeout(() => {
      tabelaDisciplinasBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Simulação de carregamento dos Alunos da Turma
  function carregarAlunosDaTurma(turmaId) {
    tabelaAlunosBody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
    let dadosHtml = "";
    const alunos = DADOS_ALUNOS_TURMA[turmaId] || [];

    if (alunos.length > 0) {
      alunos.forEach((aluno) => {
        dadosHtml += `
                      <tr data-aluno-id="${aluno.id}">
                          <td>${aluno.nome}</td>
                          <td>${aluno.nota}</td>
                          <td>${aluno.status}</td>
                      </tr>
                  `;
      });
    } else {
      dadosHtml = '<tr><td colspan="3">Nenhum aluno vinculado.</td></tr>';
    }

    setTimeout(() => {
      tabelaAlunosBody.innerHTML = dadosHtml;
    }, 500);
  }

  // Função de Reset: Tabela Principal (Turmas)
  function resetarSelecaoTurma() {
    btnEditarTurma.disabled = true;
    turmaSelecionada = null;
    tabelaTurmasBody
      .querySelectorAll("tr")
      .forEach((row) => row.classList.remove("table-active"));
    // Limpa tabelas secundárias
    resetarSelecaoDisciplinasTurma(true);
    resetarSelecaoAlunosTurma(true);
  }

  // Função de Reset: Tabela Disciplinas (Direita)
  function resetarSelecaoDisciplinasTurma(limparTabela = false) {
    btnEditarDisciplinas.disabled = true;
    disciplinaDaTurmaSelecionada = null;
    if (limparTabela) {
      tabelaDisciplinasBody.innerHTML =
        '<tr><td colspan="2">Selecione uma turma.</td></tr>';
    } else {
      tabelaDisciplinasBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  // Função de Reset: Tabela Alunos (Direita)
  function resetarSelecaoAlunosTurma(limparTabela = false) {
    alunoSelecionado = null; // Reseta o aluno, pois a tabela de alunos agora é secundária
    if (limparTabela) {
      tabelaAlunosBody.innerHTML =
        '<tr><td colspan="3">Selecione uma turma.</td></tr>';
    } else {
      tabelaAlunosBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }
});

function mostrarAlerta(mensagem, tipo, modal) {
  modal.textContent = mensagem;
  modal.className = `alert alert-${tipo}`;
}
