const express = require('express')
const router = express.Router()
const  { tryCatchWrapper } = require("../../helpers")
const {
  addContactValidation,
  updateContactValidation,
} = require('../../middlewares/validationMiddleware')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../controllers/contactsController')
const { auth } = require("../../middlewares/auth")

router.get('/', auth, tryCatchWrapper(listContacts))

router.get('/:contactId', auth, tryCatchWrapper(getContactById))

router.post('/', auth, addContactValidation, tryCatchWrapper(addContact))

router.delete('/:contactId', auth, tryCatchWrapper(removeContact))

router.put('/:contactId', auth, updateContactValidation, tryCatchWrapper(updateContact))

router.patch('/:contactId/favorite', auth, tryCatchWrapper(updateStatusContact))

module.exports = router