const bodyParser = require('body-parser')
const express = require('express')
const sequel = require('./sequel.js')
const app = express()
const port = 3000

/*
    POST /request
        email (string)
        title (string)
    returns
        id (int)
        available (boolean)
        title (string)
        timestamp (string) (ISO8601) --> substituting sequelize's default timestamp params
 
    GET /request/ or /request/<id>
    returns
        books (array) or specific book

    DELETE /request/<id>
    returns nothing
*/

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/request', async (req, res) => {
    let theBooks = await sequel.book.findAll()
    res.json( theBooks )
})

app.get('/request/:id', async (req, res) => {
    let theBook = await sequel.book.findOne( 
       { where: { id: req.params.id } }
    )
    theBook.timestamp = new Date().toISOString()
    res.json(theBook)
})

app.post('/request/', async (req, res) => {
    if( sequel.user.findAll( {
        where: { "email": req.body.email }
    })) {
        try {
            let theBook = await sequel.book.create({
                title: req.body.title,
                available: 1
            })
            res.status(201).send(theBook)
        }
        catch {
            res.status(500).send("error")
        }
    }
})

app.delete('/request/:id', async (req,res) => {
    try {
        const deleted = await sequel.book.destroy({
            where: { id: req.params.id }
        });
        console.log('deleted',deleted)
        if (deleted) {
            return res.status(204).send("Book deleted");
        }
        throw new Error("Book not found");
    }
    catch(e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => console.log(`listening on port ${port}`))
