document.addEventListener("DOMContentLoaded", function() {
            
            // --- Lógica 1: Botões Editar/Salvar (Já existente) ---
            const btnEditar = document.getElementById("btnEditarEndereco");
            const btnSalvar = document.getElementById("btnSalvarEndereco");
            
            // Pega todos os campos que devem ser editados
            const camposEndereco = document.querySelectorAll(".address-field");

            // Lógica ao clicar em "EDITAR"
            btnEditar.addEventListener("click", function() {
                
                // 1. Libera os campos para edição
                camposEndereco.forEach(campo => {
                    campo.readOnly = false;
                    campo.style.backgroundColor = "#FFFFFF"; // Muda o fundo para branco
                });

                // 2. Mostra o botão "Salvar"
                btnSalvar.classList.remove("d-none");
            });

            // Lógica ao clicar em "SALVAR"
            btnSalvar.addEventListener("click", function() {
                // Aqui você colocaria a lógica de 'fetch' para enviar os dados para o Spring Boot
                
                console.log("Dados salvos!");

                // 1. Bloqueia os campos novamente
                camposEndereco.forEach(campo => {
                    campo.readOnly = true;
                    campo.style.backgroundColor = "#EEEEEE"; // Volta o fundo para cinza
                });

                // 2. Esconde o botão "Salvar"
                btnSalvar.classList.add("d-none");
            });


            // --- Lógica 2: Teste de Clique na Tabela (NOVO) ---
            
            // 1. Seleciona o corpo da tabela
            const tabelaBody = document.querySelector(".table-custom tbody");

            if (tabelaBody) {
                // 2. Adiciona um único 'listener' no <tbody> (event delegation)
                tabelaBody.addEventListener("click", function(event) {
                    
                    // 3. Encontra o elemento <tr> (a linha) mais próximo de onde o usuário clicou
                    const linhaClicada = event.target.closest("tr");

                    // Se não achou uma linha (ex: clicou no espaço vazio), sai da função
                    if (!linhaClicada) {
                        return;
                    }

                    // 4. Pega a posição (índice) da linha
                    // Convertemos a lista de linhas para um Array para poder usar 'indexOf'
                    const todasLinhas = Array.from(tabelaBody.querySelectorAll("tr"));
                    const posicao = todasLinhas.indexOf(linhaClicada);

                    // 5. Pega o nome do usuário (está na primeira célula, índice 0)
                    const nomeUsuario = linhaClicada.cells[0].textContent.trim();
                    
                    // 6. Pega o ID (bônus, mas é o mais importante para a API)
                    const usuarioId = linhaClicada.dataset.usuarioId;


                    // 7. Exibe tudo no console (F12 no navegador)
                    console.clear(); // Limpa o console para facilitar a leitura
                    console.log("--- ✅ Teste de Clique na Tabela ---");
                    console.log("Linha clicada (elemento):", linhaClicada);
                    console.log("Posição (índice 0):", posicao);
                    console.log("Nome do Usuário:", nomeUsuario);
                    console.log("ID do Usuário (data-):", usuarioId);
                });
            }

        });