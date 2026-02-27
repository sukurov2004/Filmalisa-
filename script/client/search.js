// search.js (simple live search for cards)
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".search");
  const clearBtn = document.querySelector(".search-add");
  const cards = Array.from(document.querySelectorAll(".grid .card"));

  if (!input || !cards.length) return;

  function normalizeText(text) {
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function filterCards() {
    const q = normalizeText(input.value);

    cards.forEach((card) => {
      const name = normalizeText(card.querySelector(".name")?.textContent);
      const tag = normalizeText(card.querySelector(".tag")?.textContent);

      const match = !q || name.includes(q) || tag.includes(q);
      card.style.display = match ? "" : "none";
    });
  }

  // live search
  input.addEventListener("input", filterCards);

  // "+" button as clear button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      filterCards();
      input.focus();
    });
  }

  // start filtered state (if input has value)
  filterCards();
});