describe('Home Page E2E', () => {
  it('Debe renderizar la página principal de la clínica correctamente', () => {
    // Visitamos la raíz del proyecto (configurado baseUrl en cypress.config.js http://localhost:5173)
    cy.visit('/');

    // Verificamos que contenga elementos clave
    // Como el texto está separado en dos <span> distintos en el Navbar, 
    // verificamos la existencia de ambos
    cy.contains('Sanatorio').should('be.visible');
    cy.contains('UTN').should('be.visible');

    // Comprobamos la existencia de los enlaces
    cy.get('a[href="/doctor"]').should('exist');
    cy.get('a[href="/admin"]').should('exist');
  });

  // Si tienes un componente de login disponible
  // it('Debe poder navegar al área de administración y pedir login/redireccionar', () => {
  //   cy.visit('/');
  //   cy.get('a[href="/admin"]').click();
  //   // cy.url().should('include', '/login'); // O la redirección real que hagas, en caso que este configurado
  // });
});