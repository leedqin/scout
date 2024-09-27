# Scout Coaching Booking Platform

Scout is a booking platform that allows coaches to open slots on their calendar, provide feedback, and view upcoming bookings with their students.

## Tech Stack

- **Backend:** PostgreSQL, Next.js (API layer), Prisma
- **Frontend:** React, TypeScript, Zustand, ShadCN components
- **Time Management:** Date-fns and date-fns-tz for handling dates and times in the 'America/New_York' timezone

## Database

The platform uses a PostgreSQL database with the following core entities:

- **User:** Represents both coaches and students.
- **Slot:** Represents a time block a coach makes available for booking.
- **Booking:** Represents a student's reservation of a specific slot.
- **Feedback:** Represents feedback provided by a student after a booking.

### Core Relationships

- **User-CoachSlots-Slot:** A coach can have many slots (one-to-many).
- **Slot-SlotBooking-Booking:** A slot can have one booking (one-to-one).
- **User-Booking:** A student can have many bookings (one-to-many).
- **Booking-Feedback:** A booking can have one feedback (one-to-one).

### Installation Guide

## Install Dependencies

```
npm install
```

## Database Setup

1. Create a PostgreSQL database
2. Update your environment variables in a .env file in the root directory with the following details:

```bash
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
```

3. Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

4.Seed the database with fake users:

```bash
npm run seed
```

## Running the Application

To start the application run:

```
npm run dev
```

##API Routes
The APIs are available under /pages/api. Here’s a breakdown of the main routes:

Coach APIs
GET ```/api/coach/[id]: Get coach details by ID```
GET ```/api/coach/bookings: Fetch coach bookings```
POST /api/coach/createSlot: Create a new slot for the coach
DELETE /api/coach/deleteSlot: Delete a coach's slot
GET /api/coach/openSlot: Fetch open slots
POST /api/coach/submitFeedback: Submit feedback
Student APIs
GET /api/student/[id]: Get student details by ID
GET /api/students/getBookings: Fetch student bookings
POST /api/students/createBookings: Create a booking
DELETE /api/students/cancelBookings: Cancel a booking
GET /api/slots/openSlot: Fetch open slots
Shared APIs
GET /api/students: Fetch all students
GET /api/coach: Fetch all coaches
Frontend Overview
Running the Frontend
To run the frontend:

bash
Copy code
npm run dev
The landing page will provide options to navigate as a Coach or a Student.

Coach View
Slot Management: Create, view, and delete slots.
Booking Review: Review bookings and submit feedback.
Student Information: View booked students' details.
Student View
Slot Booking: Create bookings with available slots.
View Bookings: View and manage upcoming bookings.
Dependencies
Zustand for state management
ShadCN for UI components
Date-fns and date-fns-tz for date and time handling
Additional Notes
The database schema can be found in /prisma/schema.prisma.
For a detailed breakdown of the app's components, see the source code documentation.

The app will be available at http://localhost:3000.



### Prerequisites

- Node.js (version 16 or higher)
- PostgreSQL (version 12 or higher)

### Clone the Repository

```bash
git clone <repository-url>
cd scout-coaching-booking-platform
````
