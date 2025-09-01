import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">About Aura AI</h1>
      <p className="mb-4">
        Aura AI is a cutting-edge platform designed to enhance your urban experience by providing real-time insights and analytics about your city.
      </p>
      <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
      <p className="mb-4">
        We aim to empower citizens with the information they need to make informed decisions about their environment, from air quality to social trends.
      </p>
      <h2 className="text-2xl font-bold mb-2">Features</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Real-time data on air quality and pollution levels</li>
        <li>Insights into social trends and community sentiment</li>
        <li>Personalized recommendations for city exploration</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">Get Involved</h2>
      <p>
        Join us in our mission to create smarter, more sustainable cities. Whether you're a citizen, a city planner, or a business owner, we want to hear from you!
      </p>
    </div>
  )
}
