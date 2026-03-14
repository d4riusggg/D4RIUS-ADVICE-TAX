// ══ PROTECTIE COD SURSA - d4riusTAX ══
(function () {

  // 1. Dezactiveaza click dreapta
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // 2. Dezactiveaza F12, Ctrl+U, Ctrl+Shift+I/J/C
  document.addEventListener("keydown", function (e) {
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Detecteaza DevTools deschis
  var devtools = { open: false };
  setInterval(function () {
    var before = new Date();
    debugger;
    var after = new Date();
    if (after - before > 100) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML =
          "<div style='display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:Inter,sans-serif;background:#14314d;color:#fff;'>" +
          "<h2 style='font-size:32px;margin-bottom:16px;'>🔒 Acces restrictionat</h2>" +
          "<p style='color:#aaa;'>Va rugam inchideti instrumentele de dezvoltare.</p>" +
          "</div>";
      }
    } else {
      devtools.open = false;
    }
  }, 500);

})();