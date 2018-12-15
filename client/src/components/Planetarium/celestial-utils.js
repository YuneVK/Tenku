export default {
  setCenter: (ctr, trans) => {
    var cx = document.querySelectorAll("centerx"), cy = document.querySelectorAll("centery"), cz = document.querySelectorAll("centerz");
    if (!cx || !cy) return;

    if (ctr === null) ctr = [0, 0, 0];
    if (ctr.length <= 2) ctr[2] = 0;
    //config.center = ctr; 
    if (trans !== "equatorial") cx.value = ctr[0].toFixed(1);
    else cx.value = ctr[0] < 0 ? (ctr[0] / 15 + 24).toFixed(1) : (ctr[0] / 15).toFixed(1);

    cy.value = ctr[1].toFixed(1);
    cz.value = ctr[2] !== null ? ctr[2].toFixed(1) : 0;
  }
}