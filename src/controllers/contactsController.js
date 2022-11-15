const { Contact } = require("../models/contactModel")
const { createNotFoundError } = require("../helpers")

const listContacts = async (req, res, next) => {
    const { favorite, page, limit } = req.query
    const filter = favorite === null ? {} : { favorite }
    const contacts = await Contact.find({ owner: req.user._id, filter})
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec()
    
    const counter = await Contact.countDocuments()
    return res.status(200).json({
        contacts,
        totalPages: Math.ceil(counter / limit),
        currentPage: page,
    }) 
}


const getContactById = async (req, res, next) => {
    const query = {
        _id: req.params.contactId,
        owner: req.user._id,
    }
    const contact = await Contact.findOne(query)

    if (contact) {
        return res.status(200).json(contact)
    }
    return next(createNotFoundError())
}

const addContact = async (req, res, next) => {
    const { name, email, phone, favorite } = req.body
    const newContact = await Contact.create({ owner: req.user._id, name, email, phone, favorite })

    return res.status(201).json(newContact)
}

const removeContact = async (req,res,next) => {
    const query = {
        _id: req.params.contactId,
        owner: req.user._id,
    }
    const contact = await Contact.findOne(query)

    if (contact) {
        await Contact.findOneAndDelete(query)
        return res.status(200).json({"message": "contact deleted"})
    }
    next(createNotFoundError())
}

const updateContact = async (req, res, next) => {
    const query = {
        _id: req.params.contactId,
        owner: req.user._id,
    }
    const updatedContact = await Contact.findOneAndUpdate(query, req.body , { new: true })

    return res.status(200).json(updatedContact)
}

const updateStatusContact = async (req, res, next) => {
    const query = {
        _id: req.params.contactId,
        owner: req.user._id,
    }
    const { favorite } = req.body
    const contact = await Contact.findOne(query)
    
    if (!favorite) {
        return res.status(400).json({"message": "missing field favorite"})
    }

    if (contact) {
        const result = await Contact.findOneAndUpdate(query, { favorite, } , { new: true })
        res.status(200).json(result)
    }

    return next(createNotFoundError())
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
}

