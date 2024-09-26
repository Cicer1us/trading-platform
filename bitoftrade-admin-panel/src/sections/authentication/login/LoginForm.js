import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { Alert, LoadingButton } from '@mui/lab';
// component
import axios from '../../../utils/axiosInstance';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const LoginSchema = Yup.object().shape({
    login: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    pin: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
      pin: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      setError(null);
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/admin-auth/sign-in`,
        formik.values
      );

      if (res.status === 201) {
        localStorage.setItem('user', res.data);
        axios.defaults.headers.common.Authorization = `Bearer ${res.data}`;
        navigate('/dashboard/app', { replace: true });
      }
      const { message } = JSON.parse(res.request.responseText);
      setError(message);
      formik.setSubmitting(false);
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="login"
            type="login"
            label="Login"
            {...getFieldProps('login')}
            error={Boolean(touched.login && errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <TextField
            fullWidth
            autoComplete="pin"
            type="pin"
            label="Pin"
            {...getFieldProps('pin')}
            error={Boolean(touched.pin && errors.pin)}
            helperText={touched.pin && errors.pin}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            style={{ marginTop: '25px' }}
          >
            Sign-in
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
