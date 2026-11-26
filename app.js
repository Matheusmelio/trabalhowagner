const catalog = window.GEEKMATCH_CATALOG;

const interestOptions = [
  { id: "rpg", label: "RPG", features: ["rpg", "escolhas", "historia"] },
  {
    id: "ficcao-cientifica",
    label: "Ficção científica",
    features: ["ficcao-cientifica", "espaco", "futuro", "tecnologia"],
  },
  {
    id: "fantasia",
    label: "Fantasia",
    features: ["fantasia", "magia", "mundo-fantastico", "monstros"],
  },
  {
    id: "dragon-ball",
    label: "Dragon Ball",
    features: ["anime", "acao", "aventura", "luta", "evolucao"],
  },
  {
    id: "aventura",
    label: "Aventura",
    features: ["aventura", "exploracao", "jornada"],
  },
  { id: "misterio", label: "Mistério", features: ["misterio", "sobrenatural"] },
  {
    id: "super-herois",
    label: "Super-heróis",
    features: ["super-herois", "acao", "aventura"],
  },
  {
    id: "cooperativo",
    label: "Cooperativo",
    features: ["cooperativo", "amizade", "puzzles"],
  },
  {
    id: "mundo-aberto",
    label: "Mundo aberto",
    features: ["mundo-aberto", "exploracao"],
  },
  {
    id: "estrategia",
    label: "Estratégia",
    features: ["estrategia", "escolhas"],
  },
];

const favoriteCatalogIds = [
  "dragon-ball-z",
  "naruto",
  "arcane",
  "the-witcher",
  "interstellar",
  "dune-part-two",
  "spider-verse",
  "final-fantasy-vii-rebirth",
  "baldurs-gate-3",
  "zelda-tears",
  "hades",
  "mass-effect-legendary",
  "stardew-valley",
  "persona-5-royal",
];
const formatOptions = ["Game", "Anime", "Filme", "Série"];
const featureLabels = {
  acao: "ação",
  amizade: "amizade",
  anime: "anime",
  animacao: "animação",
  aventura: "aventura",
  escolhas: "escolhas",
  cooperativo: "cooperativo",
  drama: "drama",
  espaco: "espaço",
  estrategia: "estratégia",
  evolucao: "evolução de personagens",
  familia: "família",
  fantasia: "fantasia",
  "ficcao-cientifica": "ficção científica",
  futuro: "futuro",
  game: "game",
  historia: "história",
  humor: "humor",
  luta: "luta",
  magia: "magia",
  misterio: "mistério",
  mitologia: "mitologia",
  "mundo-aberto": "mundo aberto",
  "mundo-fantastico": "mundo fantástico",
  monstros: "monstros",
  puzzles: "desafios e puzzles",
  rpg: "RPG",
  serie: "série",
  sobrenatural: "sobrenatural",
  "super-herois": "super-heróis",
  tecnologia: "tecnologia",
  "viagem-temporal": "viagem no tempo",
};

const state = {
  favorites: new Set(["dragon-ball-z"]),
  interests: new Set(["rpg", "ficcao-cientifica", "fantasia"]),
  formats: new Set(formatOptions),
};

const favoriteList = document.querySelector("#favorite-list");
const interestList = document.querySelector("#interest-list");
const formatList = document.querySelector("#format-list");
const resultList = document.querySelector("#recommendation-list");
const resultCount = document.querySelector("#results-count");
const resultTitle = document.querySelector("#results-title");
const resultSummary = document.querySelector("#results-summary");
const emptyState = document.querySelector("#empty-state");
const profileStatus = document.querySelector("#profile-status");
const recommendButton = document.querySelector("#recommend-button");

function markProfileChanged() {
  profileStatus.textContent = "Preferências alteradas. Clique para atualizar as sugestões.";
  recommendButton.querySelector(".button-label").textContent =
    "Atualizar recomendações";
}

function createFavoriteChoices() {
  const choices = favoriteCatalogIds.map((id) => {
    const item = catalog.find((entry) => entry.id === id);
    if (!item) {
      throw new Error(`Conteúdo favorito não encontrado no catálogo: ${id}`);
    }

    const label = document.createElement("label");
    label.className = "favorite-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.id;
    checkbox.checked = state.favorites.has(item.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.favorites.add(item.id);
      } else {
        state.favorites.delete(item.id);
      }
      markProfileChanged();
    });

    const name = document.createElement("span");
    name.textContent = item.title;
    const format = document.createElement("small");
    format.textContent = item.format;
    label.append(checkbox, name, format);
    return label;
  });

  favoriteList.replaceChildren(...choices);
}

