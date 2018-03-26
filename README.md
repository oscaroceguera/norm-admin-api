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
  * ~Get schema by uuid~
  * ~Get Schemas list~
  * ~Update Schema~
  * ~Delete Schema with modules/items~
  * ~Format public and hide _id~
    
* CRUD de modules
  * ~Create Module (save _id in schema)~
  * ~Get modules by schema uuid~
  * ~Get Module by uuid~
  * Get Module by uuid with items
  * Get modules by schema uuid with items
  * ~Delete Module with items~
  * ~Update Module~
  * ~Format public and hide _id~
  
* CRUD de items:
  * ~Create item~
  * Get schema items
  * Delete item
  * ~Get items list~
  * ~Update item~
  * ~Format public and hide _id~
  
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


