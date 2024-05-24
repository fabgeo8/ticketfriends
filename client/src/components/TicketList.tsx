import React, { useState, useEffect } from 'react'
import {Card, List, Button, Modal, Input, Space, Divider, notification} from 'antd'
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
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1)
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

  const openNotification = (type: string, subject: string, desc: string) => {
    if (type === 'warning') {
      notification.warning({
        message: subject,
        description: (
            <div>
              { desc }
            </div>
        ),
        duration: 5, // Notification will stay for 5 seconds
      })
    } else if (type === 'success') {
      notification.success({
        message: subject,
        description: (
            <div>
              { desc }
            </div>
        ),
        duration: 5, // Notification will stay for 5 seconds
      })
    } else if (type === 'error') {
      notification.error({
        message: subject,
        description: (
            <div>
              { desc }
            </div>
        ),
        duration: 5, // Notification will stay for 5 seconds
      })
    } else if (type === 'info') {
      notification.info({
        message: subject,
        description: (
            <div>
              { desc }
            </div>
        ),
        duration: 5, // Notification will stay for 5 seconds
      })
    }
    else {
      console.log('not supported notification type', type)
    }
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
        let updatedPage = updatedTicket.pages[selectedPageIndex];
        const prevSharedWith = selectedTicket?.pages[selectedPageIndex].sharedWith || []

        const newSharedWith = updatedPage.sharedWith.filter((email: any) => !prevSharedWith.includes(email))
        const failedEmails = sharedEmails.filter((email: any) => !updatedPage.sharedWith.includes(email))

        if (failedEmails.length > 0) {
          openNotification(
              'warning',
              'Failed to Share',
              `Failed to share ticket page with ${failedEmails.join(', ')}`
          )
        }

        if (newSharedWith.length > 0) {
          openNotification(
              'success',
              'Ticket Shared',
              `Ticket page shared with ${newSharedWith.join(', ')}`
          )
        } else {
          openNotification('info', 'No New Recipients', 'Ticket page not shared with any new recipients.')
        }
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
    setSelectedPageIndex(-1)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSharedEmails([])
    setSelectedTicket(null)
    setSelectedPageIndex(-1)
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
        title={`Share Ticket ${selectedPageIndex ? selectedPageIndex + 1 : ''}`}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          placeholder="Enter email address to send ticket"
          value={sharedEmails.join(', ')}
          onChange={handleEmailsChange}
        />
      </Modal>
    </div>
  )
}

export default TicketList