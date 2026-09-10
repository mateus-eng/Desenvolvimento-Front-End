export async function carregarTarefas() {

    const resposta = await fetch("./dados.json");

    if (!resposta.ok) {
        const erro = new Error(`Erro HTTP: ${resposta.status}`);
        erro.name = "HttpError";
        throw erro;
    }

    const dados = await resposta.json();

    if (!dados || !Array.isArray(dados.tarefas)) {
        const erro = new SyntaxError("Formato do JSON inválido.");
        throw erro;
    }

    return dados.tarefas;
}
