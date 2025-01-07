let historicoVisivel = false;

function calcularImpostos(valor, percentual) {
    return (valor * percentual) / 100;
}

function gerarNotaFiscal() {
    const valorVenda = parseFloat(document.getElementById('valorVenda').value);
    const itens = document.getElementById('itens').value;
    const irpf = parseFloat(document.getElementById('irpf').value);
    const pis = parseFloat(document.getElementById('pis').value);
    const cofins = parseFloat(document.getElementById('cofins').value);
    const inss = parseFloat(document.getElementById('inss').value);
    const issqn = parseFloat(document.getElementById('issqn').value);

    if (isNaN(valorVenda) || isNaN(irpf) || isNaN(pis) || isNaN(cofins) || isNaN(inss) || isNaN(issqn)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const impostos = {
        IRPF: calcularImpostos(valorVenda, irpf),
        PIS: calcularImpostos(valorVenda, pis),
        COFINS: calcularImpostos(valorVenda, cofins),
        INSS: calcularImpostos(valorVenda, inss),
        ISSQN: calcularImpostos(valorVenda, issqn),
    };

    const totalImpostos = Object.values(impostos).reduce((acc, curr) => acc + curr, 0);
    const valorLiquido = valorVenda - totalImpostos;

    const nfse = {
        itens,
        valorVenda,
        impostos,
        totalImpostos,
        valorLiquido
    };

    salvarNoHistorico(nfse);

    const nfseDiv = document.getElementById('nfse');
    nfseDiv.style.display = 'block';
    nfseDiv.innerHTML = `
        <h2>Nota Fiscal de Serviço</h2>
        <p><strong>Itens Vendidos:</strong> ${itens}</p>
        <p><strong>Valor da Venda:</strong> R$ ${valorVenda.toFixed(2)}</p>
        <h3>Impostos:</h3>
        <ul>
            <li>IRPF: R$ ${impostos.IRPF.toFixed(2)}</li>
            <li>PIS: R$ ${impostos.PIS.toFixed(2)}</li>
            <li>COFINS: R$ ${impostos.COFINS.toFixed(2)}</li>
            <li>INSS: R$ ${impostos.INSS.toFixed(2)}</li>
            <li>ISSQN: R$ ${impostos.ISSQN.toFixed(2)}</li>
        </ul>
        <p><strong>Total de Impostos:</strong> R$ ${totalImpostos.toFixed(2)}</p>
        <p><strong>Valor Líquido:</strong> R$ ${valorLiquido.toFixed(2)}</p>
    `;
}

function salvarNoHistorico(nfse) {
    let historico = JSON.parse(localStorage.getItem('historicoNFSe')) || [];
    historico.push(nfse);
    localStorage.setItem('historicoNFSe', JSON.stringify(historico));
}

function toggleHistorico() {
    historicoVisivel = !historicoVisivel;
    const formContainer = document.getElementById('form-container');
    const historicoDiv = document.getElementById('historico');
    const toggleButton = document.getElementById('toggleHistoricoButton');

    if (historicoVisivel) {
        formContainer.classList.add('hidden');
        historicoDiv.classList.add('visible');
        carregarHistorico();
        toggleButton.innerText = 'Fechar Histórico';
    } else {
        formContainer.classList.remove('hidden');
        historicoDiv.classList.remove('visible');
        toggleButton.innerText = 'Abrir Histórico';
    }
}

function carregarHistorico() {
    const historicoList = document.getElementById('historico-list');
    const historico = JSON.parse(localStorage.getItem('historicoNFSe')) || [];

    historicoList.innerHTML = '';
    historico.forEach((nfse, index) => {
        const nfseHtml = `
            <div class="history-item" id="history-item-${index}">
                <h3 onclick="toggleDetalhes(${index})">Nota Fiscal ${index + 1}</h3>
                <div class="detalhes">
                    <p><strong>Itens Vendidos:</strong> ${nfse.itens}</p>
                    <p><strong>Valor da Venda:</strong> R$ ${nfse.valorVenda.toFixed(2)}</p>
                    <h4>Impostos:</h4>
                    <ul>
                        <li>IRPF: R$ ${nfse.impostos.IRPF.toFixed(2)}</li>
                        <li>PIS: R$ ${nfse.impostos.PIS.toFixed(2)}</li>
                        <li>COFINS: R$ ${nfse.impostos.COFINS.toFixed(2)}</li>
                        <li>INSS: R$ ${nfse.impostos.INSS.toFixed(2)}</li>
                        <li>ISSQN: R$ ${nfse.impostos.ISSQN.toFixed(2)}</li>
                    </ul>
                    <p><strong>Total de Impostos:</strong> R$ ${nfse.totalImpostos.toFixed(2)}</p>
                    <p><strong>Valor Líquido:</strong> R$ ${nfse.valorLiquido.toFixed(2)}</p>
                    <button onclick="excluirNotaFiscal(${index})">Excluir</button>
                </div>
            </div>
        `;
        historicoList.innerHTML += nfseHtml;
    });
}

function toggleDetalhes(index) {
    const historyItem = document.getElementById(`history-item-${index}`);
    historyItem.classList.toggle('open');
}

function excluirNotaFiscal(index) {
    let historico = JSON.parse(localStorage.getItem('historicoNFSe')) || [];
    historico.splice(index, 1);
    localStorage.setItem('historicoNFSe', JSON.stringify(historico));
    carregarHistorico();
}