const API = '';

const state = {
    usuario: JSON.parse(localStorage.getItem('sgc_usuario') || 'null'),
    clientes: [],
    produtos: [],
    vendas: [],
    carrinho: []
};

const $ = (id) => document.getElementById(id);

function money(value) {
    return Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function toDatetimeLocal(date) {
    const pad = (value) => String(value).padStart(2, '0');

    const ano = date.getFullYear();
    const mes = pad(date.getMonth() + 1);
    const dia = pad(date.getDate());
    const hora = pad(date.getHours());
    const minuto = pad(date.getMinutes());

    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

function showToast(message, type = 'success') {
    const toast = $('toast');

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro na requisição.');
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

function showApp() {
    $('login-screen').classList.add('hidden');
    $('app').classList.remove('hidden');
    $('usuario-logado').textContent = state.usuario?.username || 'Usuário';
    carregarTudo();
}

function showLogin() {
    $('app').classList.add('hidden');
    $('login-screen').classList.remove('hidden');
}

function setPage(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    document.querySelectorAll('.page').forEach(section => {
        section.classList.remove('active-page');
    });

    const pageElement = $(`page-${page}`);

    if (pageElement) {
        pageElement.classList.add('active-page');
    }

    const titles = {
        dashboard: ['Dashboard', 'Resumo geral do sistema'],
        clientes: ['Clientes', 'Cadastro e listagem de clientes'],
        produtos: ['Produtos', 'Cadastro, estoque e listagem de produtos'],
        vendas: ['Vendas', 'Registro de vendas e baixa automática de estoque'],
        relatorios: ['Relatórios', 'Consultas por cliente, produto e período']
    };

    if (titles[page]) {
        $('page-title').textContent = titles[page][0];
        $('page-subtitle').textContent = titles[page][1];
    }
}

async function carregarTudo() {
    try {
        await Promise.all([
            carregarClientes(),
            carregarProdutos(),
            carregarVendas()
        ]);

        renderDashboard();
        preencherSelects();
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function carregarClientes() {
    state.clientes = await request('/clientes');
    renderClientes();
}

async function carregarProdutos() {
    state.produtos = await request('/produtos');
    renderProdutos(state.produtos);
}

async function carregarVendas() {
    state.vendas = await request('/vendas');
    renderVendas(state.vendas, 'vendas-tbody');
}

function renderDashboard() {
    const estoqueBaixo = state.produtos.filter(produto => {
        return Number(produto.quantidadeEstoque) <= Number(produto.estoqueMinimo);
    });

    if ($('total-clientes')) {
        $('total-clientes').textContent = state.clientes.length;
    }

    if ($('total-produtos')) {
        $('total-produtos').textContent = state.produtos.length;
    }

    if ($('total-vendas')) {
        $('total-vendas').textContent = state.vendas.length;
    }

    if ($('total-estoque-baixo')) {
        $('total-estoque-baixo').textContent = estoqueBaixo.length;
    }
}

function renderClientes() {
    const tbody = $('clientes-tbody');

    if (!tbody) {
        return;
    }

    tbody.innerHTML = state.clientes.map(cliente => `
        <tr>
            <td>${cliente.id}</td>
            <td>${cliente.nome || ''}</td>
            <td>${cliente.cpf || ''}</td>
            <td>${cliente.email || ''}</td>
            <td>${cliente.telefone || ''}</td>
            <td>
                <div class="row-actions">
                    <button onclick="editarCliente(${cliente.id})">Editar</button>
                    <button class="delete" onclick="excluirCliente(${cliente.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderProdutos(produtos) {
    const tbody = $('produtos-tbody');

    if (!tbody) {
        return;
    }

    tbody.innerHTML = produtos.map(produto => `
        <tr>
            <td>${produto.id}</td>
            <td>${produto.nome || ''}</td>
            <td>${produto.tipo || ''}</td>
            <td>${produto.plataforma || ''}</td>
            <td>${money(produto.preco)}</td>
            <td>${produto.quantidadeEstoque} / mín. ${produto.estoqueMinimo}</td>
            <td>
                <div class="row-actions">
                    <button onclick="editarProduto(${produto.id})">Editar</button>
                    <button class="delete" onclick="excluirProduto(${produto.id})">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderVendas(vendas, tbodyId) {
    const tbody = $(tbodyId);

    if (!tbody) {
        return;
    }

    tbody.innerHTML = vendas.map(venda => `
        <tr>
            <td>${venda.id}</td>
            <td>${venda.dataVenda ? new Date(venda.dataVenda).toLocaleString('pt-BR') : ''}</td>
            <td>${venda.cliente?.nome || ''}</td>
            <td>${venda.usuario?.username || ''}</td>
            <td>${money(venda.valorTotal)}</td>
            <td>${(venda.itens || []).map(item => `${item.quantidade}x ${item.produto?.nome || 'Produto'}`).join('<br>')}</td>
        </tr>
    `).join('');
}

function renderGraficoAnual(dados) {
    const grafico = $('grafico-anual');

    if (!grafico) {
        return;
    }

    const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const valores = meses.map((_, index) => Number(dados[index + 1] || 0));
    const maiorValor = Math.max(...valores, 1);

    grafico.innerHTML = meses.map((mes, index) => {
        const valor = valores[index];
        const largura = (valor / maiorValor) * 100;

        return `
            <div class="bar-row">
                <span class="bar-label">${mes}</span>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${largura}%"></div>
                </div>
                <span class="bar-value">${money(valor)}</span>
            </div>
        `;
    }).join('');
}

function preencherSelects() {
    const clienteOptions = state.clientes.length
        ? state.clientes.map(cliente => `<option value="${cliente.id}">${cliente.nome}</option>`).join('')
        : '<option value="">Nenhum cliente cadastrado</option>';

    if ($('venda-cliente')) {
        $('venda-cliente').innerHTML = clienteOptions;
    }

    if ($('relatorio-cliente')) {
        $('relatorio-cliente').innerHTML = clienteOptions;
    }

    const produtoOptions = state.produtos.length
        ? state.produtos.map(produto => `
            <option value="${produto.id}">
                ${produto.nome} - ${money(produto.preco)} - estoque: ${produto.quantidadeEstoque}
            </option>
        `).join('')
        : '<option value="">Nenhum produto cadastrado</option>';

    if ($('venda-produto')) {
        $('venda-produto').innerHTML = produtoOptions;
    }

    if ($('relatorio-produto')) {
        $('relatorio-produto').innerHTML = produtoOptions;
    }
}

function limparClienteForm() {
    $('cliente-id').value = '';
    $('cliente-form').reset();
}

function limparProdutoForm() {
    $('produto-id').value = '';
    $('produto-form').reset();
}

window.editarCliente = function(id) {
    const cliente = state.clientes.find(c => c.id === id);

    if (!cliente) {
        return;
    }

    $('cliente-id').value = cliente.id;
    $('cliente-nome').value = cliente.nome || '';
    $('cliente-cpf').value = cliente.cpf || '';
    $('cliente-email').value = cliente.email || '';
    $('cliente-telefone').value = cliente.telefone || '';
    $('cliente-endereco').value = cliente.endereco || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.excluirCliente = async function(id) {
    if (!confirm('Deseja excluir este cliente?')) {
        return;
    }

    try {
        await request(`/clientes/${id}`, {
            method: 'DELETE'
        });

        showToast('Cliente excluído.');
        await carregarTudo();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

window.editarProduto = function(id) {
    const produto = state.produtos.find(p => p.id === id);

    if (!produto) {
        return;
    }

    $('produto-id').value = produto.id;
    $('produto-nome').value = produto.nome || '';
    $('produto-descricao').value = produto.descricao || '';
    $('produto-preco').value = produto.preco || 0;
    $('produto-estoque').value = produto.quantidadeEstoque || 0;
    $('produto-estoque-minimo').value = produto.estoqueMinimo || 0;
    $('produto-tipo').value = produto.tipo || 'CONSOLE';
    $('produto-plataforma').value = produto.plataforma || 'PLAYSTATION';

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.excluirProduto = async function(id) {
    if (!confirm('Deseja excluir este produto?')) {
        return;
    }

    try {
        await request(`/produtos/${id}`, {
            method: 'DELETE'
        });

        showToast('Produto excluído.');
        await carregarTudo();
    } catch (error) {
        showToast(error.message, 'error');
    }
};

function renderCarrinho() {
    const tbody = $('carrinho-tbody');

    if (!tbody) {
        return;
    }

    tbody.innerHTML = state.carrinho.map((item, index) => `
        <tr>
            <td>${item.produto.nome}</td>
            <td>${item.quantidade}</td>
            <td>${money(item.produto.preco)}</td>
            <td>${money(item.subtotal)}</td>
            <td>
                <button class="delete" onclick="removerItemCarrinho(${index})">Remover</button>
            </td>
        </tr>
    `).join('');

    const total = state.carrinho.reduce((sum, item) => sum + item.subtotal, 0);

    if ($('venda-total')) {
        $('venda-total').textContent = money(total);
    }
}

window.removerItemCarrinho = function(index) {
    state.carrinho.splice(index, 1);
    renderCarrinho();
};

function setDefaultDates() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1, 0, 0);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59);

    if ($('relatorio-inicio')) {
        $('relatorio-inicio').value = toDatetimeLocal(start);
    }

    if ($('relatorio-fim')) {
        $('relatorio-fim').value = toDatetimeLocal(end);
    }

    if ($('relatorio-ano')) {
        $('relatorio-ano').value = now.getFullYear();
    }
}

function on(id, eventName, callback) {
    const element = $(id);

    if (element) {
        element.addEventListener(eventName, callback);
    }
}

function bindEvents() {
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => setPage(btn.dataset.page));
    });

    on('refresh-btn', 'click', carregarTudo);

    on('logout-btn', 'click', () => {
        localStorage.removeItem('sgc_usuario');
        state.usuario = null;
        showLogin();
    });

    on('login-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            const usuario = await request('/usuarios/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: $('login-username').value,
                    senha: $('login-senha').value
                })
            });

            state.usuario = usuario;
            localStorage.setItem('sgc_usuario', JSON.stringify(usuario));

            showToast('Login realizado.');
            showApp();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('usuario-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            await request('/usuarios', {
                method: 'POST',
                body: JSON.stringify({
                    username: $('usuario-username').value,
                    senha: $('usuario-senha').value,
                    perfil: $('usuario-perfil').value
                })
            });

            showToast('Usuário cadastrado. Agora faça login.');
            $('usuario-form').reset();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('cliente-form', 'submit', async (event) => {
        event.preventDefault();

        const id = $('cliente-id').value;

        const cliente = {
            nome: $('cliente-nome').value,
            cpf: $('cliente-cpf').value,
            email: $('cliente-email').value,
            telefone: $('cliente-telefone').value,
            endereco: $('cliente-endereco').value
        };

        try {
            await request(id ? `/clientes/${id}` : '/clientes', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(cliente)
            });

            showToast('Cliente salvo.');
            limparClienteForm();
            await carregarTudo();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('cliente-limpar', 'click', limparClienteForm);

    on('produto-form', 'submit', async (event) => {
        event.preventDefault();

        const id = $('produto-id').value;

        const produto = {
            nome: $('produto-nome').value,
            descricao: $('produto-descricao').value,
            preco: Number($('produto-preco').value),
            quantidadeEstoque: Number($('produto-estoque').value),
            estoqueMinimo: Number($('produto-estoque-minimo').value),
            tipo: $('produto-tipo').value,
            plataforma: $('produto-plataforma').value
        };

        try {
            await request(id ? `/produtos/${id}` : '/produtos', {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(produto)
            });

            showToast('Produto salvo.');
            limparProdutoForm();
            await carregarTudo();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('produto-limpar', 'click', limparProdutoForm);

    on('btn-estoque-baixo', 'click', async () => {
        try {
            const produtos = await request('/produtos/estoque-baixo');
            renderProdutos(produtos);
            showToast('Exibindo produtos com estoque baixo. Clique em Atualizar para voltar.');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('adicionar-item', 'click', () => {
        const produtoId = Number($('venda-produto').value);
        const quantidade = Number($('venda-quantidade').value);
        const produto = state.produtos.find(p => p.id === produtoId);

        if (!produto || quantidade <= 0) {
            showToast('Produto e quantidade são obrigatórios.', 'error');
            return;
        }

        if (quantidade > Number(produto.quantidadeEstoque)) {
            showToast('Quantidade maior que o estoque disponível.', 'error');
            return;
        }

        state.carrinho.push({
            produto,
            quantidade,
            subtotal: Number(produto.preco) * quantidade
        });

        renderCarrinho();
    });

    on('finalizar-venda', 'click', async () => {
        if (!state.usuario?.id) {
            showToast('Faça login novamente.', 'error');
            return;
        }

        if (!state.carrinho.length) {
            showToast('Adicione pelo menos um item.', 'error');
            return;
        }

        const venda = {
            cliente: {
                id: Number($('venda-cliente').value)
            },
            usuario: {
                id: state.usuario.id
            },
            itens: state.carrinho.map(item => ({
                produto: {
                    id: item.produto.id
                },
                quantidade: item.quantidade
            }))
        };

        try {
            await request('/vendas', {
                method: 'POST',
                body: JSON.stringify(venda)
            });

            showToast('Venda registrada.');
            state.carrinho = [];
            renderCarrinho();
            await carregarTudo();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('relatorio-periodo-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            const inicio = $('relatorio-inicio').value;
            const fim = $('relatorio-fim').value;

            const vendas = await request(
                `/relatorios/periodo?inicio=${encodeURIComponent(inicio)}&fim=${encodeURIComponent(fim)}`
            );

            renderVendas(vendas, 'relatorios-tbody');
            showToast('Relatório por período carregado.');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('relatorio-cliente-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            const clienteId = $('relatorio-cliente').value;
            const vendas = await request(`/relatorios/cliente/${clienteId}`);

            renderVendas(vendas, 'relatorios-tbody');
            showToast('Relatório por cliente carregado.');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('relatorio-produto-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            const produtoId = $('relatorio-produto').value;
            const vendas = await request(`/relatorios/produto/${produtoId}`);

            renderVendas(vendas, 'relatorios-tbody');
            showToast('Relatório por produto carregado.');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    on('relatorio-anual-form', 'submit', async (event) => {
        event.preventDefault();

        try {
            const ano = $('relatorio-ano').value;
            const dados = await request(`/relatorios/anual?ano=${ano}`);

            renderGraficoAnual(dados);
            showToast('Gráfico anual carregado.');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

bindEvents();
setDefaultDates();

if (state.usuario) {
    showApp();
} else {
    showLogin();
}