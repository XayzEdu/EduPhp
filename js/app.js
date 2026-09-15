/* ==========================================================================
   XayzEduPhp — buku interaktif belajar PHP
   Merender halaman dari window.BOOK_PAGES (markdown + KaTeX + kode PHP)
   dengan efek buka-halaman-buku, TOC, dan syntax highlight ala VS Code.
   ========================================================================== */
(function(){
  "use strict";

  var TOTAL_META = { title: "XayzEduPhp", subtitle: "Buku Interaktif Belajar Inti Bahasa PHP" };

  function getPages(){
    var pages = (window.BOOK_PAGES || []).slice().sort(function(a,b){ return a.id - b.id; });
    return pages;
  }

  /* --------------------------------------------------- markdown renderer */
  function buildRenderer(){
    var renderer = new marked.Renderer();

    renderer.code = function(code, infostring){
      var parts = (infostring || "").trim().split(/\s+/);
      var lang = parts[0] || "text";
      var titleMatch = (infostring || "").match(/title=([^\s]+)/);
      var filename = titleMatch ? titleMatch[1] : null;

      if (lang === "output"){
        return (
          '<div class="output-window">' +
            '<div class="code-titlebar">' +
              '<span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
              '<span class="filename">' + (filename || "Output") + '</span>' +
            '</div>' +
            '<pre>' + escapeHtml(code) + '</pre>' +
          '</div>'
        );
      }

      var grammarLang = lang.split(":")[0];
      var prismLang = Prism.languages[grammarLang] ? grammarLang : "markup";
      var highlighted = Prism.highlight(code, Prism.languages[prismLang], prismLang);

      return (
        '<div class="code-window">' +
          '<div class="code-titlebar">' +
            '<span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
            '<span class="filename">' + (filename || (grammarLang + " — contoh")) + '</span>' +
          '</div>' +
          '<pre><code class="language-' + grammarLang + '">' + highlighted + '</code></pre>' +
        '</div>'
      );
    };

    return renderer;
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  marked.setOptions({ renderer: buildRenderer(), breaks: false, gfm: true });

  /* ---------------------------------------------------------- callouts -- */
  function transformCallouts(html){
    // > [!TIP] ... / > [!WARN] ...  -> styled callout boxes
    return html
      .replace(/<blockquote>\s*<p>\[!TIP\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/g,
        '<div class="callout tip">💡 $1</div>')
      .replace(/<blockquote>\s*<p>\[!WARN\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/g,
        '<div class="callout warn">⚠️ $1</div>');
  }

  /* --------------------------------------------------------------- state */
  var pages = [];
  var current = 1; // 0 = cover
  var animating = false;

  var $ = function(sel){ return document.querySelector(sel); };

  var leafStage = null, leafFooter = null;

  function renderLeafContent(container, page){
    if (page.isCover){
      container.className = "leaf cover";
      container.innerHTML =
        '<div class="cover-mark">&lt;?php // mulai belajar ?&gt;</div>' +
        '<h1>' + TOTAL_META.title + '</h1>' +
        '<p class="sub">' + TOTAL_META.subtitle + '</p>' +
        '<div class="cover-meta">' + pages.length + ' Halaman &middot; Konsep, Database &amp; Latihan Interaktif</div>';
      return;
    }
    container.className = "leaf curl-right";
    var html = marked.parse(page.md);
    html = transformCallouts(html);
    container.innerHTML =
      '<div class="kicker">' + page.part + '</div>' +
      '<h1 class="page-title">' + page.title + '</h1>' +
      '<div class="prose">' + html + '</div>' +
      '<div class="leaf-footer">' +
        '<span>' + TOTAL_META.title + '</span>' +
        '<span class="page-num">Hal. ' + String(page.id).padStart(2,"0") + ' / ' + pages.length + '</span>' +
      '</div>';

    if (window.Prism) Prism.highlightAllUnder(container);
    if (window.renderMathInElement){
      renderMathInElement(container, {
        delimiters: [
          {left:"$$", right:"$$", display:true},
          {left:"$", right:"$", display:false}
        ],
        throwOnError:false
      });
    }
    if (page.exercise && window.XayzExercise){
      var exHost = container.querySelector(".prose");
      if (exHost) window.XayzExercise.mount(exHost, page.exercise, page.id);
    }
  }

  function pageById(id){
    if (id === 0) return { isCover:true };
    return pages.find(function(p){ return p.id === id; });
  }

  function renderCurrent(){
    leafStage.innerHTML = "";
    var leaf = document.createElement("div");
    leafStage.appendChild(leaf);
    renderLeafContent(leaf, pageById(current));
    updateChrome();
  }

  function updateChrome(){
    var total = pages.length;
    $("#prevBtn").disabled = current <= 0;
    $("#nextBtn").disabled = current >= total;
    $("#pageInput").value = current;
    $("#pageInput").max = total;
    var totalLabel = $("#pageTotalLabel");
    if (totalLabel) totalLabel.textContent = "/ " + total;
    var pct = Math.max(2, Math.round((current/total)*100));
    $("#progressBar").style.width = pct + "%";
    document.querySelectorAll(".toc-item").forEach(function(el){
      el.classList.toggle("active", parseInt(el.dataset.id,10) === current);
    });
    if (history.replaceState) history.replaceState(null, "", "#p" + current);
  }

  function flipTo(newId, direction){
    if (animating) return;
    var total = pages.length;
    if (newId < 0 || newId > total) return;
    animating = true;

    var outLeaf = leafStage.querySelector(".leaf");
    var outClass = direction === "next" ? "anim-out" : "anim-out-rev";
    var inClass  = direction === "next" ? "anim-in"  : "anim-in-rev";

    if (outLeaf){ outLeaf.classList.add(outClass); }

    setTimeout(function(){
      current = newId;
      leafStage.innerHTML = "";
      var leaf = document.createElement("div");
      leafStage.appendChild(leaf);
      renderLeafContent(leaf, pageById(current));
      leaf.classList.add(inClass);
      updateChrome();
      setTimeout(function(){
        leaf.classList.remove(inClass);
        animating = false;
      }, 330);
    }, 300);
  }

  /* ------------------------------------------------------------------ TOC */
  function buildTOC(){
    var list = $("#tocList");
    var parts = {};
    pages.forEach(function(p){
      parts[p.part] = parts[p.part] || [];
      parts[p.part].push(p);
    });
    var html = "";
    Object.keys(parts).forEach(function(partName){
      html += '<div class="toc-part">' + partName + '</div>';
      parts[partName].forEach(function(p){
        html += '<button class="toc-item" data-id="' + p.id + '">' +
          '<span class="n">' + String(p.id).padStart(2,"0") + '</span>' +
          '<span>' + p.title + '</span></button>';
      });
    });
    list.innerHTML = html;
    list.addEventListener("click", function(e){
      var btn = e.target.closest(".toc-item");
      if (!btn) return;
      var id = parseInt(btn.dataset.id, 10);
      closeTOC();
      if (id !== current){
        animating = false;
        current = id;
        renderCurrent();
      }
    });
  }

  function openTOC(){
    $("#tocDrawer").classList.add("open");
    $("#tocScrim").classList.add("open");
  }
  function closeTOC(){
    $("#tocDrawer").classList.remove("open");
    $("#tocScrim").classList.remove("open");
  }

  /* ----------------------------------------------------------------- init */
  function init(){
    pages = getPages();
    leafStage = $("#leafStage");

    var hashMatch = location.hash.match(/p(\d+)/);
    if (hashMatch){
      var n = parseInt(hashMatch[1],10);
      if (n >= 0 && n <= pages.length) current = n;
    }

    buildTOC();
    renderCurrent();

    $("#nextBtn").addEventListener("click", function(){ flipTo(current+1, "next"); });
    $("#prevBtn").addEventListener("click", function(){ flipTo(current-1, "prev"); });
    $("#pageInput").addEventListener("change", function(e){
      var v = parseInt(e.target.value,10);
      if (!isNaN(v)) flipTo(v, v > current ? "next" : "prev");
    });
    $("#tocToggle").addEventListener("click", openTOC);
    $("#tocScrim").addEventListener("click", closeTOC);
    $("#tocSearch").addEventListener("input", function(e){
      var q = e.target.value.toLowerCase();
      document.querySelectorAll(".toc-item").forEach(function(el){
        el.style.display = el.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none";
      });
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "ArrowRight") flipTo(current+1, "next");
      if (e.key === "ArrowLeft") flipTo(current-1, "prev");
      if (e.key === "Escape") closeTOC();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
