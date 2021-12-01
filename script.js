const recipeCategories = document.querySelector(".recipes-categories");
const mealRecipe = document.querySelector(".meals-recipes");

//Calling he api to get all the meals categories
async function getMealCategories(data) {
  try {
    const URL = `https://www.themealdb.com/api/json/v1/1/${data}.php`;
    const meals = await fetch(URL);
    const mealsJson = await meals.json();
    return mealsJson;
  } catch (err) {
    console.log(err);
  }
}
//Searching for each categorie own recipes
async function categorieMeals(meal) {
  try {
    const URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`;
    const meals = await fetch(URL);
    const mealsJson = await meals.json();
    return mealsJson;
  } catch (err) {
    console.log(err);
  }
}
//Using the api data that we received to display the categories(title/image of each category)
getMealCategories("categories").then((data) => {
  data.categories.forEach((categorie) => {
    let imageSrc = categorie.strCategoryThumb;

    let div = document.createElement("div");
    div.classList.add("container");
    div.innerHTML = `
        <div class="title">
        <h2>${categorie.strCategory}</h2>
        </div>
        <div class="image-container">
        <img src="${imageSrc}"?>
        </div>
       
        `;
    recipeCategories.appendChild(div);
    //Styling each categorie container
    div.onmouseover = div.classList.add("container-hover-state");
    //Click on one of the categories to display its recipes
    div.addEventListener("click", function () {
      categorieMeals(categorie.strCategory).then((mealCategorie) => {
        checkForRecipes(mealCategorie.meals);
      });
    });
  });
});

//Displaying the recipes
function checkForRecipes(meal, e) {
  //If there are no recipes(meals===null) display modal
  if (meal === null) {
    let windowsScrollCurrentPosition = window.scrollY;
    document
      .querySelector(".modal-null-categories")
      .classList.add("modal-show");
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    recipeCategories.classList.add("filter");
    recipeCategories.style.pointerEvents = "none";
    document.querySelector("body").style.overflow = "hidden";
    //Check for click, if its outside of the modal, close it
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("modal-show")) {
        document
          .querySelector(".modal-null-categories")
          .classList.remove("modal-show");
        recipeCategories.classList.remove("filter");
        recipeCategories.style.pointerEvents = "auto";
        document.querySelector("body").style.overflow = "auto";
      }
    });
    removeModal(windowsScrollCurrentPosition);
  } else {
    changeContainer(meal);
  }
}

//Function that removes the modal
function removeModal(scrollPosition) {
  document.querySelector(".return").addEventListener("click", function (e) {
    document
      .querySelector(".modal-null-categories")
      .classList.remove("modal-show");
    window.scroll({
      top: scrollPosition,
      left: 0,
      behavior: "smooth",
    });
    recipeCategories.classList.remove("filter");
    recipeCategories.style.pointerEvents = "auto";
    document.querySelector("body").style.overflow = "auto";
  });
}

//Function that changes the container//displays the recipes
function changeContainer(meal) {
  // document.querySelector("body").removeChild(recipeCategories);
  recipeCategories.style.display = "none";
  createRecipes(meal);
}

function removeChilds(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function createRecipes(meal) {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  //Button for displaying back all the categories and hidding the selected recipes
  const goBack = document.querySelector(".go-back-button");
  goBack.style.display = "block";
  goBack.addEventListener("click", function () {
    // document.querySelector("body").removeChild(mealRecipe);
    // document.querySelector("body").appendChild(recipeCategories);
    goBack.style.display = "none";
    recipeCategories.style.display = "flex";
    recipeCategories.classList.add("recipes-animation");
    removeChilds(mealRecipe);
    mealRecipe.style.display = "none";
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
  mealRecipe.style.display = "flex";
  meal.forEach((meals) => {
    let div = document.createElement("div");
    let imgSrc = meals.strMealThumb;
    // console.log(showIngredients(meals).innerHTML);
    div.classList.add("meal-recipe-container");
    div.innerHTML = `
  <div class="recipe-container">
      <div class="recipe">
      <div class="recipe-image-title">
          <div class="recipe-title">
            <h3>${meals.strMeal}</h3>
          </div>
          <div class="recipe-image">
          <img src="${imgSrc}">
          </div>
      </div>
      <div class="recipe-text">
        <p class="area">
        This is a ${meals.strArea} meal.</p>
        <p>Meal preparation video: <a href="${
          meals.strYoutube
        }" target="_blank">${meals.strMeal}</a></p>
        ${showIngredients(meals).innerHTML}
        <div class="show-instr-div">
          <button class="show-instructions"><img src="images/down-arrow.png"</button>
        </div>
      </div>
    
    </div>
    <div class="recipe-instructions">
      ${meals.strInstructions}
    </div>
  </div>
  `;
    mealRecipe.appendChild(div);
  });
  showInstructions();
}

function showIngredients(meal) {
  let div = document.createElement("div");
  let p = document.createElement("p");
  let ingredientsArr = [];
  let ingredientsStr = "";
  for (let i = 1; i <= 20; i++) {
    let strIngredient = "strIngredient" + `${i}`;
    let strMeasure = "strMeasure" + `${i}`;
    if (!meal[strIngredient]) {
      break;
    }
    ingredientsArr.push(`${meal[strIngredient]}-${meal[strMeasure]}`);
    ingredientsStr = ingredientsArr.join("; ");
  }
  p.innerHTML = `<span class="ing-dec">Ingredients:</span> ` + ingredientsStr;
  div.appendChild(p);
  div.classList.add("ingredients");
  return div;
}

function showInstructions() {
  document.querySelectorAll(".show-instructions").forEach((button) => {
    button.addEventListener("click", function () {
      button.classList.toggle("rotate");
      let displayElement = button.parentElement;
      for (i = 0; i <= 2; i++) {
        displayElement = displayElement.parentElement;
      }
      if (button.classList.contains("rotate")) {
        displayElement.lastElementChild.style.display = "block";
      } else {
        displayElement.lastElementChild.style.display = "none";
      }
    });
  });
}
