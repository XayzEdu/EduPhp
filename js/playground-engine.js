/* ==========================================================================
   XayzEduPhp — Playground Engine
   Eksekusi kode PHP & SQL SUNGGUHAN, 100% di browser (WebAssembly),
   tanpa server backend, tanpa API key, tanpa batas request.
     - PHP  : php-wasm  (https://github.com/seanmorris/php-wasm)
     - SQL  : sql.js     (https://github.com/sql-js/sql.js)
   ========================================================================== */
(function(){
  "use strict";

  /* --------------------------------------------------------- PHP runtime */
  var phpReadyPromise = null;
  function getPhp(){
    if (!phpReadyPromise){
      phpReadyPromise = (async function(){
        var mod = await import('https://cdn.jsdelivr.net/npm/php-wasm/PhpWeb.mjs');
        var php = new mod.PhpWeb();
        await new Promise(function(resolve){
          php.addEventListener('ready', function once(){
            php.removeEventListener('ready', once);
            resolve();
          });
        });
        return php;
      })();
    }
    return phpReadyPromise;
  }

  async function runPhp(code){
    var php = await getPhp();
    var stdout = "", stderr = "";
    function onOut(e){ stdout += e.detail; }
    function onErr(e){ stderr += e.detail; }
    php.addEventListener('output', onOut);
    php.addEventListener('error', onErr);
    try {
      await php.run(code);
    } catch (e) {
      stderr += "\n" + (e && e.message ? e.message : String(e));
    } finally {
      php.removeEventListener('output', onOut);
      php.removeEventListener('error', onErr);
    }
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  /* --------------------------------------------------------- SQL runtime */
  var sqlReadyPromise = null;
  function getSql(){
    if (!sqlReadyPromise){
      sqlReadyPromise = window.initSqlJs({
        locateFile: function(f){ return "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + f; }
      });
    }
    return sqlReadyPromise;
  }

  async function runSql(code, seedSql){
    var SQL = await getSql();
    var db = new SQL.Database();
    var stdout = "", stderr = "";
    try {
      if (seedSql) db.run(seedSql);
      var statements = code.split(";").map(function(s){ return s.trim(); }).filter(Boolean);
      var produced = false;
      for (var i = 0; i < statements.length; i++){
        var res = db.exec(statements[i]);
        if (res && res.length){
          produced = true;
          res.forEach(function(r){
            stdout += r.columns.join(" | ") + "\n";
            stdout += r.columns.map(function(){ return "----------"; }).join("-|-") + "\n";
            r.values.forEach(function(row){
              stdout += row.join(" | ") + "\n";
            });
            stdout += "\n";
          });
        }
      }
      if (!produced) stdout = "(Query berhasil dijalankan. Tidak ada baris data yang dikembalikan.)";
    } catch (e) {
      stderr = e && e.message ? e.message : String(e);
    } finally {
      db.close();
    }
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  }

  window.XayzPlayground = { runPhp: runPhp, runSql: runSql };
})();
