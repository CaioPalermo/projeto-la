const inputBusca = document.getElementById('input-busca');
const btnBusca = document.getElementById('btn-busca');
const containerReceitas = document.getElementById('container-receitas');

// Função para buscar receitas na TheMealDB por termo de pesquisa
async function buscarReceitas(termo) {
  if (!termo || !termo.trim()) {
    containerReceitas.innerHTML = '<p style="color: #777;">Digite um termo em inglês (ex: "Cake", "Chocolate","Pie", "Cookies" ou "Squares") e clique em Pesquisar.</p>';
    return;
  }

  containerReceitas.innerHTML = '<p>Buscando receitas...</p>';

  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termo.trim())}`;
    const resposta = await fetch(url);
    
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();

    containerReceitas.innerHTML = '';

    // Se não encontrar nenhuma receita com esse nome
    if (!dados.meals) {
      containerReceitas.innerHTML = '<p>Nenhuma receita encontrada. Tente termos em inglês como "Cake", "Chocolate","Pie", "Cookies" ou "Squares".</p>';
      return;
    }

    // Renderiza cada receita retornada
    dados.meals.forEach(prato => {
      const card = document.createElement('div');
      card.classList.add('card-receita');
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <img src="${prato.strMealThumb}" alt="${prato.strMeal}">
        <h3>${prato.strMeal}</h3>
      `;

      // Ao clicar, exibe os ingredientes e modo de preparo
      card.addEventListener('click', () => {
        exibirReceitaCompleta(prato);
      });

      containerReceitas.appendChild(card);
    });

  } catch (erro) {
    containerReceitas.innerHTML = '<p style="color: #c62828;">Erro ao buscar receitas. Se estiver abrindo o HTML direto do computador, tente usar um servidor local (Live Server) ou verifique sua conexão.</p>';
    console.error('Erro na requisição:', erro);
  }
}

// Exibe a receita completa num alert ao clicar no card
function exibirReceitaCompleta(prato) {
  let ingredientes = [];

  for (let i = 1; i <= 20; i++) {
    const ingrediente = prato[`strIngredient${i}`];
    const medida = prato[`strMeasure${i}`];

    if (ingrediente && ingrediente.trim() !== '') {
      ingredientes.push(`${ingrediente} (${medida || ''})`);
    }
  }

  alert(`
📖 RECEITA: ${prato.strMeal}

🛒 INGREDIENTES:
- ${ingredientes.join('\n- ')}

👨‍🍳 MODO DE PREPARO:
${prato.strInstructions}
  `);
}

// Evento ao clicar no botão
btnBusca.addEventListener('click', () => {
  buscarReceitas(inputBusca.value);
});

// Evento ao apertar "Enter" no campo de texto
inputBusca.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    buscarReceitas(inputBusca.value);
  }
});

// Mensagem inicial simples sem requisição automática para não travar
containerReceitas.innerHTML = '<p style="color: #666;">Digite uma receita em inglês acima (ex: "Cake", "Chocolate","Pie", "Cookies" ou "Squares") e clique em Pesquisar!</p>';