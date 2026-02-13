import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import api from '../../api/client';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

export const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { } = useAuth(); // We can login directly after register or redirect to login.
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await api.post('/api/auth/register', {
                email,
                password,
                full_name: fullName
            });

            // After successful registration, usually we redirect to login or auto-login.
            // Let's redirect to login for now to keep flow simple and secure.
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50 blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                        Create Account
                    </CardTitle>
                    <p className="text-gray-400 text-sm">Join to start signing documents securely</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    className="pl-10 bg-black/20 border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-500 hover:bg-black/30 transition-colors"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-10 bg-black/20 border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-500 hover:bg-black/30 transition-colors"
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
                                    placeholder="Create a password"
                                    className="pl-10 bg-black/20 border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-500 hover:bg-black/30 transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 shadow-lg shadow-purple-500/20"
                            isLoading={isLoading}
                        >
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/5 mt-2 pt-6">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};
