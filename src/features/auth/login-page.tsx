import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import dexaGroupImage from '../../assets/dexa-group.jpg'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { attendanceApiFetch } from '../../lib/openapi-fetch'
import { healthControllerCheck as checkMonitoringHealth } from '../../services/generated/monitoring/health/health'
import { ApiError, getErrorMessage } from '../../types/api'
import { loginSchema } from './auth.schema'
import type { LoginPayload } from './auth.types'
import { useAuth } from './use-auth'

interface LoginLocationState {
  from?: string
}

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const { error: healthError, isLoading: healthIsLoading } = useQuery({
    queryKey: ['login-backend-health'],
    queryFn: async () => {
      await Promise.all([
        attendanceApiFetch('/api/v1/health'),
        checkMonitoringHealth(),
      ])
      return true
    },
    retry: false,
    refetchInterval: 30_000,
  })
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const onSubmit = handleSubmit(async (payload) => {
    setServerError('')
    try {
      await login(payload)
      const state = location.state as LoginLocationState | null
      navigate(state?.from && state.from !== '/login' ? state.from : '/dashboard', { replace: true })
    } catch (loginError) {
      if (loginError instanceof ApiError && loginError.status === 403) {
        setServerError('Akun ini tidak memiliki akses HRD ke aplikasi monitoring.')
      } else {
        setServerError(getErrorMessage(loginError, 'Login gagal. Periksa email dan password Anda.'))
      }
    }
  })

  return (
    <main className="grid min-h-svh bg-[#f5f6f8] lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-[#8e1712] via-[#ae211a] to-[#d34a40] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -right-20 size-80 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full border border-white/10 bg-black/5" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm">
            <ShieldCheck size={16} /> Area terbatas HRD
          </div>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-3 text-xs font-bold tracking-[.18em] text-white/65 uppercase">Dexa People Monitor</p>
          <h1 className="m-0 font-display text-4xl leading-tight font-extrabold xl:text-5xl">Kelola data karyawan dengan aman dari satu tempat.</h1>
          <p className="mt-5 mb-0 max-w-lg text-sm leading-7 text-white/72">Masuk menggunakan akun HRD yang telah terdaftar untuk membuka dashboard monitoring.</p>
        </div>
        <div className="relative space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/72">
            <span className={`size-2 rounded-full ${healthError ? 'bg-[#ffb0aa]' : healthIsLoading ? 'bg-[#ffd37c]' : 'bg-[#79e8a6] shadow-[0_0_0_5px_rgba(121,232,166,.14)]'}`} />
            {healthError ? 'Backend tidak terhubung' : healthIsLoading ? 'Memeriksa layanan...' : 'Sistem operasional normal'}
          </div>
          <p className="m-0 text-xs text-white/55">Dexa Group · People Operations</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex h-20 w-[210px] items-center overflow-hidden rounded-2xl bg-[#f5f6f8] px-2">
            <img className="block h-full w-full object-cover object-center mix-blend-multiply" src={dexaGroupImage} alt="Dexa Group" />
          </div>
          <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><LockKeyhole size={23} /></span>
          <h2 className="m-0 font-display text-2xl font-extrabold text-[#303137] sm:text-3xl">Masuk sebagai HRD</h2>
          <p className="mt-2 mb-7 text-sm leading-6 text-[#85878f]">Gunakan email perusahaan dan password akun HRD Anda.</p>

          <form className="surface space-y-5 p-5 sm:p-7" onSubmit={onSubmit} autoComplete="off" noValidate>
            {healthError ? <div className="rounded-xl bg-[#fff6e8] px-3.5 py-3 text-xs leading-5 text-[#8d5b1c]" role="status">{getErrorMessage(healthError)}</div> : null}
            {serverError ? <div className="rounded-xl bg-brand-soft px-3.5 py-3 text-xs text-[#9b1d17]" role="alert">{serverError}</div> : null}
            <Input
              autoComplete="off"
              error={errors.email?.message}
              label="Email perusahaan"
              leadingIcon={<Mail size={18} />}
              placeholder="hrd@dexagroup.com"
              type="email"
              {...register('email')}
            />
            <Input
              autoComplete="off"
              error={errors.password?.message}
              label="Password"
              leadingIcon={<LockKeyhole size={18} />}
              placeholder="Masukkan password"
              trailingAction={(
                <button
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[#62646c]"><input className="size-4 accent-brand" type="checkbox" {...register('rememberMe')} /><span>Ingat saya</span></label>
            <Button className="w-full" isLoading={isSubmitting} type="submit">Masuk ke Dashboard</Button>
          </form>

          <p className="mt-5 mb-0 text-center text-[11px] leading-5 text-[#96989f]">Akses hanya diberikan kepada akun dengan izin HRD.</p>
        </div>
      </section>
    </main>
  )
}
