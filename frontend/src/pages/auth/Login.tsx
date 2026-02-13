import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import api from '../../api/client';
import { Lock, Mail } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // URLSearchParams is the standard way to send x-www-form-urlencoded data
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await api.post('/api/auth/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = response.data;

            // Fetch user details after login
            // Assuming there's a /users/me endpoint or decoding logic. 
            // For now, let's just create a user object from email or decode token if needed.
            // Ideally, the backend should return user info or we fetch it.
            // Let's decode the token for a basic check or assumes the user email.
            // NOTE: In a real app we'd fetch the user profile here.
            const user = { id: 0, email: email }; // Placeholder user object

            login(access_token, user);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        Welcome Back
                    </CardTitle>
                    <p className="text-gray-400 text-sm">Enter your credentials to access your workspace</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 bg-black/20 border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-500 hover:bg-black/30 transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-black/20 border-white/10 focus:border-blue-500/50 text-white placeholder:text-gray-500 hover:bg-black/30 transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 shadow-lg shadow-blue-500/20"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 mt-2 pt-6">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            create one
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
