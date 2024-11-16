// authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Ação assíncrona para o login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, senha }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      
      if (!response.ok) {
        throw new Error("Login falhou. Verifique suas credenciais.");
      }
      
      const data = await response.json();
      // Armazena o token no localStorage para persistência
      sessionStorage.setItem("token", data.token);
      return data; // Exemplo: { user, token }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Função para carregar o estado inicial a partir do localStorage
const loadInitialState = () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Aqui, você poderia adicionar uma verificação de validade do token
    // (por exemplo, verificar expiração de token JWT)
    return {
      isAuthenticated: true,
      token: token,
      user: null,  // poderia ser atualizado com dados do usuário do token JWT se disponível
      loading: false,
      error: null,
    };
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  };
};

// Slice de autenticação
const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      // Remove o token do localStorage no logout
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Exportação da ação logout e do reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
