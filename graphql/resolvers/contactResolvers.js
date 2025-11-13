import { Contact } from "../../models/contacts.js";
import { ResponseMessage } from "../../function/responseMessage.js";
import { paginationLabel } from "../../function/paginateFn.js";

export const contactResolvers = {
  Query: {
    getContactById: async (_, { _id }) => {
      return await Contact.findById(_id);
    },

    getAllContacts: async () => {
      return await Contact.find();
    },
    getContactWithPagination: async (
      _,
      { page, limit, pagination, keyword, subject }
    ) => {
      try {
        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: paginationLabel,
          pagination: pagination,
          select:
            "_id contactName email subject message status reply receivedAt updatedAt",
        };

        // Build query dynamically
        const query = { $and: [] };

        if (keyword && keyword.trim() !== "") {
          query.$and.push({
            contactName: { $regex: keyword.trim(), $options: "i" },
          });
        }

        if (subject && subject.trim() !== "") {
          query.$and.push({
            subject: { $regex: `^${subject.trim()}$`, $options: "i" },
          });
        }

        // If no filters, remove $and to match all
        if (query.$and.length === 0) {
          delete query.$and;
        }

        const contactData = await Contact.paginate(query, options);

        return contactData;
      } catch (error) {
        console.error("Error in getContactWithPagination:", error);
        return {
          data: [],
          paginator: {
            totalDocs: 0,
            totalPages: 0,
            currentPage: page || 1,
            perPage: limit || 10,
          },
        };
      }
    },
  },

  Mutation: {
    submitContactForm: async (_, { input }) => {
      try {
        await new Contact(input).save();
        return ResponseMessage(true);
      } catch (error) {
        return ResponseMessage(false);
      }
    },

    replyContact: async (_, { contactId, message }) => {
      try {
        const contact = await Contact.findById(contactId);
        if (!contact) return ResponseMessage(false, "Contact not found");

        contact.reply = message;
        contact.status = "Resolved";
        await contact.save();

        return ResponseMessage(true, "Reply sent successfully", {
          _id: contact._id,
          contactName: contact.contactName,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
          reply: contact.reply,
          receivedAt: contact.receivedAt,
          updatedAt: contact.updatedAt,
        });
      } catch (error) {
        console.error(error);
        return ResponseMessage(false, "Failed to send reply");
      }
    },
  },
};
