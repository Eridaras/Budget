import React, { useState } from 'react';
import { TextField, Button, Card, Typography } from '@mui/material';
import Logo from '../assets/logo_chaide.svg';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('[LOGIN] Intento con usuario:', username);

    try {
      const data = await loginUser(username, password);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('usuarioNombre', data.user.displayName);

      console.log('[LOGIN] Token y displayName guardados, redirigiendo…');
      navigate('/presupuestos');
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <img src={Logo} alt="Chaide Logo" className="login-logo" />
        <Typography variant="h5" className="login-title">
          Presupuesto de Gastos
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Usuario"
            margin="normal"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{ className: 'input-field' }}
          />

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Contraseña"
            type="password"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ className: 'input-field' }}
          />

          {error && (
            <Typography className="error-text">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
