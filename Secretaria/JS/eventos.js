document.addEventListener("DOMContentLoaded", function () {
  //tipo de alert
  const tipoAlert = Object.freeze({
    DANGER: "danger",
    SUCESS: "primary",
  });

  // --- Variáveis Globais de Estado ---
  let eventoSelecionado = null;
  let localSelecionado = null;
  let tipoSelecionado = null;

  // --- Seletores (Tabela Eventos) ---
  const tabelaEventosBody = document.getElementById("tabelaEventosBody");
  const btnEditarEvento = document.getElementById("btnEditarEvento");

  // --- Seletores (Tabela Locais) ---
  const tabelaLocaisBody = document.getElementById("tabelaLocaisBody");
  const btnEditarLocal = document.getElementById("btnEditarLocal");

  // --- Seletores (Tabela Tipos) ---
  const tabelaTiposBody = document.getElementById("tabelaTiposBody");
  const btnEditarTipo = document.getElementById("btnEditarTipo");

  // --- Seletores (Modal Locais) ---
  const modalGerenciarLocal = document.getElementById("modalGerenciarLocal");
  const modalLocalTitulo = document.getElementById("modalLocalTitulo");
  const editLocalNome = document.getElementById("editLocalNome");
  const btnSalvarLocal = document.getElementById("btnSalvarLocal");
  const alertaModalLocal = document.getElementById("alertaModalLocal");

  // --- NOVO: Seletores (Modal Tipos de Evento) ---
  const modalGerenciarTipo = document.getElementById("modalGerenciarTipo");
  const modalTipoTitulo = document.getElementById("modalTipoTitulo");
  const editTipoNome = document.getElementById("editTipoNome");
  const btnDropdownLocal = document.getElementById("btnDropdownLocal");
  const dropdownMenuLocal = document.getElementById("dropdownMenuLocal");
  const btnSalvarTipo = document.getElementById("btnSalvarTipo");
  const alertaModalTipoEvento = document.getElementById(
    "alertaModalTipoEvento"
  );

  // --- NOVO: Seletores (Modal Eventos) ---
  const modalGerenciarEvento = document.getElementById("modalGerenciarEvento");
  const modalEventoTitulo = document.getElementById("modalEventoTitulo");
  const editEventoNome = document.getElementById("editEventoNome");
  const btnDropdownTipoEvento = document.getElementById(
    "btnDropdownTipoEvento"
  );
  const dropdownMenuTipoEvento = document.getElementById(
    "dropdownMenuTipoEvento"
  );
  const editEventoLocal = document.getElementById("editEventoLocal");
  const editEventoInicio = document.getElementById("editEventoInicio");
  const editEventoFim = document.getElementById("editEventoFim");
  const editEventoParticipantes = document.getElementById(
    "editEventoParticipantes"
  );
  const btnSalvarEvento = document.getElementById("btnSalvarEvento");
  const alertaModalGerenciarEvento = document.getElementById(
    "alertaModalGerenciarEvento"
  );

  // --- LÓGICA 1: SELEÇÃO DE EVENTO ---
  if (tabelaEventosBody) {
    tabelaEventosBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      // Pega dados da linha
      const celulas = linhaClicada.cells;
      eventoSelecionado = {
        id: linhaClicada.dataset.eventoId,
        nome: celulas[0].textContent.trim(),
        inicio: celulas[1].textContent.trim(),
        fim: celulas[2].textContent.trim(),
        participantes: celulas[3].textContent.trim(),
        tipo: celulas[4].textContent.trim(),
        local: celulas[5].textContent.trim(),
      };

      // Habilita botão de editar
      btnEditarEvento.disabled = false;

      // Highlight
      tabelaEventosBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      console.clear();
      console.log("--- ✅ Evento Selecionado ---", eventoSelecionado);
    });
  }

  // --- LÓGICA 2: SELEÇÃO DE LOCAL ---
  if (tabelaLocaisBody) {
    tabelaLocaisBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      const celulas = linhaClicada.cells;
      localSelecionado = {
        id: linhaClicada.dataset.localId,
        nome: celulas[0].textContent.trim(),
      };

      btnEditarLocal.disabled = false;

      // Highlight
      tabelaLocaisBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      console.log("--- ✅ Local Selecionado ---", localSelecionado);
    });
  }

  // --- LÓGICA 3: SELEÇÃO DE TIPO DE EVENTO ---
  if (tabelaTiposBody) {
    tabelaTiposBody.addEventListener("click", function (event) {
      const linhaClicada = event.target.closest("tr");
      if (!linhaClicada) return;

      const celulas = linhaClicada.cells;
      tipoSelecionado = {
        id: linhaClicada.dataset.tipoId,
        nome: celulas[0].textContent.trim(),
        local: celulas[1].textContent.trim(),
      };

      btnEditarTipo.disabled = false;

      // Highlight
      tabelaTiposBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
      linhaClicada.classList.add("table-active");

      console.log("--- ✅ Tipo de Evento Selecionado ---", tipoSelecionado);
    });
  }

  // --- LÓGICA 4: MODAL GERENCIAR LOCAL (MOVIDA PARA DENTRO) ---
  if (modalGerenciarLocal) {
    // Adiciona verificação de segurança
    modalGerenciarLocal.addEventListener("show.bs.modal", function (event) {
      const triggerButton = event.relatedTarget; // Botão que abriu o modal

      if (triggerButton && triggerButton.id === "btnEditarLocal") {
        // --- MODO EDIÇÃO ---
        modalLocalTitulo.textContent = "Editar Local";
        if (!localSelecionado) return; // Segurança

        // Preenche o campo com o nome do local selecionado
        editLocalNome.value = localSelecionado.nome;
      } else {
        // --- MODO CADASTRO ---
        modalLocalTitulo.textContent = "Inserir Local";
        editLocalNome.value = ""; // Limpa o campo

        // Reseta o 'localSelecionado' para garantir que estamos em modo de inserção
        // (Chamando a função que agora está no mesmo escopo)
        resetarSelecaoLocal();
      }

      alertaModalLocal.classList.add("d-none");
    });

    // Confirmar Edicao/Insercao de LOCAL
    btnSalvarLocal.addEventListener("click", function () {
      const nomeLocal = editLocalNome.value;

      if (editLocalNome.value == "") {
        mostrarAlerta("Nome em branco", tipoAlert.DANGER, alertaModalLocal);
        return;
      }

      if (localSelecionado) {
        // Se localSelecionado existe, está em modo Edição
        // MODO EDIÇÃO
        console.log("--- ✅ SALVANDO LOCAL (EDIÇÃO) ---");
        console.log(`ID: ${localSelecionado.id}, Novo Nome: ${nomeLocal}`);

        // Atualiza a linha na tabela (simulação)
        const linhaAtiva = tabelaLocaisBody.querySelector(".table-active");
        if (linhaAtiva) {
          linhaAtiva.cells[0].textContent = nomeLocal;
        }
      } else {
        // MODO CADASTRO
        console.log("--- ✅ SALVANDO LOCAL (CADASTRO) ---");
        console.log(`Novo Nome: ${nomeLocal}`);

        // (Aqui você simularia a adição de uma nova linha na tabela de locais)
      }

      //Fecha modal
      mostrarAlerta("Operação concluída", tipoAlert.SUCESS, alertaModalLocal);

      setTimeout(() => {
        bootstrap.Modal.getInstance(modalGerenciarLocal).hide();
      }, 500);
      resetarSelecaoLocal();
    });
  }

  // --- NOVO: LÓGICA 5: MODAL GERENCIAR TIPO DE EVENTO ---
  if (modalGerenciarTipo) {
    modalGerenciarTipo.addEventListener("show.bs.modal", function (event) {
      // 1. Carrega o dropdown de locais
      carregarLocaisDropdown();

      const triggerButton = event.relatedTarget;

      if (triggerButton && triggerButton.id === "btnEditarTipo") {
        // --- MODO EDIÇÃO ---
        modalTipoTitulo.textContent = "Editar Tipo de Evento";
        if (!tipoSelecionado) return;

        editTipoNome.value = tipoSelecionado.nome;

        // Simula a seleção do local salvo (se você o tiver)
        // No momento, o 'tipoSelecionado' não tem local, então apenas resetamos
        btnDropdownLocal.textContent = "Selecione um Local";
        delete btnDropdownLocal.dataset.selectedId;
        // Se 'tipoSelecionado' tivesse localNome e localId:
        btnDropdownLocal.textContent = tipoSelecionado.local;
        //btnDropdownLocal.dataset.selectedId = tipoSelecionado.localId;
      } else {
        // --- MODO CADASTRO ---
        modalTipoTitulo.textContent = "Inserir Tipo de Evento";
        editTipoNome.value = "";
        btnDropdownLocal.textContent = "Selecione um Local";
        delete btnDropdownLocal.dataset.selectedId;

        resetarSelecaoTipo();
      }

      alertaModalTipoEvento.classList.add("d-none");
    });

    btnSalvarTipo.addEventListener("click", function () {
      const nomeTipo = editTipoNome.value;
      const localIdSelecionado = btnDropdownLocal.dataset.selectedId;
      const localNomeSelecionado = btnDropdownLocal.textContent;
      if (editTipoNome.value == "") {
        mostrarAlerta(
          "Nome em branco",
          tipoAlert.DANGER,
          alertaModalTipoEvento
        );
        return;
      } else if (localNomeSelecionado == "Selecione um Local") {
        mostrarAlerta(
          "Selecione um local",
          tipoAlert.DANGER,
          alertaModalTipoEvento
        );
        return;
      }

      if (tipoSelecionado) {
        // MODO EDIÇÃO
        console.log("--- ✅ SALVANDO TIPO (EDIÇÃO) ---");
        console.log(
          `ID: ${tipoSelecionado.id}, Novo Nome: ${nomeTipo}, Local: ${localNomeSelecionado}`
        );

        const linhaAtiva = tabelaTiposBody.querySelector(".table-active");
        if (linhaAtiva) {
          linhaAtiva.cells[0].textContent = nomeTipo;
          // (Aqui você atualizaria a coluna 'Local' se ela existisse na tabela)
        }
      } else {
        // MODO CADASTRO
        console.log("--- ✅ SALVANDO TIPO (CADASTRO) ---");
        console.log(`Nome: ${nomeTipo}, Local: ${localNomeSelecionado}`);
        // (Lógica para adicionar nova linha na tabela 'tabelaTiposBody')
      }

      //Fecha modal
      mostrarAlerta(
        "Operação concluída",
        tipoAlert.SUCESS,
        alertaModalTipoEvento
      );

      setTimeout(() => {
        bootstrap.Modal.getInstance(modalGerenciarTipo).hide();
      }, 500);
      resetarSelecaoLocal();
      resetarSelecaoTipo();
    });
  }

  // --- NOVO: LÓGICA 6: MODAL GERENCIAR EVENTO ---
  if (modalGerenciarEvento) {
    modalGerenciarEvento.addEventListener("show.bs.modal", function (event) {
      // 1. Carrega o dropdown de Tipos
      carregarTiposDropdown();

      const triggerButton = event.relatedTarget;

      if (triggerButton && triggerButton.id === "btnEditarEvento") {
        // --- MODO EDIÇÃO ---
        modalEventoTitulo.textContent = "Editar Evento";
        if (!eventoSelecionado) return;

        // Preenche os campos simples
        editEventoNome.value = eventoSelecionado.nome;
        editEventoInicio.value = eventoSelecionado.inicio;
        editEventoFim.value = eventoSelecionado.fim;
        editEventoParticipantes.value = eventoSelecionado.participantes;

        // Pré-seleciona o Tipo e o Local (puxado pelo tipo)
        btnDropdownTipoEvento.textContent = eventoSelecionado.tipo;
        btnDropdownTipoEvento.dataset.selectedId = eventoSelecionado.tipoId;
        editEventoLocal.value = eventoSelecionado.local;
      } else {
        // --- MODO CADASTRO ---
        modalEventoTitulo.textContent = "Inserir Evento";
        editEventoNome.value = "";
        editEventoInicio.value = "";
        editEventoFim.value = "";
        editEventoParticipantes.value = "";
        btnDropdownTipoEvento.textContent = "Selecione o Tipo";
        editEventoLocal.value = ""; // Limpa o local
        delete btnDropdownTipoEvento.dataset.selectedId;

        resetarSelecaoEvento();
      }
      alertaModalGerenciarEvento.classList.add("d-none");
    });

    btnSalvarEvento.addEventListener("click", function () {
      const dadosEvento = {
        nome: editEventoNome.value,
        inicio: editEventoInicio.value,
        fim: editEventoFim.value,
        participantes: editEventoParticipantes.value,
        tipoId: btnDropdownTipoEvento.dataset.selectedId,
        tipoNome: btnDropdownTipoEvento.textContent,
        localNome: editEventoLocal.value,
      };

      if (editEventoNome.value == "") {
        mostrarAlerta(
          "Nome em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (editEventoInicio.value == "") {
        mostrarAlerta(
          "Data de inicio em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (editEventoFim.value == "") {
        mostrarAlerta(
          "Data de fim em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (editEventoParticipantes.value == "") {
        mostrarAlerta(
          "Participantes em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (editEventoLocal.value == "") {
        mostrarAlerta(
          "Local em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (editEventoInicio.value == "") {
        mostrarAlerta(
          "Data de inicio em branco",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      } else if (btnDropdownTipoEvento.textContent == "Selecione o Tipo") {
        mostrarAlerta(
          "Selecione o tipo de evento",
          tipoAlert.DANGER,
          alertaModalGerenciarEvento
        );
        return;
      }

      if (eventoSelecionado) {
        // MODO EDIÇÃO
        console.log("--- ✅ SALVANDO EVENTO (EDIÇÃO) ---");
        console.log(`ID: ${eventoSelecionado.id}`, dadosEvento);

        const linhaAtiva = tabelaEventosBody.querySelector(".table-active");
        if (linhaAtiva) {
          linhaAtiva.cells[0].textContent = dadosEvento.nome;
          linhaAtiva.cells[1].textContent = dadosEvento.inicio;
          linhaAtiva.cells[2].textContent = dadosEvento.fim;
          linhaAtiva.cells[3].textContent = dadosEvento.participantes;
          linhaAtiva.cells[4].textContent = dadosEvento.tipoNome;
          linhaAtiva.cells[5].textContent = dadosEvento.localNome;
        }
      } else {
        // MODO CADASTRO
        console.log("--- ✅ SALVANDO EVENTO (CADASTRO) ---", dadosEvento);
        // (Aqui você adicionaria a nova linha na tabela de eventos)
      }

      //Fecha modal
      mostrarAlerta(
        "Operação concluída",
        tipoAlert.SUCESS,
        alertaModalGerenciarEvento
      );

      setTimeout(() => {
        bootstrap.Modal.getInstance(modalGerenciarEvento).hide();
      }, 500);
      resetarSelecaoLocal();
      resetarSelecaoTipo();
      resetarSelecaoEvento();
    });
  }

  // --- FUNÇÕES AUXILIARES (MOVIDAS PARA DENTRO) ---

  /**
   * NOVO: Carrega os locais da Tabela de Locais para o Dropdown
   */
  function carregarLocaisDropdown() {
    let htmlDropdown = "";
    const linhasLocais = tabelaLocaisBody.querySelectorAll("tr");

    if (linhasLocais.length === 0) {
      htmlDropdown =
        '<li><a class="dropdown-item disabled" href="#">Nenhum local cadastrado</a></li>';
    } else {
      linhasLocais.forEach((linha) => {
        const localId = linha.dataset.localId;
        const localNome = linha.cells[0].textContent.trim();
        htmlDropdown += `
                      <li><a class="dropdown-item" href="#" data-local-id="${localId}">${localNome}</a></li>
                  `;
      });
    }

    dropdownMenuLocal.innerHTML = htmlDropdown;

    // Adiciona os eventos de clique aos novos itens do dropdown
    dropdownMenuLocal.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        const id = this.dataset.localId;
        const nome = this.textContent;

        // Atualiza o botão para mostrar a seleção
        btnDropdownLocal.textContent = nome;
        // Armazena o ID selecionado no próprio botão
        btnDropdownLocal.dataset.selectedId = id;
      });
    });
  }

  /**
   * NOVO: Carrega os TIPOS da Tabela de Tipos para o Dropdown (do modal EVENTO)
   */
  function carregarTiposDropdown() {
    let htmlDropdown = "";
    const linhasTipos = tabelaTiposBody.querySelectorAll("tr");

    linhasTipos.forEach((linha) => {
      const tipoId = linha.dataset.tipoId;
      const tipoNome = linha.cells[0].textContent.trim();
      // Pega o local associado que adicionamos no <tr>
      const localNome = linha.dataset.localNome || "";

      htmlDropdown += `
                  <li>
                    <a class="dropdown-item" href="#" data-tipo-id="${tipoId}" data-local-nome="${localNome}">
                      ${tipoNome}
                    </a>
                  </li>
              `;
    });

    dropdownMenuTipoEvento.innerHTML = htmlDropdown;

    // Adiciona os eventos de clique aos novos itens do dropdown
    dropdownMenuTipoEvento
      .querySelectorAll(".dropdown-item")
      .forEach((item) => {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const id = this.dataset.tipoId;
          const nome = this.textContent.trim();
          const local = this.dataset.localNome;

          // Atualiza o botão "Tipo"
          btnDropdownTipoEvento.textContent = nome;
          btnDropdownTipoEvento.dataset.selectedId = id;

          // ATUALIZA O CAMPO "Local" (Lógica Dependente)
          editEventoLocal.value = local;
        });
      });
  }

  function resetarSelecaoEvento() {
    btnEditarEvento.disabled = true;
    eventoSelecionado = null;
    if (tabelaEventosBody) {
      tabelaEventosBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  function resetarSelecaoLocal() {
    btnEditarLocal.disabled = true;
    localSelecionado = null;
    if (tabelaLocaisBody) {
      // Adiciona verificação
      tabelaLocaisBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  function resetarSelecaoTipo() {
    btnEditarTipo.disabled = true;
    tipoSelecionado = null;
    if (tabelaTiposBody) {
      tabelaTiposBody
        .querySelectorAll("tr")
        .forEach((row) => row.classList.remove("table-active"));
    }
  }

  function mostrarAlerta(mensagem, tipo, modal) {
    modal.textContent = mensagem;
    modal.className = `alert alert-${tipo}`;
  }
});
