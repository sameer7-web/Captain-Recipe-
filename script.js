const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to fetch recipes from the API
const fetchRecipes = async (query) => {
    // Clear previous content and show loading message
    recipeContainer.innerHTML = "<h2 class='loading-message'>Fetching delicious recipes...</h2>";
    recipeContainer.classList.add('loading'); // Add a class for potential loading animations

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        // Clear loading message
        recipeContainer.innerHTML = "";
        recipeContainer.classList.remove('loading');

        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="recipe-content">
                        <h3>${meal.strMeal}</h3>
                        <p><span>${meal.strArea}</span> Dish</p>
                        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                        <button type="button">View Recipe</button>
                    </div>
                `;
                const button = recipeDiv.querySelector('button'); // Select the button within this recipeDiv
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            // Display "Recipe not found" message
            recipeContainer.innerHTML = `
                <h2 class="not-found-message">Oops! No recipes found for "${query}".</h2>
                <p class="search-info">Try searching for a different ingredient or dish.</p>
            `;
        }
    } catch (error) {
        // Handle API errors gracefully
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = `
            <h2 class="error-message">Failed to fetch recipes. Please try again later.</h2>
            <p class="search-info">It might be a network issue or an API problem.</p>
        `;
    }
}

// Function to extract ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) { // Max 20 possible ingredients
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            // Stop if there are no more ingredients
            break;
        }
    }
    return ingredientsList;
}

// Function to open the recipe details popup
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p class="recipeInstructions">${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block"; // Show the modal
}

// Event listener for closing the recipe popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none"; // Hide the modal
});

// Event listener for the search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    const searchInput = searchBox.value.trim(); // Get search input and remove whitespace
    if (searchInput) { // Only fetch if input is not empty
        fetchRecipes(searchInput);
    } else {
        // Optionally, show a message if search box is empty
        recipeContainer.innerHTML = `
            <h2 class="search-info">Please enter an ingredient or dish name to search.</h2>
            <p class="search-info">e.g., "Chicken", "Pasta", "Pizza".</p>
        `;
    }
});
