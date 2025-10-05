import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().max(100).optional(),
});

type AuthFormValues = {
  email: string;
  password: string;
  full_name?: string;
};

const setSeo = () => {
  const title = "Register or Sign In – Car Gallery Account";
  const description = "Create your account or sign in to explore our latest car gallery.";
  document.title = title;

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", description);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", window.location.href);
};

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const form = useForm<AuthFormValues>({
    defaultValues: { email: "", password: "", full_name: "" },
  });

  useEffect(() => {
    setSeo();

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async (values: AuthFormValues) => {
    try {
      // Validate with zod
      const validated = authSchema.parse({
        email: values.email.trim(),
        password: values.password,
        full_name: values.full_name?.trim(),
      });

      const email = validated.email;
      const password = validated.password;
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { full_name: validated.full_name || null },
          },
        });
        if (error) throw error;
        toast.success("Sign up successful. Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! Redirecting...");
        navigate("/");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Create your account or sign in</h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="max-w-md mx-auto rounded-xl border border-border bg-card p-6 shadow-md">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant={mode === "signin" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signin")}
            >
              Sign In
            </Button>
            <Button
              variant={mode === "signup" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("signup")}
            >
              Create Account
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="full_name"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" autoComplete={mode === "signup" ? "new-password" : "current-password"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="hero">
                {mode === "signup" ? "Create account" : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>Already have an account? <button type="button" className="underline underline-offset-4" onClick={() => setMode("signin")}>Sign in</button></>
                ) : (
                  <>New here? <button type="button" className="underline underline-offset-4" onClick={() => setMode("signup")}>Create an account</button></>
                )}
              </p>
            </form>
          </Form>
        </section>
      </main>
    </div>
  );
}