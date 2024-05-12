describe('web', () => {
  it('carga web', () => {
    cy.visit('https://valeria-conexa.vercel.app/')

    // Find the checkbox element and click it
    cy.get('input[type="checkbox"]').check();

    // Assert that the checkbox is checked
    cy.get('input[type="checkbox"]').should('be.checked');
  })
})
