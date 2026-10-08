import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card'
import { HeartPulse } from 'lucide-react'
import { cn } from '../components/ui/Button'

export default function OTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (isNaN(value)) return
    
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Auto-advance
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    // On success -> Profile Setup
    navigate('/onboarding')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-primary">
            <HeartPulse size={40} />
            <h1 className="text-3xl font-bold tracking-tight">oneHealth</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify your identity</CardTitle>
            <CardDescription>We've sent a 6-digit code to your mobile number.</CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={cn(
                      "w-12 h-14 text-center text-xl font-semibold rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all",
                      digit ? "border-primary bg-primary/5 text-primary" : "border-gray-300 bg-white"
                    )}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button type="button" className="text-primary hover:underline font-medium">
                  Resend OTP
                </button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={otp.join('').length < 6}>
                Verify & Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
