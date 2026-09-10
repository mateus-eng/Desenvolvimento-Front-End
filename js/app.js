import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";
import { renderizarTarefas } from "./renderizacao.js";


const estado = {

    tarefas: [],

    busca: "",

    status: "todos",

    prioridade: "todas",

    ordenacao: "nenhuma",

    carregamento: "carregando",

    erro: null
};


function derivarTarefas(estado) {

    let tarefasVisiveis = estado.tarefas.filter(function (tarefa) {

        const titulo = tarefa.titulo.toLowerCase();

        const busca = estado.busca.toLowerCase();

        const correspondeBusca =
            titulo.includes(busca);

        const correspondeStatus =
            estado.status === "todos" ||
            tarefa.status === estado.status;

        const correspondePrioridade =
            estado.prioridade === "todas" ||
            tarefa.prioridade === estado.prioridade;

        return (
            correspondeBusca &&
            correspondeStatus &&
            correspondePrioridade
        );
    });


    if (estado.ordenacao === "crescente") {

        tarefasVisiveis = [...tarefasVisiveis];

        tarefasVisiveis.sort(function (a, b) {

            return converterData(a.prazo) -
                   converterData(b.prazo);
        });
    }


    if (estado.ordenacao === "decrescente") {

        tarefasVisiveis = [...tarefasVisiveis];

        tarefasVisiveis.sort(function (a, b) {

            return converterData(b.prazo) -
                   converterData(a.prazo);
        });
    }


    return tarefasVisiveis;
}


function converterData(data) {

    const partes = data.split("/");

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);

    return new Date(ano, mes, dia).getTime();
}


function renderizarAplicacao() {

    const tarefasVisiveis = derivarTarefas(estado);


    if (estado.carregamento === "carregando") {

        renderizarEstado("loading");

        return;
    }


    if (estado.carregamento === "erro") {

        renderizarEstado("error", estado.erro);

        return;
    }


    if (estado.tarefas.length === 0) {

        renderizarEstado("empty");

        return;
    }


    if (tarefasVisiveis.length === 0) {

        renderizarEstado("no-results", {
            total: estado.tarefas.length
        });

        return;
    }


    renderizarTarefas(tarefasVisiveis);


    renderizarEstado("success", {

        visiveis: tarefasVisiveis.length,

        total: estado.tarefas.length
    });
}


function configurarEventos() {

    const busca = document.getElementById("busca");

    const status = document.querySelectorAll(
        'input[name="status"]'
    );

    const prioridades = document.querySelectorAll(
        'input[name="prioridade"]'
    );

    const ordenacao =
        document.getElementById("ordenacao");

    const form =
        document.getElementById("form-filtros");

    const limpar =
        document.getElementById("limpar-filtros");


    busca.addEventListener("input", function () {

        estado.busca = busca.value;

        renderizarAplicacao();
    });


    status.forEach(function (opcao) {

        opcao.addEventListener("change", function () {

            estado.status = opcao.value;

            renderizarAplicacao();
        });
    });


    prioridades.forEach(function (opcao) {

        opcao.addEventListener("change", function () {

            estado.prioridade = opcao.value;

            renderizarAplicacao();
        });
    });


    ordenacao.addEventListener("change", function () {

        estado.ordenacao = ordenacao.value;

        renderizarAplicacao();
    });


    form.addEventListener("submit", function (evento) {

        evento.preventDefault();

        renderizarAplicacao();
    });


    limpar.addEventListener("click", function () {

        estado.busca = "";

        estado.status = "todos";

        estado.prioridade = "todas";

        estado.ordenacao = "nenhuma";


        busca.value = "";

        document.getElementById("status-todos").checked = true;

        document.getElementById("prioridade-todas").checked = true;

        ordenacao.value = "nenhuma";


        renderizarAplicacao();
    });
}


async function iniciarAplicacao() {

    estado.carregamento = "carregando";

    estado.erro = null;

    renderizarAplicacao();


    try {

        const tarefas = await carregarTarefas();

        estado.tarefas = tarefas;

        estado.carregamento = "sucesso";

        estado.erro = null;

        renderizarAplicacao();

    } catch (erro) {

        estado.carregamento = "erro";

        estado.erro = erro;

        renderizarAplicacao();
    }
}


configurarEventos();

iniciarAplicacao();
