const routes = {
  champions: `http://localhost:8080/champions`,
  ask: `http://localhost:8080/champions/ask/{id}`,
}

const apiService = {
  async getChampions(){
    const route = routes.champions;
    const response = await fetch(route);
    return await response.json();
  },
  async postAskChampion(id, message){
    const route = routes.ask.replace("{id}", id);
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({question: message})
      
    }
    const response = await fetch(route, options);
    return await response.json();
  }
}

const state = {
  values: {
    champions: [],
    idCurrentChampionSelected: "1"
  },
  views: {
    carrousel: document.getElementById("carousel-cards-content"),
    question: document.getElementById("text-request"),
    response: document.querySelector(".text-reponse"),
    avatar: document.getElementById("avatar")
  }
}

async function loadCarrousel() {
  const caroujs = (el) => {
    return $("[data-js=" + el + "]");
  };

  caroujs("timeline-carousel").slick({
    infinite: false,
    arrows: true,
    arrows: true,
    prevArrow:
      '<div class="slick-prev"> <div class="btn mr-3 btn-warning d-flex justify-content-center align-items-center"> <div>Anterior</div><svg class="ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <path d="M10.1,19.1l1.5-1.5L7,13h14.1v-2H7l4.6-4.6l-1.5-1.5L3,12L10.1,19.1z"/> </svg></div></div>',
    nextArrow:
      '<div class="slick-next"> <div class="btn btn-warning d-flex justify-content-center align-items-center"> <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M 14 4.9296875 L 12.5 6.4296875 L 17.070312 11 L 3 11 L 3 13 L 17.070312 13 L 12.5 17.570312 L 14 19.070312 L 21.070312 12 L 14 4.9296875 z"/> </svg> <div>Próximo</div></div></div>',
    dots: true,
    autoplay: false,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

async function loadChampions(){
  state.values.champions = await apiService.getChampions();
}

async function renderChampions(){
  const champions = state.values.champions;
  const elements = champions.map(champion => `
    <div class="timeline-carousel__item", onclick="onChangeChampionSelected(${champion.id}, '${champion.imageUrl}')">
        <div class="timeline-carousel__image">
          <div class="media-wrapper media-wrapper--overlay"
            style="background: url(${champion.imageUrl}) center center; background-size:cover;">
          </div>
        </div>
        <div class="timeline-carousel__item-inner">
          <span class="name">${champion.name}</span>
          <span class="role">${champion.title}</span>
          <p>${champion.lore}</p>
        </div>
      </div>`
  )
  const carrousel = state.views.carrousel;
  carrousel.innerHTML = elements.join(" "); 
}

async function onChangeChampionSelected(id, image_url){
  state.values.idCurrentChampionSelected = id
  state.views.avatar.style.backgroundImage = `url(${image_url})`
  await resetForms();
}

async function renderAvatarBoxWhenStartingPageForTheFirstTime() {
  state.views.avatar.style.backgroundImage = `url(${state.values.champions[0].imageUrl})`
  await resetForms();
}

async function getRandomQuotes(){
  const quotes = [
    "Ah, a question... Let's see what you have to say.",
    "I'm listening... Ask what you want to know.",
    "Ready to hear your next move. What will it be?",
    "Curious? Let me illuminate your thoughts.",
    "Every question deserves an answer. I'm waiting.",
    "Come on, ask your question. Time waits for no one.",
    "Questions are the beginning of great revelations.",
    "Tell me what you want to know. I'm prepared.",
    "Interested in answers? I can hardly wait to start.",
    "Your doubt will be clarified... you just need to ask.",
  ]
  const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return selectedQuote;
}

async function resetForms(){
  state.views.question.value = "";
  const quote = await getRandomQuotes();
  state.views.response.textContent = quote;
}

async function fetchAskChampion(){
  document.body.style.cursor = "wait"
  const id = state.values.idCurrentChampionSelected;
  const question = state.views.question.value;
  const result = await apiService.postAskChampion(id, question);
  state.views.response.textContent = result.answer;
  document.body.style.cursor = "default"
}

async function main(){
  await loadChampions();
  await renderAvatarBoxWhenStartingPageForTheFirstTime();
  await renderChampions();
  await loadCarrousel();
}

main();
