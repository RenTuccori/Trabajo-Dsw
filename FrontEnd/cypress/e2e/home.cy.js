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
    if (!Cypress.env('useRealBackend')) {
      const toBase64Url = (value) =>
        btoa(JSON.stringify(value))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');

      const token = [
        toBase64Url({ alg: 'HS256', typ: 'JWT' }),
        toBase64Url({
          nationalId: 98760102,
          firstName: 'Paciente',
          lastName: 'Prueba',
          role: 'Patient',
          exp: 4102444800,
        }),
        'test-signature',
      ].join('.');

      cy.intercept('POST', '**/api/users/login', {
        statusCode: 200,
        body: token,
      }).as('patientLogin');
    }

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

    if (!Cypress.env('useRealBackend')) {
      cy.wait('@patientLogin');
    }

    // Verificar que el login fue exitoso 
    cy.contains('¿Qué necesitás hoy?', { timeout: 10000 }).should('be.visible');
  });
});
