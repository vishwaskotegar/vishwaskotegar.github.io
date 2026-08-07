/*
  Ambient background — the site's signature element. Real RAG-pipeline log
  lines drift slowly upward in parallel columns, like an actual log tail
  running behind the page. Faint enough to be texture, legible enough to
  reward a closer look.
*/
(function () {
  const field = document.getElementById("log-field");
  if (!field) return;

  const LOG_POOL = [
    { tag: "embed", text: '"who are you?" → text-embedding-3-small' },
    { tag: "vector", text: "chunk_042 · dim=1536 · norm=0.98" },
    { tag: "chroma", text: 'collection="portfolio" · nearest=12ms' },
    { tag: "retrieve", text: "top_k=5 · cosine_sim=0.87" },
    { tag: "context", text: "assembling 3 passages (742 tokens)" },
    { tag: "prompt", text: "system + context + query → 1.2k tokens" },
    { tag: "generate", text: "streaming response …" },
    { tag: "index", text: "hnsw · layer=0 · ef_search=64" },
    { tag: "rerank", text: "cross-encoder · top_3 kept" },
    { tag: "cache", text: "embedding hit · saved 340ms" },
    { tag: "chunk", text: "split · 512 tokens · overlap=64" },
    { tag: "bm25", text: "lexical score=14.2 · rank=2", amber: true },
    { tag: "bm25", text: 'tf-idf · term="retrieval"', amber: true },
    { tag: "keyword", text: "exact match · boost=1.4", amber: true },
    { tag: "hybrid", text: "bm25 + cosine · alpha=0.6", amber: true },
  ];

  function shuffled(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function renderColumn(el, lines, duration) {
    const track = document.createElement("div");
    track.className = "logcol__track";
    track.style.animationDuration = duration + "s";
    track.style.animationDelay = "-" + Math.floor(Math.random() * duration) + "s";

    const html = lines
      .map((l) => `<div><b${l.amber ? ' class="amber"' : ""}>[${l.tag}]</b> ${l.text}</div>`)
      .join("");
    track.innerHTML = html + html; // duplicate for seamless loop

    el.appendChild(track);
  }

  const COLUMN_COUNT = 6;
  for (let i = 0; i < COLUMN_COUNT; i++) {
    const col = document.createElement("div");
    col.className = "logcol";
    field.appendChild(col);
    const lines = shuffled(LOG_POOL).slice(0, 9);
    renderColumn(col, lines, 15 + Math.random() * 9);
  }
})();
