/* ==========================================================================
   XayzEduPhp — Latihan Interaktif (Exercise Widget)
   Kode acak + ada bagian hilang -> disusun ulang oleh pengguna -> dijalankan
   dengan mesin PHP/SQL sungguhan -> dicocokkan dengan hasil yang diharapkan.
   ========================================================================== */
(function(){
  "use strict";

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function escapeHtml(str){
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function normalize(str){
    return String(str || "").replace(/\r\n/g, "\n").split("\n").map(function(l){ return l.trim(); }).join("\n").trim();
  }

  /* ------------------------------------------------------------- modal -- */
  function showResultModal(success, title, message){
    var old = document.getElementById("xayzModal");
    if (old) old.remove();

    var overlay = document.createElement("div");
    overlay.id = "xayzModal";
    overlay.className = "xayz-modal-overlay";
    overlay.innerHTML =
      '<div class="xayz-modal-box ' + (success ? "is-success" : "is-fail") + '">' +
        '<div class="xayz-modal-icon">' + (success ? "&#10003;" : "&#10007;") + '</div>' +
        '<h3>' + escapeHtml(title) + '</h3>' +
        '<p>' + escapeHtml(message) + '</p>' +
        '<button class="xayz-modal-close">Tutup</button>' +
      '</div>';
    document.body.appendChild(overlay);

    function close(){ overlay.remove(); }
    overlay.addEventListener("click", function(e){ if (e.target === overlay) close(); });
    overlay.querySelector(".xayz-modal-close").addEventListener("click", close);
    requestAnimationFrame(function(){ overlay.classList.add("open"); });
  }

  /* --------------------------------------------------------- exercise --- */
  function mountExercise(container, ex, pageId){
    var lines = ex.lines;
    var blankIndex = ex.blankIndex;
    var slotValues = lines.map(function(_, i){ return i === blankIndex ? "" : null; });
    var bank = shuffle(
      lines.map(function(text, i){ return { text: text, idx: i }; })
           .filter(function(item){ return item.idx !== blankIndex; })
    );

    var wrap = document.createElement("div");
    wrap.className = "exercise-box";
    container.appendChild(wrap);

    function assembledCode(){
      return (ex.wrapperBefore || "") + slotValues.map(function(v){ return v === null ? "" : v; }).join("\n") + (ex.wrapperAfter || "");
    }

    function allFilled(){
      return slotValues.every(function(v){ return v !== null && String(v).trim() !== ""; });
    }

    function render(){
      var slotsHtml = slotValues.map(function(v, i){
        if (i === blankIndex){
          return '<div class="exline exline-blank">' +
            '<span class="exline-no">' + (i+1) + '</span>' +
            '<input type="text" class="exline-input" data-slot="' + i + '" placeholder="ketik baris kode yang hilang di sini…" value="' + escapeHtml(v || "") + '">' +
          '</div>';
        }
        if (v === null){
          return '<div class="exline exline-empty" data-slot="' + i + '">' +
            '<span class="exline-no">' + (i+1) + '</span>' +
            '<span class="exline-placeholder">klik salah satu potongan kode di bawah…</span>' +
          '</div>';
        }
        return '<div class="exline exline-filled" data-slot="' + i + '" title="Klik untuk membatalkan">' +
          '<span class="exline-no">' + (i+1) + '</span>' +
          '<code>' + escapeHtml(v) + '</code>' +
          '<span class="exline-remove">&times;</span>' +
        '</div>';
      }).join("");

      var bankHtml = bank.map(function(item, bi){
        return '<button type="button" class="bank-chip" data-bank-index="' + bi + '">' + escapeHtml(item.text) + '</button>';
      }).join("");

      wrap.innerHTML =
        '<div class="exercise-instructions">' +
          '<span class="ex-badge">Latihan Interaktif</span> ' + (ex.instruksi || "Susun dan lengkapi kode berikut.") +
        '</div>' +
        '<div class="exercise-slots">' + slotsHtml + '</div>' +
        (bank.length ? '<div class="exercise-bank"><div class="bank-label">Potongan kode (klik untuk menyusun):</div><div class="bank-chips">' + bankHtml + '</div></div>' : '') +
        '<div class="exercise-toolbar">' +
          '<button type="button" class="ex-btn ex-btn-primary" data-act="run">▶ Jalankan</button>' +
          '<button type="button" class="ex-btn" data-act="expected">Hasil yang Diharapkan</button>' +
          '<button type="button" class="ex-btn" data-act="solution">Solusi</button>' +
          '<button type="button" class="ex-btn ex-btn-ghost" data-act="reset">↺ Atur Ulang</button>' +
        '</div>' +
        '<div class="exercise-expected" hidden></div>' +
        '<div class="exercise-solution" hidden></div>' +
        '<div class="exercise-result" hidden></div>';

      wrap.querySelectorAll(".exline-filled").forEach(function(el){
        el.addEventListener("click", function(){
          var i = parseInt(el.dataset.slot, 10);
          bank.push({ text: slotValues[i], idx: i });
          slotValues[i] = null;
          render();
        });
      });
      wrap.querySelectorAll(".bank-chip").forEach(function(btn){
        btn.addEventListener("click", function(){
          var bi = parseInt(btn.dataset.bankIndex, 10);
          var firstEmpty = slotValues.findIndex(function(v, i){ return i !== blankIndex && v === null; });
          if (firstEmpty === -1) return;
          slotValues[firstEmpty] = bank[bi].text;
          bank.splice(bi, 1);
          render();
        });
      });
      var input = wrap.querySelector(".exline-input");
      if (input){
        input.addEventListener("input", function(){
          slotValues[blankIndex] = input.value;
        });
      }

      wrap.querySelector('[data-act="run"]').addEventListener("click", onRun);
      wrap.querySelector('[data-act="reset"]').addEventListener("click", onReset);
      wrap.querySelector('[data-act="solution"]').addEventListener("click", onToggleSolution);
      wrap.querySelector('[data-act="expected"]').addEventListener("click", onToggleExpected);
    }

    async function onRun(){
      var resultBox = wrap.querySelector(".exercise-result");
      if (!allFilled()){
        resultBox.hidden = false;
        resultBox.innerHTML = '<div class="callout warn">⚠️ Lengkapi dulu semua baris (isi bagian yang kosong &amp; susun semua potongan kode) sebelum menjalankan.</div>';
        return;
      }
      var runBtn = wrap.querySelector('[data-act="run"]');
      runBtn.disabled = true;
      runBtn.textContent = "Menjalankan…";
      resultBox.hidden = false;
      resultBox.innerHTML = '<div class="output-window"><div class="code-titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="filename">Output</span></div><pre>Menjalankan kode sungguhan di browser (WebAssembly)…</pre></div>';

      try {
        var code = assembledCode();
        var res = ex.runtime === "sql"
          ? await window.XayzPlayground.runSql(code, ex.seedSql)
          : await window.XayzPlayground.runPhp(code);

        var outText = res.stdout || "(tidak ada output)";
        var errHtml = res.stderr ? '<div class="callout warn">⚠️ ' + escapeHtml(res.stderr) + '</div>' : '';

        resultBox.innerHTML =
          '<div class="output-window"><div class="code-titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="filename">Output</span></div><pre>' + escapeHtml(outText) + '</pre></div>' +
          errHtml;

        var isCorrect = !res.stderr && normalize(res.stdout) === normalize(ex.expectedOutput);
        showResultModal(
          isCorrect,
          isCorrect ? "Benar! 🎉" : "Belum Tepat",
          isCorrect
            ? "Hasil kode kamu sudah sesuai dengan yang diharapkan. Lanjut ke halaman berikutnya!"
            : "Output belum sama dengan hasil yang diharapkan. Periksa urutan baris & bagian yang kamu isi, lalu coba lagi."
        );
      } catch (e) {
        resultBox.innerHTML = '<div class="callout warn">⚠️ Gagal menjalankan: ' + escapeHtml(e && e.message ? e.message : String(e)) + '</div>';
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = "▶ Jalankan";
      }
    }

    function onReset(){
      slotValues = lines.map(function(_, i){ return i === blankIndex ? "" : null; });
      bank = shuffle(
        lines.map(function(text, i){ return { text: text, idx: i }; })
             .filter(function(item){ return item.idx !== blankIndex; })
      );
      render();
    }

    function onToggleSolution(){
      var box = wrap.querySelector(".exercise-solution");
      var btn = wrap.querySelector('[data-act="solution"]');
      var willShow = box.hidden;
      box.hidden = !willShow;
      btn.textContent = willShow ? "Sembunyikan Solusi" : "Solusi";
      if (willShow){
        var full = (ex.wrapperBefore || "") + lines.join("\n") + (ex.wrapperAfter || "");
        var prismLang = ex.runtime === "sql" ? "sql" : "php";
        var highlighted = (window.Prism && Prism.languages[prismLang]) ? Prism.highlight(full, Prism.languages[prismLang], prismLang) : escapeHtml(full);
        box.innerHTML = '<div class="code-window"><div class="code-titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="filename">Solusi</span></div><pre><code class="language-' + prismLang + '">' + highlighted + '</code></pre></div>';
      }
    }

    function onToggleExpected(){
      var box = wrap.querySelector(".exercise-expected");
      var btn = wrap.querySelector('[data-act="expected"]');
      var willShow = box.hidden;
      box.hidden = !willShow;
      btn.textContent = willShow ? "Sembunyikan Ekspektasi" : "Hasil yang Diharapkan";
      if (willShow){
        box.innerHTML = '<div class="output-window"><div class="code-titlebar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span><span class="filename">Hasil yang Diharapkan</span></div><pre>' + escapeHtml(ex.expectedOutput) + '</pre></div>';
      }
    }

    render();
  }

  window.XayzExercise = { mount: mountExercise };
})();
