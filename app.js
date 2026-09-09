import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { renderizarTarefas } from "./renderizacao.js";

async function iniciarAplicacao() {
    renderizarEstado("loading");

    try {
        const tarefas = await carregarTarefas();

        if (tarefas.length === 0) {
            renderizarEstado("empty", tarefas);
            return;
        }

        renderizarTarefas(tarefas);
        renderizarEstado("success", tarefas);

    } catch (erro) {
        renderizarEstado("error", erro);
    }
}

iniciarAplicacao();