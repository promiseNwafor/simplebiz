import { AddClientSchemaValues } from '@/schemas'

export const getClients = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/clients')

    if (!response.ok) {
      const errorData = await response.json()

      return { error: errorData?.error || 'Failed to get clients' }
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    // TODO: add error toast
    return { error: 'Error getting clients' }
  }
}

export const addClient = async (clientData: AddClientSchemaValues) => {
  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    })

    if (!response.ok) {
      const errorData = await response.json()

      return { error: errorData?.error || 'Failed to add client' }
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    // TODO: add error toast
    return { error: 'Error adding client' }
  }
}
