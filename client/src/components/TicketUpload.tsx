import React, { useState } from 'react'
import { Upload, Button, Input, Form, Space, notification } from 'antd'
import { InboxOutlined, HomeOutlined, UploadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Dragger } = Upload

interface TicketUploadProps {
  onUpload: (name: string, file: File) => void
}

const TicketUpload: React.FC<TicketUploadProps> = ({ onUpload }) => {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const openNotification = () => {
    notification.success({
      message: 'Ticket Uploaded',
      description: (
        <div>
          Ticket uploaded successfully! Go back to home to view and share the tickets.
        </div>
      ),
      duration: 5, // Notification will stay for 5 seconds
    })
  }

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('documentPdf', file)

      try {
        const response = await fetch('/api/tickets', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          console.log('File uploaded successfully')
          onUpload(name, file)
          openNotification()
          setName('')
          setFile(null)
        } else {
          console.error('File upload failed')
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }

  return (
    <div>
      <Form.Item label="Ticket Name">
        <Input value={name} onChange={handleNameChange} />
      </Form.Item>
      <Form.Item label="PDF File">
        <Dragger
          accept=".pdf"
          beforeUpload={(file) => {
            setFile(file)
            return false
          }}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single PDF file upload.</p>
        </Dragger>
      </Form.Item>
      <Space>
        <Button icon={<UploadOutlined />} type="primary" onClick={handleUpload} disabled={!name || !file}>
          Upload
        </Button>
        <Link to="/">
          <Button  icon={<HomeOutlined />} className="ant-ml-3" type="default">
            Go back
          </Button>
        </Link>
      </Space>

    </div>
  )
}

export default TicketUpload