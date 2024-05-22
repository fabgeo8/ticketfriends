import mongoose, { Schema, Document } from 'mongoose'

interface Page {
  sharedWith: string[]
  pdfPath: string
}

export interface ITicket extends Document {
  name: string
  pages: Page[]
  documentPdf: string
}

const PageSchema: Schema = new Schema({
  sharedWith: {
    type: [String],
    required: true,
  },
  pdfPath: {
    type: String,
    required: true,
  },
})

const TicketSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  pages: {
    type: [PageSchema],
    required: true,
  },
  documentPdf: {
    type: String,
    required: true,
  },
})

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema)
export default Ticket
