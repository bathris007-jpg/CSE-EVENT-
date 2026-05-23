# Alpha-Flow

Alpha-Flow is a modern web application for market analysis, portfolio tracking, and real-time stock/crypto simulation. It features a rich, responsive user interface built with Next.js and a fast, lightweight backend powered by FastAPI.

## Tech Stack

- **Frontend:** Next.js, React, TailwindCSS, Lucide Icons, Recharts
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite

## Project Structure

- `/frontend` - Contains the Next.js web application.
- `/backend` - Contains the FastAPI python backend and SQLite database.

## Running Locally

To run the application locally, you will need to start both the frontend and backend servers.

### 1. Start the Backend Server

```bash
cd backend

# Create and activate a virtual environment (if not already done)
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/bin/activate # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`.

### 2. Start the Frontend Server

```bash
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev
```
The web application will be available at `http://localhost:3000`.

## Deployment

This repository is configured to be deployed on **Vercel**.

1. Connect this GitHub repository to Vercel.
2. **For the Frontend:** Create a new Vercel project, select this repository, and set the **Root Directory** to `frontend`. Vercel will automatically configure the Next.js deployment.
3. **For the Backend:** Create a second Vercel project, select this repository, and set the **Root Directory** to `backend`. The included `vercel.json` and `requirements.txt` will automatically configure Vercel to deploy the FastAPI application using serverless functions.
4. *Note:* Make sure to update the API endpoints in the frontend to point to your deployed backend URL.
