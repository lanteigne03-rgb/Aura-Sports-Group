/* AURA SPORTS GROUP — news tiles + pagination
   Renders the article list from js/news-data.js (load that file first).

   Any element with  data-news-list  becomes a tile grid:
     data-limit="3"        show at most this many (newest first)
     data-paginate         split into pages of `data-limit`, with page
                           links underneath (in the element whose id is
                           given by data-pager="…"). Page comes from ?page=N.
*/
(function () {
  "use strict";

  var ALL = (window.AURA_NEWS || []).slice();

  // Newest first; articles with the same date keep the order they were listed in.
  ALL = ALL
    .map(function (a, i) { return { a: a, i: i }; })
    .sort(function (x, y) {
      var dx = x.a.date || "", dy = y.a.date || "";
      return dx < dy ? 1 : dx > dy ? -1 : x.i - y.i;
    })
    .map(function (o) { return o.a; });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function tile(a) {
    var link = el("a", "card-article");
    link.href = a.url;
    link.target = "_blank";
    link.rel = "noopener";

    var thumb = el("div", "thumb");
    if (a.image) {
      var img = el("img");
      img.src = a.image;
      img.alt = a.alt || "";
      img.loading = "lazy";
      if (a.imagePosition) img.style.objectPosition = a.imagePosition;
      thumb.appendChild(img);
    }
    link.appendChild(thumb);

    var body = el("div", "body");
    body.appendChild(el("span", "pub", (a.publication || "").toUpperCase()));
    body.appendChild(el("h3", null, a.title));
    link.appendChild(body);
    return link;
  }

  function pageHref(n) {
    return n <= 1 ? location.pathname : location.pathname + "?page=" + n;
  }

  function pagerLink(label, n, opts) {
    opts = opts || {};
    var node;
    if (opts.disabled) {
      node = el("span", "pager-link is-disabled", label);
      node.setAttribute("aria-disabled", "true");
    } else {
      node = el("a", "pager-link", label);
      node.href = pageHref(n);
    }
    if (opts.current) {
      node.classList.add("is-current");
      node.setAttribute("aria-current", "page");
    }
    if (opts.aria) node.setAttribute("aria-label", opts.aria);
    return node;
  }

  function renderPager(host, page, pages) {
    host.textContent = "";
    if (pages <= 1) return;
    host.appendChild(pagerLink("Prev", page - 1, { disabled: page <= 1, aria: "Previous page" }));
    for (var n = 1; n <= pages; n++) {
      host.appendChild(pagerLink(String(n), n, { current: n === page, aria: "Page " + n }));
    }
    host.appendChild(pagerLink("Next", page + 1, { disabled: page >= pages, aria: "Next page" }));
  }

  function currentPage() {
    var m = /[?&]page=(\d+)/.exec(location.search);
    return m ? Math.max(1, parseInt(m[1], 10)) : 1;
  }

  function init() {
    document.querySelectorAll("[data-news-list]").forEach(function (list) {
      var limit = parseInt(list.getAttribute("data-limit"), 10) || ALL.length;
      var paginate = list.hasAttribute("data-paginate");
      var pages = Math.max(1, Math.ceil(ALL.length / limit));
      var page = paginate ? Math.min(currentPage(), pages) : 1;
      var start = paginate ? (page - 1) * limit : 0;

      list.textContent = "";
      var slice = ALL.slice(start, start + limit);
      if (!slice.length) {
        list.appendChild(el("p", "news-empty", "No news to show yet."));
      }
      slice.forEach(function (a) { list.appendChild(tile(a)); });

      if (paginate) {
        var host = document.getElementById(list.getAttribute("data-pager"));
        if (host) renderPager(host, page, pages);
        if (page > 1) document.title = document.title + " (Page " + page + ")";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
