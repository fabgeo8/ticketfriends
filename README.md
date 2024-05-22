# ticketfriends

TicketFriends
Ticket Sharing Application

This application allows users to upload PDF tickets and share individual pages or tickets with others via email. The main features include:

Ticket Upload: Users can upload PDF tickets by providing a name and selecting the PDF file.
Page Sharing: After uploading a ticket, users can view the individual pages of the PDF. Each page can be shared with one or more email addresses.
Email Notification: When a page is shared, the application sends an email to the specified email addresses with the selected page attached as a PDF file.
Shared Page Tracking: The application keeps track of which pages have been shared and with which email addresses, displaying this information in the user interface.

The application is built using React with TypeScript for the frontend, Express.js with TypeScript for the backend, and MongoDB with Mongoose for the database. It utilizes various libraries and frameworks, including Ant Design for UI components, pdf-lib for PDF manipulation, and Nodemailer for sending emails.
With this application, users can efficiently manage and share PDF tickets, streamlining the process of disseminating ticket information to relevant parties.

# Dev Setup

1. Copy .env.sample to .env and set correct variables

2. docker-compose up

3. Access the app: http://localhost:8080

