/// <reference types="cypress"/>

import contrato from '../Contracts/produtos.contracts'

describe('Funcionalidade Manipular Produtos API ServRest', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    })


    it.only('Validar Contrato de Produtos', () => {
        cy.request({
            method:'GET',
            url:'http://localhost:3000/produtos',
            
        }).then(response => {
                return contrato.validateAsync(response.body)

        })
    })


    it('Listar Produtos', () => {
        cy.request({
            method:'GET',
            url:'http://localhost:3000/produtos',
            
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(50)
        })
        
    
    })

    it('Cadastrar Produto', () => {
        let produto=`Livro ${Math.floor(Math.random() * 100000)}`
        cy.request({
            method:'POST',
            url:'http://localhost:3000/produtos',
            body: {
                    "nome": produto,
                    "preco": 50,
                    "descricao": "Livro",
                    "quantidade": 5000
                },
                headers: {authorization:token}
            
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.have.equal('Cadastro realizado com sucesso')
            expect(response.body).to.have.property('_id')
            expect(response.duration).to.be.lessThan(50)
        })


    })




    it('Excluir Produto', () => {
        cy.request({
            method:'GET',
            url:'http://localhost:3000/produtos',
            
        }).then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
            method:'DELETE',
            url:`http://localhost:3000/produtos/${id}`,
            headers: {authorization:token},

    
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.lessThan(50)
            expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
    
        })

    })

})