function createInterestChoices() {
  const choices = interestOptions.map((interest) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "interest-chip";
    button.textContent = interest.label;
    button.dataset.interest = interest.id;
    button.setAttribute(
      "aria-pressed",
      String(state.interests.has(interest.id)),
    );
    button.addEventListener("click", () => {
      if (state.interests.has(interest.id)) {
        state.interests.delete(interest.id);
      } else {
        state.interests.add(interest.id);
      }
      button.setAttribute(
        "aria-pressed",
        String(state.interests.has(interest.id)),
      );
      markProfileChanged();
    });
    return button;
  });

  interestList.replaceChildren(...choices);
}

function createFormatChoices() {
  const choices = formatOptions.map((format) => {
    const label = document.createElement("label");
    label.className = "format-option";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = format;
    checkbox.checked = state.formats.has(format);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.formats.add(format);
      } else {
        state.formats.delete(format);
      }
      markProfileChanged();
    });
    const name = document.createElement("span");
    name.textContent = format;
    label.append(checkbox, name);
    return label;
  });

  formatList.replaceChildren(...choices);
}

function buildProfile() {
  const weights = new Map();
  for (const interest of interestOptions) {
    if (!state.interests.has(interest.id)) {
      continue;
    }

    for (const feature of interest.features) {
      weights.set(feature, (weights.get(feature) ?? 0) + 2);
    }
  }

  for (const favoriteId of state.favorites) {
    const favorite = catalog.find((item) => item.id === favoriteId);
    if (!favorite) {
      continue;
    }

    for (const feature of favorite.features) {
      weights.set(feature, (weights.get(feature) ?? 0) + 1);
    }
  }

  return weights;
}

function rankRecommendations() {
  const profile = buildProfile();
  const totalPreferenceWeight = [...profile.values()].reduce(
    (total, weight) => total + weight,
    0,
  );
  if (totalPreferenceWeight === 0 || state.formats.size === 0) {
    return [];
  }

  return catalog
    .filter(
      (item) =>
        state.formats.has(item.format) && !state.favorites.has(item.id),
    )
    .map((item) => {
      const matchedFeatures = item.features.filter((feature) =>
        profile.has(feature),
      );
      const matchedWeight = matchedFeatures.reduce(
        (total, feature) => total + profile.get(feature),
        0,
      );
      return {
        item,
        matchedFeatures,
        score: (matchedWeight / totalPreferenceWeight) * 100,
      };
    })
    .filter((recommendation) => recommendation.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.item.title.localeCompare(second.item.title, "pt-BR"),
    );
}

function getAccessOptions(item) {
  const query = encodeURIComponent(item.title);
  if (item.format === "Game") {
    const storeUrls = {
      steam: `https://store.steampowered.com/search/?term=${query}`,
      playstation: `https://store.playstation.com/pt-br/search/${query}`,
      xbox: `https://www.xbox.com/pt-BR/search?q=${query}`,
      nintendo: `https://www.nintendo.com/us/search/#q=${query}`,
    };
    const storeLabels = {
      steam: "Steam",
      playstation: "PlayStation Store",
      xbox: "Xbox Store",
      nintendo: "Nintendo Store",
    };

    return (item.stores ?? []).map((store) => ({
      label: `Buscar na ${storeLabels[store]}`,
      url: storeUrls[store],
    }));
  }

  const justWatch = {
    label: "Ver onde assistir, alugar ou comprar",
    url: `https://www.justwatch.com/br/busca?q=${query}`,
  };
  if (item.format === "Anime") {
    return [
      justWatch,
      {
        label: "Buscar na Crunchyroll",
        url: `https://www.crunchyroll.com/search?q=${query}`,
      },
    ];
  }

  return [justWatch];
}

