const { nanoid } = require('nanoid')
let contacts = require('./contacts.json')

const listContacts = async (req, res) => {
  res.status(200).json(contacts)
}

const getContactById = async (req,res) => {
  const { contactId } = req.params
  const selectedContact = contacts.find(({ id }) => id === contactId)

  if (!selectedContact) {
    return res.status(404).json({"message": "Not found"})
  }
  res.status(200).json(selectedContact)
}

const removeContact = async (req,res) => {
  const { contactId } = req.params
  const selectedContact = contacts.find(({ id }) => id === contactId)

  if (!selectedContact) {
    return res.status(404).json({"message": "Not found"})
  }

  contacts = contacts.filter(({ id }) => id !== contactId)
  res.status(200).json({"message": "contact deleted"})
}

const addContact = async (req, res) => {
  const { name, email, phone } = req.body
  const newContact = {
    id: nanoid(),
    name: name,
    email: email,
    phone: phone,
  }

  contacts = [...contacts, newContact]
  res.status(201).json(newContact)
}

const updateContact = async (req, res) => {
  const { contactId } = req.params
  const selectedContactToUpdate = contacts.find(({id})=> id === contactId)
  const { name, email, phone } = req.body
  
  if (!name || !email || !phone) {
    return res.status(400).json({"message": "missing fields"})
  } else if (!selectedContactToUpdate) {
    return res.status(404).json({"message": "Not found"})
  }

    contacts.forEach(contact => {
      if (contact.id === contactId) {
        contact.name = name
        contact.email = email
        contact.phone = phone

        res.status(200).json(selectedContactToUpdate)
      }
    })
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
