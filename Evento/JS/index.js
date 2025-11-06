const modalInfoEvento = document.getElementById('modalInfoEvento');

    if (modalInfoEvento) {
      modalInfoEvento.addEventListener('show.bs.modal', function (event) {

        const triggerCard = event.relatedTarget;

        // Pega os dados (linha 1 já existe)
        const nome = triggerCard.dataset.nome;
        const participantes = triggerCard.dataset.participantes;
        const inicio = triggerCard.dataset.inicio;
        const fim = triggerCard.dataset.fim;
        const local = triggerCard.dataset.local; // ======== ADICIONE ESTA LINHA (1/3) ========

        // Seleciona os elementos do modal (linhas 2 a 5 já existem)
        const modalEventName = document.getElementById('modalEventName');
        const modalEventParticipants = document.getElementById('modalEventParticipants');
        const modalEventStartDate = document.getElementById('modalEventStartDate');
        const modalEventEndDate = document.getElementById('modalEventEndDate');
        const modalEventLocal = document.getElementById('modalEventLocal'); // ======== ADICIONE ESTA LINHA (2/3) ========

        // Preenche o modal (linhas 6 a 9 já existem)
        modalEventName.textContent = nome;
        modalEventParticipants.textContent = participantes;
        modalEventStartDate.textContent = inicio;
        modalEventEndDate.textContent = fim;
        modalEventLocal.textContent = local; // ======== ADICIONE ESTA LINHA (3/3) ========
      });
    }