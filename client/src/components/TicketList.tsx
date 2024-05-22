import React, { useState, useEffect } from 'react'
import { Card, List, Button, Modal, Input, Space, Divider } from 'antd'
import { CheckCircleTwoTone, HomeOutlined, UploadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import utilities from '../utilities.module.scss'

interface Page {
  sharedWith: string[]
  pdfPath: string
}

interface Ticket {
  _id: string
  name: string
  pages: Page[]
  documentPdf: string
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null)
  const [sharedEmails, setSharedEmails] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const handleShareClick = (ticket: Ticket, pageIndex: number) => {
    setSelectedTicket(ticket)
    setSelectedPageIndex(pageIndex)
    setIsModalOpen(true)
  }

  const handleModalOk = async () => {
    try {
      const response = await fetch(`/api/tickets/${selectedTicket?._id}/pages/${selectedPageIndex}/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sharedEmails }),
      })

      if (response.ok) {
        const updatedTicket = await response.json()
        setTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket))
        )
      } else {
        console.error('Error sharing ticket page')
      }
    } catch (error) {
      console.error('Error sharing ticket page:', error)
    }

    setIsModalOpen(false)
    setSharedEmails([])
    setSelectedTicket(null)
    setSelectedPageIndex(null)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSharedEmails([])
    setSelectedTicket(null)
    setSelectedPageIndex(null)
  }

  const handleEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSharedEmails(e.target.value.split(',').map((email) => email.trim()))
  }

  return (
    <div>
      <Space direction="vertical">
        <Link to="/import">
          <Button className={utilities.mb3}  icon={<UploadOutlined />}  type="default">
            Upload tickets
          </Button>
        </Link>
      </Space>
      <Divider></Divider>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={tickets}
        renderItem={(ticket) => (
          <List.Item>
            <Card title={ticket.name}>
              <List
                dataSource={ticket.pages}
                renderItem={(page, index) => (
                  <List.Item>
                    Ticket {index + 1}
                    {page.sharedWith.length > 0 && (
                      <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginLeft: 8 }} />
                    )}
                    {page.sharedWith.length > 0 && <p style={{ }}>{page.sharedWith.join(', ')}</p>}
                    {page.sharedWith.length === 0 && (
                      <div>
                        <Button style={{ marginTop: 8 }} type="default" onClick={() => handleShareClick(ticket, index)}>
                          Share
                        </Button>
                      </div>
                    )}
                  </List.Item>
                )}
              />
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={`Share Page ${selectedPageIndex ? selectedPageIndex + 1 : ''}`}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          placeholder="Enter email addresses separated by commas"
          value={sharedEmails.join(', ')}
          onChange={handleEmailsChange}
        />
      </Modal>
    </div>
  )
}

export default TicketList