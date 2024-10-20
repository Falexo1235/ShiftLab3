'use client'

import { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'

const url = 'https://shift-backend.onrender.com'

const sendPhoneVerification = async (phone: string) => {
  try {
    const response = await axios.post(`${url}/auth/otp`, { phone })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Ошибка при подтверждении номера.', error)
    throw error
  }
}

const verifyOtp = async (phone: string, code: string) => {
  try {
    const response = await axios.post(`${url}/users/signin`, { phone, 'code':Number(code) })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Ошибка при проверке одноразового пароля.', error)
    throw error
  }
}

export default function LoginFunc() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setphone] = useState('')
  const [otp, setOtp] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (phone.trim()) {
      setPhoneError('')
    } else {
      setPhoneError('Необходимо указать номер телефона.')
    }
  }, [phone])

  useEffect(() => {
    if (otp.length < 6) {
      setOtpError('В одноразовом пароле должно быть 6 символов.')
    } else {
      setOtpError('')
    }
  }, [otp])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      setPhoneError('Необходимо указать номер телефона.')
      return
    }
    setIsLoading(true)
    try {
      await sendPhoneVerification(phone)
      setStep('otp')
    } catch (error) {
      setPhoneError('Ошибка при отправке подтверждения. Пожалуйста, повторите попытку.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim() || otp.length < 6) {
      return
    }
    setIsLoading(true)
    try {
      await verifyOtp(phone, otp)
      setIsOpen(false)
      setStep('phone')
      setphone('')
      setOtp('')
      setPhoneError('')
      setOtpError('')
    } catch (error) {
      setOtpError('Неправильный пароль. Повторите попытку.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setphone(value)
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setOtp(value.slice(0, 6))
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open Phone Verification</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {step === 'phone' ? 'Введите номер телефона' : 'Введите одноразовыый пароль'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {step === 'phone'
              ? 'Пожалуйста, введите свой номер телефона для получения одноразового пароля'
              : 'Мы отправили вам одноразвый пароль. Пожалуйста, введите его ниже.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="col-span-3"
                  placeholder="Введите свой номер телефона"
                  aria-invalid={!!phoneError}
                  aria-describedby="phone-error"
                />
              </div>
              {phoneError && (
                <p id="phone-error" className="text-sm text-destructive">
                  {phoneError}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!!phoneError || isLoading}>
                {isLoading ? 'Отправка...' : 'Подтвердить'}
              </Button>
            </AlertDialogFooter>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otp" className="text-right">
                  OTP
                </Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="col-span-3"
                  placeholder="Enter the 6-digit OTP"
                  maxLength={6}
                  aria-invalid={!!otpError}
                  aria-describedby="otp-error"
                />
              </div>
              {otpError && (
                <p id="otp-error" className="text-sm text-destructive">
                  {otpError}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep('phone')}>
                Back
              </Button>
              <Button type="submit" disabled={!!otpError || isLoading}>
                {isLoading ? 'Подтверждение...' : 'Подтвердить'}
              </Button>
            </AlertDialogFooter>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}