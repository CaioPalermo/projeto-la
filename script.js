const inputBusca = document.getElementById('input-busca');
const btnBusca = document.getElementById('btn-busca');
const containerReceitas = document.getElementById('container-receitas');

// Função para buscar receitas na TheMealDB por termo de pesquisa
async function buscarReceitas(termo) {
  if (!termo.trim()) return;

  containerReceitas.innerHTML = '<p>Buscando receitas...</p>';

  try {
    const resposta = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termo)}`);
    const dados = await resposta.json();

    containerReceitas.innerHTML = '';

    // Se não encontrar nenhuma receita com esse nome
    if (!dados.meals) {
      containerReceitas.innerHTML = '<p>Nenhuma receita encontrada. Tente termos em inglês como "Cake", "Chocolate" ou "Pie".</p>';
      return;
    }

    // Renderiza cada receita retornada
    dados.meals.forEach(prato => {
      const card = document.createElement('div');
      card.classList.add('card-receita');

      card.innerHTML = `
        <img src="${prato.strMealThumb}" alt="${prato.strMeal}">
        <h3>${prato.strMeal}</h3>
      `;

      containerReceitas.appendChild(card);
    });

  } catch (erro) {
    containerReceitas.innerHTML = '<p>Erro ao buscar receitas. Tente novamente.</p>';
    console.error('Erro na requisição:', erro);
  }
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

// Carrega receitas de bolo padrão ("Cake") ao abrir a página
buscarReceitas('Cake');