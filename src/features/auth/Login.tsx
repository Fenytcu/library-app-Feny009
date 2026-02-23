import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Eye, EyeOff } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authApi } from "./authApi"
import { useAppDispatch } from "@/store/hooks" 
import { setCredentials } from "./authSlice"
import { toast } from "sonner"

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      })

      if (response.success && response.data) {
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }))
        toast.success("Login successful!")
        // Redirect based on role
        if (response.data.user.role === 'ADMIN') {
          navigate("/admin/borrowed-list")
        } else {
          navigate("/")
        }
      } else {
        toast.error(response.message || "Login failed")
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
      let errorMessage = "Invalid email or password"
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-[400px] space-y-5">
        
        {/* Header Section */}
        <div className="flex flex-col font-quicksand">
          <Link to="/" className="flex items-center gap-3 mb-5 hover:opacity-80 transition-opacity">
             <img src="/assets/Logo.png" alt="Booky Logo" className="h-8 w-8" />
             <span className="text-[25.14px] font-bold text-neutral-950">Booky</span>
          </Link>
          
          <h1 className="text-[28px] font-bold tracking-tight text-neutral-950 mb-2">Login</h1>
          <p className="text-[#414651] text-[14px] md:text-[16px]">
            Sign in to manage your library account.
          </p>
        </div>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-quicksand">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-neutral-950 text-[#0A0D12] font-bold text-[14px]">Email</FormLabel>
                  <FormControl>
                    <Input 
         
                      type="email" 
                      className="h-12 w-full rounded-[14px] border border-[#D5D7DA] px-4 py-2 focus-visible:ring-blue-600"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2 font-quicksand">
                  <FormLabel className="text-neutral-950 text-[14px] text-[#0A0D12] font-bold">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                      
                        type={showPassword ? "text" : "password"} 
                        className="h-12 w-full rounded-[14px] border border-[#D5D7DA] pl-4 pr-10 py-2 focus-visible:ring-blue-600"
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-none" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-slate-600">Don't have an account? </span>
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Register
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
