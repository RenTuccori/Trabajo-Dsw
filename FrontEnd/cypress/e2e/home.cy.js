describe('Home Page E2E', () => {
  it('Debe renderizar la página principal de la clínica correctamente', () => {
    // Visitamos la raíz del proyecto
    cy.visit('/');

    // Verificamos que contenga elementos clave
    cy.contains('Sanatorio').should('be.visible');
    cy.contains('UTN').should('be.visible');

    // Comprobamos la existencia de los enlaces
    cy.get('a[href="/doctor"]').should('exist');
    cy.get('a[href="/admin"]').should('exist');
  });

  it('Debe poder navegar al área de pacientes y realizar login', () => {
    // Al visitar '/' redirige automáticamente a '/patient'
    cy.visit('/');
    cy.url().should('include', '/patient');

    // Validar que estamos en la pantalla de login del portal de pacientes
    cy.contains('Iniciar sesión').should('be.visible');

    // Ingresar credenciales
    cy.get('input[placeholder="Ingresá tu documento"]').type('98760102');
    cy.get('input[placeholder="Tu contraseña"]').type('123456');

    // Accionar el botón de ingreso
    cy.contains('button', 'Ingresar').click();

    // Verificar que el login fue exitoso 
    cy.contains('¿Qué necesitás hoy?', { timeout: 10000 }).should('be.visible');
  });
});