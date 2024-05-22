import TicketUpload from '@/components/TicketUpload'

const Import = () => {
  const handleUpload = (name: string, file: File) => {
    // Handle the uploaded ticket data here
    console.log('Ticket Name:', name)
    console.log('Uploaded File:', file)
  }

  return (
    <div>
      <h1>Import ticket as pdf</h1>
      <TicketUpload onUpload={handleUpload} />
    </div>
  )
}

export default Import
