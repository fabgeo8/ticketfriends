import express, { Request, Response } from 'express'
import Ticket from '../../models/Ticket'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import nodemailer from 'nodemailer'
import { PDFDocument } from 'pdf-lib'

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  host: process.env.SMTP_HOST,
  port: Number(465),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

// GET /api/tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find()
    res.json(tickets)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Route for uploading a new ticket
router.post('/', upload.single('documentPdf'), async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const documentPdf = req.file?.path

    if (documentPdf) {
      const pdfDoc = await PDFDocument.load(fs.readFileSync(documentPdf))
      const pages: Array<{ sharedWith: string[]; pdfPath: string }> = []

      console.log('pdf pages: ' + pdfDoc.getPages().length)

      for (let i = 0; i < pdfDoc.getPages().length; i++) {
        const pdfPath = path.join('uploads', `${name}_page_${i + 1}.pdf`)

        const singlePagePdf = await PDFDocument.create()
        const [pdfPage] = await singlePagePdf.copyPages(pdfDoc, [i])
        singlePagePdf.insertPage(0, pdfPage)

        const singlePagePdfBytes = await singlePagePdf.save()

        fs.writeFileSync(pdfPath, singlePagePdfBytes)
        pages.push({ sharedWith: [], pdfPath })
      }

      const newTicket = new Ticket({ name, pages, documentPdf })
      await newTicket.save()

      res.status(201).json(newTicket)
    } else {
      res.status(400)
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
})

// Route for updating a ticket
router.put('/:id', upload.single('documentPdf'), async (req: Request, res: Response) => {
  try {
    const { name, pages } = req.body
    const documentPdf = req.file?.path

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, { name, pages, documentPdf }, { new: true })

    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    res.json(updatedTicket)
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
})

// PUT /tickets/:id/pages/:pageIndex/share
router.put('/:id/pages/:pageIndex/share', async (req: Request, res: Response) => {
  try {
    const { sharedEmails } = req.body
    const { id, pageIndex } = req.params

    const ticket = await Ticket.findById(id)

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' })
    }

    if (parseInt(pageIndex) < 0 || parseInt(pageIndex) >= ticket.pages.length) {
      return res.status(400).json({ error: 'Invalid page index' })
    }

    const page = ticket.pages[parseInt(pageIndex)]
    const pdfBytes = fs.readFileSync(page.pdfPath)
    // const pdfDoc = await PDFDocument.load(pdfBytes)

    const successfulEmails = []

    for (const email of sharedEmails) {
      try {
        const mailOptions = {
          from: 'hello@doubleview.sg',
          to: email,
          subject: `Shared Ticket ${pageIndex + 1} of Ticket ${ticket.name}`,
          text: `Find your tickets attached.`,
          attachments: [
            {
              filename: `${ticket.name}_page_${pageIndex + 1}.pdf`,
              content: pdfBytes,
            },
          ],
        }

        await transporter.sendMail(mailOptions)
        successfulEmails.push(email)
      } catch (err) {
        console.error(`Error sending email to ${email}: ${err}`)
      }
    }

    ticket.pages[parseInt(pageIndex)].sharedWith.push(...successfulEmails)
    await ticket.save()

    res.json(ticket)
  } catch (err) {
    res.status(500).json({ error: 'Server error', err: err })
  }
})

export default router
