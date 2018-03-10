# norm-admin-api
Administración de  normas API

## Stack
* Nodejs
* Express
* MongoDB
* Auth jwt
* TTD (Mocha, expect, supertest)

## v1:
* CRUD de Schema
  * ~Create Schema~
  * Get schema by id
  * Delete Schema
  * ~Get Schemas list~
  * Update Schema
  * Delete Schema with modules/items
    
* CRUD de modules
  * Create Module
  * Get Module
  * Delete Module
  * Get Modules list
  * Update Module
  
* CRUD de items:
  * Create item
  * Get schema item
  * Delete item
  * Get items list
  * Update item
  
## Schema structure

```javascript
  name: "Norm123",
  version: "v21.0.1",
  description: "lorem...",
  modules: [
    {
      name: "Module One",
      number: "1.0",
      order: 1,
      items: [
        {question: "¿Question one .....?", recommendation: "esto aca....", value: 10, number: '0.12.0', order: 1},
        {question: "¿Question two .....?", recommendation: "esto aca....", value: 10, number: '0.13.0', order: 2},
        ...
        {question: "¿Question n .....?", recommendation: "n...", value: 10, number: 'n', order: n}
      ]
    },
    {
      name: "Module Two",
      number: "2",
      order: 2,
      items: [
        {question: "¿Question one .....?", recommendation: "esto aca....", value: 23.9, number: '0.12.0', order: 1},
        {question: "¿Question two .....?", recommendation: "esto aca....", value: 23.9, number: '0.13.0', order: 2},
        ...
        {question: "¿Question n .....?", recommendation: "n...", value: 23.9, number: 'n', order: n}
      ]
    },
    ...
    {
      name: "Module n",
      number: "n",
      order: n,
      items: [
        {question: "¿Question one .....?", recommendation: "esto aca....", value: 23.9,  number: '0.12.0', order: 1},
        {question: "¿Question two .....?", recommendation: "esto aca....", value: 23.9, number: '0.13.0', order: 2},
        ...
        {question: "¿Question n .....?", recommendation: "n...", value: 23.9, number: 'n', order: n}
      ]
    }
  ]
 ```


