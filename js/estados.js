export function renderizarEstado(estado, dados) {
    const status = document.getElementById("status");
    const container = document.getElementById("tarefas-container");

    if (!status || !container) {
        return;
    }

    if (estado === "loading") {
        status.textContent = "Carregando tarefas...";
        container.textContent = "Carregando tarefas...";
        return;
    }

    if (estado === "success") {
        status.textContent = `${dados.length} tarefas carregadas com sucesso.`;
        return;
    }

    if (estado === "empty") {
        status.textContent = "Nenhuma tarefa encontrada.";
        container.textContent = "Não há tarefas cadastradas.";
        return;
    }

    if (estado === "error") {
        container.textContent = "";

        if (dados && dados.name === "TypeError") {
            status.textContent = "Erro de rede. Não foi possível carregar as tarefas.";
            container.textContent = "Não foi possível conectar ao servidor.";
            return;
        }

        if (dados && dados.name === "SyntaxError") {
            status.textContent = "Erro de formato. Os dados recebidos são inválidos.";
            container.textContent = "Os dados das tarefas estão em um formato inválido.";
            return;
        }

        if (dados && dados.name === "HttpError") {
            status.textContent = `Erro de protocolo: ${dados.message}.`;
            container.textContent = "Não foi possível acessar os dados das tarefas.";
            return;
        }

        status.textContent = "Ocorreu um erro ao carregar as tarefas.";
        container.textContent = "Não foi possível carregar as tarefas.";
    }
}