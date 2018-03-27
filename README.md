# norm-admin-api [1.0.0]
Norms admin

## Stack
* Nodejs
* Express
* MongoDB
* Auth jwt
* TTD (Mocha, expect, supertest)

### CRUD de Schema:
  * [POST] -> /api/schemas
  * [GET] -> /api/schemas
  * [GET] -> /api/schemas/uuid
  * [PATCH] -> /api/schemas/uuid
  * [DELETE] -> /api/schemas/uuid
### CRUD de modules
  * [POST] -> /api/schemas/:schemaUuid/modules
  * [GET] -> /api/schemas/:schemaUuid/modules
  * [GET] -> /api/modules/:moduleUuid
  * [PATCH] -> /api/modules/:moduleUuid
  * [DELETE] -> /api/modules/:moduleUuid
### CRUD de items:
  * [POST] -> /api/modules/:moduleUuid/items
  * [GET] -> /api/modules/:moduleUuid/items
  * [GET] -> /api/items/:itemUuid
  * [PATCH] -> /api/items/:uuid
  * [DELETE] -> /api/items/:uuid

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


