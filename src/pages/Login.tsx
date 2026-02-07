import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, Award, BookOpen, Users } from 'lucide-react';
import collegeLogo from '@/assets/college-logo.jpg';

const Login: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState('admin@tce.edu');
  const [loginPassword, setLoginPassword] = useState('password');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      toast({ title: 'Welcome back', description: result.message });
      navigate('/dashboard');
    } else {
      toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regEmail || !regPassword) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const result = await register(regEmail, regPassword, regRole, regName);

    toast({
      title: result.success ? 'Success' : 'Error',
      description: result.message,
      variant: result.success ? 'default' : 'destructive'
    });

    if (result.success) {
      if (isAuthenticated) navigate('/dashboard');
      setRegEmail('');
      setRegPassword('');
      setRegName('');
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tce-gradient">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 tce-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCAwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="max-w-lg space-y-8 animate-fade-in">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 rounded-full bg-white/10 backdrop-blur-md p-4 border-2 border-white/20 shadow-2xl">
                <img
                  src={collegeLogo}
                  alt="TCE Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-3 tracking-tight">
                  Thiagarajar College of Engineering
                </h1>
                <div className="flex items-center justify-center gap-2 text-yellow-300">
                  <Award className="w-5 h-5" />
                  <p className="text-xl font-semibold">Autonomous Institution</p>
                </div>
                <p className="text-lg text-white/90 mt-2">Madurai, Tamil Nadu</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="glass-effect p-4 rounded-lg text-center hover-lift">
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm font-semibold">Excellence in Education</p>
              </div>
              <div className="glass-effect p-4 rounded-lg text-center hover-lift">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm font-semibold">Research & Innovation</p>
              </div>
              <div className="glass-effect p-4 rounded-lg text-center hover-lift">
                <Users className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm font-semibold">Industry Collaboration</p>
              </div>
              <div className="glass-effect p-4 rounded-lg text-center hover-lift">
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm font-semibold">NAAC A++ Accredited</p>
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-lg italic text-yellow-200">
                "Empowering Minds, Shaping Futures"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-background via-background to-muted">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 p-3 mb-4">
              <img
                src={collegeLogo}
                alt="TCE Logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-foreground">TCE</h2>
            <p className="text-sm text-muted-foreground">Thiagarajar College of Engineering</p>
          </div>

          <Card className="border-2 shadow-2xl hover-lift">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                COE Portal
              </CardTitle>
              <CardDescription className="text-center text-base">
                Controller of Examinations Management System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
                  <TabsTrigger value="login" className="text-base font-semibold">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-base font-semibold">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-base font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@tce.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password" className="text-base font-semibold">
                          Password
                        </Label>
                        <a href="#" className="text-sm text-primary hover:text-primary/80 font-medium">
                          Forgot?
                        </a>
                      </div>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold tce-gradient hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In to Portal'
                      )}
                    </Button>
                  </form>

                  <div className="pt-4 text-center text-sm text-muted-foreground">
                    <p>Default credentials: admin@tce.edu / password</p>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="text-base font-semibold">
                        Full Name
                      </Label>
                      <Input
                        id="reg-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-base font-semibold">
                        Email Address
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="your.email@tce.edu"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-base font-semibold">
                        Password
                      </Label>
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="h-11 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-role" className="text-base font-semibold">
                        Role
                      </Label>
                      <Select value={regRole} onValueChange={(v) => setRegRole(v as UserRole)}>
                        <SelectTrigger className="h-11 text-base">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold tce-gradient hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Thiagarajar College of Engineering. All rights reserved.</p>
            <p className="mt-1">Affiliated to Anna University, Chennai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
