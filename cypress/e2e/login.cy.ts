describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('allows user to login with invalid credentials', () => {
    const email = 'emily.johnson@example.com'
    const password = '123456'

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)

    cy.contains('button', 'Sign In').click()

    cy.url().should('include', '/')

    cy.contains('User logged in successfully').should('be.visible')
  })

  it('displays error messages with invalid credentials', () => {
    cy.contains('button', 'Sign In').click()

    cy.contains('This field is required').should('be.visible')

    cy.get('input[type="email"]').type('invalid-email')
    cy.get('input[type="password"]').type('short')

    cy.contains('button', 'Sign In').click()

    cy.contains('This email is invalid').should('be.visible')
    cy.contains('Password must be equal or more than 6 characters').should('be.visible')
  })
})
