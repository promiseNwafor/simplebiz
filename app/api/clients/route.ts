import { revalidatePath } from 'next/cache'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { AddClientSchema } from '@/schemas'

export async function GET(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found!' }), {
        status: 500,
      })
    }

    const clients = await db.client.findMany({
      where: {
        userId: user.id,
      },
    })

    return new Response(JSON.stringify({ clients }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: 'Something went wrong!' }), {
      status: 500,
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedFields = AddClientSchema.safeParse(body)

    if (!validatedFields.success) {
      return { error: 'Invalid fields!' }
    }

    const user = await currentUser()
    const { name, email, phoneNumber, billingAddress, businessName } =
      validatedFields.data

    await db.client.create({
      data: {
        userId: user.id,
        name,
        email,
        phone: phoneNumber,
        billingAddress,
        businessName,
      },
    })

    revalidatePath('/clients')

    return new Response(
      JSON.stringify({
        success: 'Client added successfully',
        statusText: 'OK',
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error(error)
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return new Response(
            JSON.stringify({ error: 'Client already exists!' }),
            {
              status: 500,
            }
          )
        case 'P2003':
          return new Response(JSON.stringify({ error: 'User not found!' }), {
            status: 500,
          })
        default:
          return new Response(JSON.stringify(error), {
            status: 500,
          })
      }
    }

    return new Response(JSON.stringify(error), {
      status: 500,
    })
  }
}
