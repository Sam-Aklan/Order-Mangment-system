"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema, AuthSchemaType } from "@/lib/validations/authVaildation"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { use } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

    const router = useRouter()

    const form = useForm < AuthSchemaType> ({
    resolver: zodResolver(authSchema),
    defaultValues:{
        email:'',
        password:''
    }

  })

  async function onSubmit(values: AuthSchemaType ) {
    try {
      
            const {email,password} = values;
        
            const res = await signIn.email({
              email: email,
              password: password,
            })
        
            if (res.error) {
              console.log(res.error || "Something went wrong.");
            } else {
              router.push("/dashboard");
            }
    
    } catch (error) {
      console.error("Form submission error", error);
    
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent >
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-auto py-10">
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="enter your email"
                
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="enter your password"
                
                type="password"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </CardContent>
      </Card>
    </div>
  )
}
