'use server'

import { getDatabase, User } from '@/lib/database'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

const formSchema = z.object({
  arrivalTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  departureTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Invalid time format. Use HH:MM (24-hour format).",
  }),
  wantToCarPool: z.boolean().default(false),
  availableSeats: z.number().min(0).max(4).optional(),
})

export async function bookParking(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    arrivalTime: formData.get('arrivalTime'),
    departureTime: formData.get('departureTime'),
    wantToCarPool: formData.get('wantToCarPool') === 'on',
    availableSeats: formData.get('wantToCarPool') === 'on' ? 
      parseInt(formData.get('availableSeats') as string, 10) : undefined,
  })

  if (!validatedFields.success) {
    return { error: 'Invalid form data' }
  }

  const { arrivalTime, departureTime, wantToCarPool, availableSeats } = validatedFields.data

  try {
    const db = await getDatabase()
    const temp = await currentUser()
    
    if (!temp) {
      return { error: 'Unauthorized' }
    }

    const user = await db.collection<User>('users').findOne({ email: temp.emailAddresses[0].emailAddress })

    if (!user) {
      // If user is not found, create a new user
      await db.collection<User>('users').insertOne({
        email: temp.emailAddresses[0].emailAddress,
        user_id: temp.id,
        access_level: 'user',
        name: temp.fullName || "User",
        used_tokens: 0,
      })
    }

    // Create booking
    const bookingResult = await db.collection('bookings').insertOne({
      email: temp.emailAddresses[0].emailAddress,
      arrivalTime,
      departureTime,
      wantToCarPool,
      availableSeats,
      createdAt: new Date(),
      status: 'pending',
    })

    if (!bookingResult.insertedId) {
      return { error: 'Failed to create booking' }
    }

    // Decrement token count
    const updateResult = await db.collection<User>('users').updateOne(
      { email: temp.emailAddresses[0].emailAddress },
      { $inc: { used_tokens: 1 } }
    )

    if (updateResult.modifiedCount === 0) {
      // If update fails, we should roll back the booking creation
      await db.collection('bookings').deleteOne({ _id: bookingResult.insertedId })
      return { error: 'Failed to update token count' }
    }

    return { 
        success: true,
        message: 'Booking created successfully',
        bookingId: bookingResult.insertedId.toString(), // Convert ObjectId to string
        used_tokens: (user?.used_tokens || 0) + 1,
      }
  } catch (error) {
    console.error(error)
    return { error: 'Error creating booking' }
  }
}