function createRecommendationCard(recommendation) {
  const { item, matchedFeatures, score } = recommendation;
  const card = document.createElement("article");
  card.className = "recommendation-card";

  const visual = document.createElement("div");
  const visualFormat = item.format.toLowerCase().replace("é", "e");
  visual.className = `card-visual visual-${visualFormat}`;
  visual.setAttribute("aria-hidden", "true");
  const glyph = document.createElement("span");
  glyph.textContent =
    { Game: "🎮", Anime: "⚡", Filme: "🎬", "Série": "✦" }[item.format] ??
    "✦";
  visual.append(glyph);

  const content = document.createElement("div");
  content.className = "recommendation-content";
  const meta = document.createElement("div");
  meta.className = "recommendation-meta";
  const format = document.createElement("span");
  format.textContent = item.format;
  const scoreBadge = document.createElement("span");
  scoreBadge.className = "match-score";
  scoreBadge.textContent = `${Math.round(score)}% match`;
  meta.append(format, scoreBadge);

  const title = document.createElement("h3");
  title.textContent = item.title;
  const description = document.createElement("p");
  description.className = "recommendation-description";
  description.textContent = item.description;

  const genres = document.createElement("div");
  genres.className = "genre-list";
  for (const genreName of item.genres) {
    const genre = document.createElement("span");
    genre.textContent = genreName;
    genres.append(genre);
  }

  const reason = document.createElement("p");
  reason.className = "match-reason";
  const reasons = matchedFeatures.slice(0, 3).map((feature) => {
    return featureLabels[feature] ?? feature.replaceAll("-", " ");
  });
  reason.textContent = `Combina com: ${reasons.join(", ")}`;

  const accessLinks = document.createElement("div");
  accessLinks.className = "access-links";
  for (const option of getAccessOptions(item)) {
    const link = document.createElement("a");
    link.href = option.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = option.label;
    accessLinks.append(link);
  }

  content.append(meta, title, description, genres, reason, accessLinks);
  card.append(visual, content);
  return card;
}

function updateRecommendations() {
  const recommendations = rankRecommendations();
  const hasProfile = buildProfile().size > 0;
  const hasFormats = state.formats.size > 0;
  const visibleRecommendations = recommendations.slice(0, 8);
  resultList.replaceChildren(...visibleRecommendations.map(createRecommendationCard));
  resultCount.textContent = `Mostrando ${visibleRecommendations.length} de ${recommendations.length}`;

  if (!hasProfile || !hasFormats) {
    resultTitle.textContent = "Seu próximo match";
    resultSummary.textContent = "";
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = hasFormats
      ? "Vamos encontrar seu match?"
      : "Escolha pelo menos um formato";
    emptyState.querySelector("p").textContent = hasFormats
      ? "Escolha pelo menos um favorito ou interesse para personalizar as sugestões."
      : "Marque Game, Anime, Filme ou Série para ver sugestões nesse formato.";
    return;
  }

  if (recommendations.length === 0) {
    resultTitle.textContent = "Ainda sem matches";
    resultSummary.textContent =
      "Tente combinar outros interesses ou adicionar formatos para descobrir mais opções.";
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = "Amplie seu universo";
    emptyState.querySelector("p").textContent =
      "O catálogo é pequeno e ilustrativo. Marque mais temas ou formatos para encontrar outros títulos.";
    return;
  }

  resultTitle.textContent = "Seu próximo match";
  resultSummary.textContent =
    `Com base em ${state.favorites.size} favorito${state.favorites.size === 1 ? "" : "s"} ` +
    `e ${state.interests.size} interesse${state.interests.size === 1 ? "" : "s"}, ` +
    "ordenamos os títulos pela compatibilidade.";
  emptyState.hidden = true;
}

recommendButton.addEventListener("click", () => {
  updateRecommendations();
  hasGeneratedRecommendations = true;
  const visibleCount = resultList.childElementCount;
  profileStatus.textContent = visibleCount
    ? `Recomendações atualizadas: ${visibleCount} sugestões exibidas.`
    : "Perfil atualizado. Escolha um favorito ou interesse para ver sugestões.";
  recommendButton.querySelector(".button-label").textContent =
    "Atualizar recomendações";
  document.querySelector("#results-title").scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
});

document.querySelector("#reset-button").addEventListener("click", () => {
  state.favorites.clear();
  state.interests.clear();
  state.formats = new Set(formatOptions);
  createFavoriteChoices();
  createInterestChoices();
  createFormatChoices();
  updateRecommendations();
});

if (Array.isArray(catalog) && catalog.length > 0) {
  createFavoriteChoices();
  createInterestChoices();
  createFormatChoices();
  updateRecommendations();
  profileStatus.textContent =
    "Escolhas limpas. Selecione preferências e clique para recomendar.";
  recommendButton.querySelector(".button-label").textContent =
    "Encontrar recomendações";
} else {
  resultList.replaceChildren();
  emptyState.hidden = false;
  emptyState.querySelector("h3").textContent =
    "Não foi possível carregar o catálogo";
  emptyState.querySelector("p").textContent =
    "Atualize a página. Se o problema continuar, confira se catalogo.js está na mesma pasta do site.";
}
