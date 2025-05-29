import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Settings, BarChart3, Mail, FileText, Image, Save, Upload, LogOut, Eye, EyeOff, Palette, Monitor, Code, Globe, MessageSquare, Briefcase, User, MapPin, Phone, Trash2, Clock, CheckCircle, Calendar } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, forgotPasswordSchema, resetPasswordSchema, type AdminLoginData, type ForgotPasswordData, type ResetPasswordData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

function AdminLogin() {
  const { loginMutation } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { toast } = useToast();
  
  const form = useForm<AdminLoginData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgotForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "shishirxkandel@gmail.com",
    },
  });

  const resetForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
    },
  });

  const onSubmit = (data: AdminLoginData) => {
    loginMutation.mutate(data);
  };

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await apiRequest("POST", "/api/admin/forgot-password", data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      setResetEmail(variables.email);
      setShowForgotPassword(false);
      setShowResetForm(true);
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const res = await apiRequest("POST", "/api/admin/reset-password", data);
      return res.json();
    },
    onSuccess: () => {
      setShowResetForm(false);
      setShowForgotPassword(false);
      resetForm.reset();
      forgotForm.reset();
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully. You can now login.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  const onForgotSubmit = (data: ForgotPasswordData) => {
    forgotPasswordMutation.mutate(data);
  };

  const onResetSubmit = (data: ResetPasswordData) => {
    resetPasswordMutation.mutate({
      ...data,
      email: resetEmail,
    });
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email to receive an OTP for password reset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...forgotForm}>
                <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                  <FormField
                    control={forgotForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            readOnly
                            className="bg-muted cursor-not-allowed"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Password reset is only available for the authorized admin email
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter the OTP sent to {resetEmail} and your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Code</FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setShowResetForm(false);
                        setShowForgotPassword(true);
                      }}
                    >
                      Back to Email Entry
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email"
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
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { admin, logoutMutation } = useAdminAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Site content state with logo functionality
  const [siteContent, setSiteContent] = useState({
    siteName: "Shishir Kandel",
    siteTagline: "Full Stack Developer",
    logoUrl: "", // Admin can add logo
    logoText: "SK", // Fallback initials
    heroTitle: "Full Stack Developer & UI/UX Designer",
    heroSubtitle: "Crafting digital experiences with clean code and thoughtful design",
    aboutTitle: "About Me",
    aboutContent: "I'm a passionate full-stack developer with expertise in modern web technologies. I specialize in creating modern, responsive web applications using cutting-edge technologies like React, Node.js, and various databases. My goal is to build solutions that not only look great but also provide exceptional user experiences.",
    contactEmail: "shishirxkandel@gmail.com",
    contactPhone: "+977 9848960692",
    contactLocation: "Bharatpur, Nepal",
    github: "https://github.com/Shishirkdl",
    linkedin: "https://www.linkedin.com/in/shishirkandel/",
    facebook: "https://www.facebook.com/shishir.kandel.772476",
    instagram: "https://www.instagram.com/the_shishir.kandel/"
  });

  // Projects state
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce solution built with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      imageUrl: "https://via.placeholder.com/400x250",
      liveUrl: "https://example.com",
      codeUrl: "https://github.com/example"
    }
  ]);

  // Skills state
  const [skills, setSkills] = useState([
    { name: "JavaScript", percentage: 95, color: "#f7df1e" },
    { name: "React", percentage: 90, color: "#61dafb" },
    { name: "Node.js", percentage: 85, color: "#68a063" },
    { name: "Python", percentage: 80, color: "#3776ab" }
  ]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSaveContent = () => {
    toast({
      title: "Content saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const addProject = () => {
    const newProject = {
      id: projects.length + 1,
      title: "New Project",
      description: "Project description",
      technologies: ["React"],
      imageUrl: "https://via.placeholder.com/400x250",
      liveUrl: "",
      codeUrl: ""
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: number, field: string, value: any) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const addSkill = () => {
    const newSkill = {
      name: "New Skill",
      percentage: 50,
      color: "#6366f1"
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (index: number, field: string, value: any) => {
    setSkills(skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    ));
  };

  const deleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Fetch contacts
  const { data: contacts = [], refetch: refetchContacts } = useQuery({
    queryKey: ["/api/admin/contacts"],
    enabled: true,
  });

  // Type-safe contacts array
  const contactsList = Array.isArray(contacts) ? contacts : [];

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      await apiRequest("DELETE", `/api/admin/contacts/${contactId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Contact deleted",
        description: "Contact message has been removed.",
      });
    },
  });

  // Update contact status
  const updateContactStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/admin/contacts/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({
        title: "Status updated",
        description: "Contact status has been updated.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {siteContent.logoUrl ? (
              <img src={siteContent.logoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {siteContent.logoText}
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <Badge variant="outline" className="text-xs">SECURE</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Welcome, {admin?.username}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground">Manage in Projects tab</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills Listed</CardTitle>
                  <Code className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{skills.length}</div>
                  <p className="text-xs text-muted-foreground">Manage in Skills tab</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Site Sections</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Hero, About, Skills, Projects, Contact</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to manage your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab("branding")} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Palette className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Site Branding</div>
                    <div className="text-xs text-muted-foreground">Logo, name, and visual identity</div>
                  </div>
                </Button>
                
                <Button onClick={() => setActiveTab("content")} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <User className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Edit Site Content</div>
                    <div className="text-xs text-muted-foreground">Update hero, about, and contact info</div>
                  </div>
                </Button>
                
                <Button onClick={() => setActiveTab("projects")} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Manage Projects</div>
                    <div className="text-xs text-muted-foreground">Add, edit, or remove portfolio projects</div>
                  </div>
                </Button>
                
                <Button onClick={() => setActiveTab("contacts")} variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">View Messages</div>
                    <div className="text-xs text-muted-foreground">
                      {contactsList.length > 0 ? `${contactsList.length} messages` : "No new messages"}
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Site Branding & Identity
                </CardTitle>
                <CardDescription>
                  Manage your site's visual identity, logo, and branding elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Brand Identity</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={siteContent.siteName}
                        onChange={(e) => setSiteContent({...siteContent, siteName: e.target.value})}
                        placeholder="Your name or brand"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteTagline">Site Tagline</Label>
                      <Input
                        id="siteTagline"
                        value={siteContent.siteTagline}
                        onChange={(e) => setSiteContent({...siteContent, siteTagline: e.target.value})}
                        placeholder="Your professional title"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Logo Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logoUrl">Logo Image URL</Label>
                      <Input
                        id="logoUrl"
                        value={siteContent.logoUrl}
                        onChange={(e) => setSiteContent({...siteContent, logoUrl: e.target.value})}
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to use text initials instead
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="logoText">Logo Text/Initials (fallback)</Label>
                      <Input
                        id="logoText"
                        value={siteContent.logoText}
                        onChange={(e) => setSiteContent({...siteContent, logoText: e.target.value})}
                        placeholder="SK"
                        maxLength={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used when no logo image is provided (max 3 characters)
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                    <Label className="text-sm font-medium">Logo Preview</Label>
                    <div className="flex items-center gap-3 mt-2">
                      {siteContent.logoUrl ? (
                        <img 
                          src={siteContent.logoUrl} 
                          alt="Logo preview" 
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {siteContent.logoText}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{siteContent.siteName}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">{siteContent.siteTagline}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveContent} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Branding
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Site Content Management
                </CardTitle>
                <CardDescription>
                  Edit your site's main content, hero section, about section, and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Hero Section</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="heroTitle">Hero Title</Label>
                      <Input
                        id="heroTitle"
                        value={siteContent.heroTitle}
                        onChange={(e) => setSiteContent({...siteContent, heroTitle: e.target.value})}
                        placeholder="Your main headline"
                      />
                    </div>
                    <div>
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Textarea
                        id="heroSubtitle"
                        value={siteContent.heroSubtitle}
                        onChange={(e) => setSiteContent({...siteContent, heroSubtitle: e.target.value})}
                        placeholder="Your subtitle or tagline"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* About Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About Section</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="aboutTitle">About Title</Label>
                      <Input
                        id="aboutTitle"
                        value={siteContent.aboutTitle}
                        onChange={(e) => setSiteContent({...siteContent, aboutTitle: e.target.value})}
                        placeholder="About section title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="aboutContent">About Content</Label>
                      <Textarea
                        id="aboutContent"
                        value={siteContent.aboutContent}
                        onChange={(e) => setSiteContent({...siteContent, aboutContent: e.target.value})}
                        placeholder="Tell visitors about yourself"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={siteContent.contactEmail}
                        onChange={(e) => setSiteContent({...siteContent, contactEmail: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        value={siteContent.contactPhone}
                        onChange={(e) => setSiteContent({...siteContent, contactPhone: e.target.value})}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="contactLocation">Location</Label>
                      <Input
                        id="contactLocation"
                        value={siteContent.contactLocation}
                        onChange={(e) => setSiteContent({...siteContent, contactLocation: e.target.value})}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Media Links</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={siteContent.github}
                        onChange={(e) => setSiteContent({...siteContent, github: e.target.value})}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={siteContent.linkedin}
                        onChange={(e) => setSiteContent({...siteContent, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input
                        id="facebook"
                        value={siteContent.facebook}
                        onChange={(e) => setSiteContent({...siteContent, facebook: e.target.value})}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input
                        id="instagram"
                        value={siteContent.instagram}
                        onChange={(e) => setSiteContent({...siteContent, instagram: e.target.value})}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveContent} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Content Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Management Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Projects Management
                  </CardTitle>
                  <CardDescription>
                    Add, edit, and manage your portfolio projects
                  </CardDescription>
                </div>
                <Button onClick={addProject} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">Project {project.id}</h3>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`project-title-${project.id}`}>Title</Label>
                        <Input
                          id={`project-title-${project.id}`}
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          placeholder="Project title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`project-image-${project.id}`}>Image URL</Label>
                        <Input
                          id={`project-image-${project.id}`}
                          value={project.imageUrl}
                          onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="Describe your project"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`project-live-${project.id}`}>Live URL</Label>
                        <Input
                          id={`project-live-${project.id}`}
                          value={project.liveUrl}
                          onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                          placeholder="https://project-demo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`project-code-${project.id}`}>Code URL</Label>
                        <Input
                          id={`project-code-${project.id}`}
                          value={project.codeUrl}
                          onChange={(e) => updateProject(project.id, 'codeUrl', e.target.value)}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`project-tech-${project.id}`}>Technologies (comma-separated)</Label>
                      <Input
                        id={`project-tech-${project.id}`}
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(', ').filter(t => t.trim()))}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveContent} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Management Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Skills Management
                  </CardTitle>
                  <CardDescription>
                    Manage your technical skills and proficiency levels
                  </CardDescription>
                </div>
                <Button onClick={addSkill} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">Skill {index + 1}</h3>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteSkill(index)}
                      >
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                        <Input
                          id={`skill-name-${index}`}
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          placeholder="JavaScript"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`skill-percentage-${index}`}>Proficiency %</Label>
                        <Input
                          id={`skill-percentage-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          value={skill.percentage}
                          onChange={(e) => updateSkill(index, 'percentage', parseInt(e.target.value))}
                          placeholder="85"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`skill-color-${index}`}>Color</Label>
                        <Input
                          id={`skill-color-${index}`}
                          type="color"
                          value={skill.color}
                          onChange={(e) => updateSkill(index, 'color', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveContent} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Management Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Messages ({contactsList.length})
                </CardTitle>
                <CardDescription>
                  View and manage contact form submissions from your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactsList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No contact messages yet.</p>
                    <p className="text-sm">Messages from your contact form will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactsList.map((contact: any) => (
                      <div key={contact.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {contact.name}
                              </h3>
                              <Badge 
                                variant={contact.status === 'unread' ? 'destructive' : contact.status === 'read' ? 'secondary' : 'default'}
                                className="text-xs"
                              >
                                {contact.status || 'unread'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateContactStatusMutation.mutate({ 
                                id: contact.id, 
                                status: contact.status === 'unread' ? 'read' : 'replied' 
                              })}
                              disabled={updateContactStatusMutation.isPending}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {contact.status === 'unread' ? 'Mark Read' : 'Mark Replied'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteContactMutation.mutate(contact.id)}
                              disabled={deleteContactMutation.isPending}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Subject
                            </Label>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {contact.subject}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Message
                            </Label>
                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded p-3 mt-1">
                              {contact.message}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t">
                          <span>Contact ID: #{contact.id}</span>
                          <span>
                            Received: {new Date(contact.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}