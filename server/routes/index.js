const express = require('express')
const router = express.Router()

const norm = require('./norm')
const modules = require('./modules')
const items = require('./items')

module.exports = (app) => {
  router.post('/schemas', norm.addSchema)
  router.get('/schemas', norm.getSchemas)
  router.get('/schemas/:uuid', norm.getSchemaByUuid)
  router.patch('/schemas/:uuid', norm.updateSchema)
  router.delete('/schemas/:uuid', norm.deleteSchema)
  router.post('/schemas/:schemaUuid/modules', modules.addModule)
  router.get('/schemas/:schemaUuid/modules', modules.getModulesBySchemaUuid)
  router.get('/modules/:moduleUuid', modules.getModuleByUuid)
  router.patch('/modules/:uuid', modules.updateModule)
  router.delete('/modules/:uuid', modules.deleteModule)
  router.post('/modules/:moduleUuid/items', items.addItem)
  router.get('/modules/:moduleUuid/items', items.getItemsByModuleUuid)
  router.get('/items/:itemUuid', items.getItemByUuid)
  router.patch('/items/:uuid', items.updateItem)
  router.delete('/items/:uuid', items.deleteItem)
  router.get('/schemas/:uuid/download', norm.download)

  app.use('/api', router)
}
